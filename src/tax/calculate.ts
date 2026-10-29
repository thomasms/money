import type { Repayment, TaxYearRules } from './years';

export type StudentLoanPlan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'plan5';
export type PensionMethod = 'standard' | 'sacrifice';
export type Period = 'year' | 'month' | 'week' | 'day';

export interface Inputs {
  // Annual pensionable salary.
  salary: number;
  // Annual bonus, overtime or other pay with no pension contribution.
  bonus: number;
  // Employee pension contribution, as a percentage of salary.
  pensionPercent: number;
  pensionMethod: PensionMethod;
  studentLoan: StudentLoanPlan;
  postgraduateLoan: boolean;
  // Other salary sacrifice per month, for example childcare vouchers.
  otherSacrificeMonthly: number;
}

export interface Breakdown {
  gross: number;
  incomeTax: number;
  nationalInsurance: number;
  pension: number;
  studentLoan: number;
  otherSacrifice: number;
  takeHome: number;
  personalAllowance: number;
  taxableIncome: number;
}

export const PERIOD_DIVISORS: Record<Period, number> = {
  year: 1,
  month: 12,
  // Assumes 52 weeks in a year and 7 days in a week.
  week: 52,
  day: 52 * 7,
};

export function forPeriod(annual: number, period: Period): number {
  return annual / PERIOD_DIVISORS[period];
}

export function personalAllowance(income: number, rules: TaxYearRules): number {
  const { personalAllowance, allowanceTaperStart } = rules.incomeTax;
  const reduction = Math.max(0, (income - allowanceTaperStart) / 2);
  return Math.max(0, personalAllowance - reduction);
}

// Income tax on income after pension and salary sacrifice.
export function incomeTax(income: number, rules: TaxYearRules): number {
  const r = rules.incomeTax;
  const taxable = Math.max(0, income - personalAllowance(income, rules));
  const basic = Math.min(taxable, r.basicRateBand);
  const higher = clamp(taxable - r.basicRateBand, 0, r.additionalRateThreshold - r.basicRateBand);
  const additional = Math.max(0, taxable - r.additionalRateThreshold);
  return basic * r.basicRate + higher * r.higherRate + additional * r.additionalRate;
}

// Employee Class 1 National Insurance, worked out on an annual basis.
export function nationalInsurance(earnings: number, rules: TaxYearRules): number {
  const { primaryThreshold, upperEarningsLimit, mainRate, upperRate } = rules.nationalInsurance;
  const main = clamp(earnings - primaryThreshold, 0, upperEarningsLimit - primaryThreshold);
  const upper = Math.max(0, earnings - upperEarningsLimit);
  return main * mainRate + upper * upperRate;
}

export function loanRepayment(earnings: number, plan: Repayment | undefined): number {
  if (!plan) return 0;
  return Math.max(0, earnings - plan.threshold) * plan.rate;
}

export function studentLoanRepayment(
  earnings: number,
  plan: StudentLoanPlan,
  postgraduate: boolean,
  rules: TaxYearRules,
): number {
  const undergraduate = plan === 'none' ? 0 : loanRepayment(earnings, rules.studentLoans[plan]);
  const postgrad = postgraduate ? loanRepayment(earnings, rules.studentLoans.postgraduate) : 0;
  return undergraduate + postgrad;
}

export function calculate(inputs: Inputs, rules: TaxYearRules): Breakdown {
  const salary = Math.max(0, inputs.salary);
  const bonus = Math.max(0, inputs.bonus);
  const gross = salary + bonus;
  const pension = salary * clamp(inputs.pensionPercent, 0, 100) / 100;
  const otherSacrifice = Math.min(Math.max(0, inputs.otherSacrificeMonthly) * 12, gross);

  // Salary sacrifice lowers the pay that NI and student loans are charged on.
  // A standard (net pay) pension only lowers the pay that income tax is charged on.
  const sacrificedPension = inputs.pensionMethod === 'sacrifice' ? pension : 0;
  const niEarnings = Math.max(0, gross - otherSacrifice - sacrificedPension);
  const taxableIncome = Math.max(0, gross - otherSacrifice - pension);

  const tax = incomeTax(taxableIncome, rules);
  const ni = nationalInsurance(niEarnings, rules);
  const loan = studentLoanRepayment(niEarnings, inputs.studentLoan, inputs.postgraduateLoan, rules);

  return {
    gross,
    incomeTax: tax,
    nationalInsurance: ni,
    pension,
    studentLoan: loan,
    otherSacrifice,
    takeHome: gross - tax - ni - pension - loan - otherSacrifice,
    personalAllowance: personalAllowance(taxableIncome, rules),
    taxableIncome,
  };
}

// The share of the next £100 of salary lost to income tax, NI and student loan.
// Pension is left out because it stays your money.
export function marginalRate(inputs: Inputs, rules: TaxYearRules, step = 100): number {
  const deductions = (b: Breakdown) => b.incomeTax + b.nationalInsurance + b.studentLoan;
  const now = calculate(inputs, rules);
  const next = calculate({ ...inputs, salary: inputs.salary + step }, rules);
  return (deductions(next) - deductions(now)) / step;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
