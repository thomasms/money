// Rates and thresholds for employees in England, Wales and Northern Ireland.
// Source: https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027
// (and the matching pages for earlier years).

export interface Repayment {
  threshold: number;
  rate: number;
}

export interface TaxYearRules {
  id: string;
  label: string;
  incomeTax: {
    personalAllowance: number;
    // Income above this loses £1 of allowance for every £2.
    allowanceTaperStart: number;
    basicRateBand: number;
    // Taxable income above this pays the additional rate.
    additionalRateThreshold: number;
    basicRate: number;
    higherRate: number;
    additionalRate: number;
  };
  nationalInsurance: {
    primaryThreshold: number;
    upperEarningsLimit: number;
    mainRate: number;
    upperRate: number;
  };
  studentLoans: {
    plan1: Repayment;
    plan2: Repayment;
    plan4: Repayment;
    // Plan 5 repayments start in April 2026.
    plan5?: Repayment;
    postgraduate: Repayment;
  };
}

const INCOME_TAX = {
  personalAllowance: 12570,
  allowanceTaperStart: 100000,
  basicRateBand: 37700,
  additionalRateThreshold: 125140,
  basicRate: 0.2,
  higherRate: 0.4,
  additionalRate: 0.45,
};

const NATIONAL_INSURANCE = {
  primaryThreshold: 12570,
  upperEarningsLimit: 50270,
  mainRate: 0.08,
  upperRate: 0.02,
};

export const TAX_YEARS: TaxYearRules[] = [
  {
    id: '2026-27',
    label: '2026/27',
    incomeTax: INCOME_TAX,
    nationalInsurance: NATIONAL_INSURANCE,
    studentLoans: {
      plan1: { threshold: 26900, rate: 0.09 },
      plan2: { threshold: 29385, rate: 0.09 },
      plan4: { threshold: 33795, rate: 0.09 },
      plan5: { threshold: 25000, rate: 0.09 },
      postgraduate: { threshold: 21000, rate: 0.06 },
    },
  },
  {
    id: '2025-26',
    label: '2025/26',
    incomeTax: INCOME_TAX,
    nationalInsurance: NATIONAL_INSURANCE,
    studentLoans: {
      plan1: { threshold: 26065, rate: 0.09 },
      plan2: { threshold: 28470, rate: 0.09 },
      plan4: { threshold: 32745, rate: 0.09 },
      postgraduate: { threshold: 21000, rate: 0.06 },
    },
  },
  {
    id: '2024-25',
    label: '2024/25',
    incomeTax: INCOME_TAX,
    nationalInsurance: NATIONAL_INSURANCE,
    studentLoans: {
      plan1: { threshold: 24990, rate: 0.09 },
      plan2: { threshold: 27295, rate: 0.09 },
      plan4: { threshold: 31395, rate: 0.09 },
      postgraduate: { threshold: 21000, rate: 0.06 },
    },
  },
];

export const DEFAULT_TAX_YEAR = TAX_YEARS[0];

export function findTaxYear(id: string | null | undefined): TaxYearRules {
  return TAX_YEARS.find((year) => year.id === id) ?? DEFAULT_TAX_YEAR;
}
