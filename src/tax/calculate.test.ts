import { describe, expect, it } from 'vitest';
import {
  calculate,
  forPeriod,
  incomeTax,
  loanRepayment,
  marginalRate,
  nationalInsurance,
  type Inputs,
} from './calculate';
import { findTaxYear, type TaxYearRules } from './years';

const Y2627 = findTaxYear('2026-27');
const Y2425 = findTaxYear('2024-25');

// Older years, kept here to check the maths against the original app's tests.
function legacyYear(pa: number, band: number, pt: number, uel: number, plan1: number): TaxYearRules {
  return {
    ...Y2627,
    incomeTax: { ...Y2627.incomeTax, personalAllowance: pa, basicRateBand: band, additionalRateThreshold: 150000 },
    nationalInsurance: { primaryThreshold: pt, upperEarningsLimit: uel, mainRate: 0.12, upperRate: 0.02 },
    studentLoans: { ...Y2627.studentLoans, plan1: { threshold: plan1, rate: 0.09 } },
  };
}
const Y1819 = legacyYear(11850, 34500, 8424, 46350, 18330);
const Y1718 = legacyYear(11500, 33500, 8164, 45032, 17775);

const BASE: Inputs = {
  salary: 0,
  bonus: 0,
  pensionPercent: 0,
  pensionMethod: 'standard',
  studentLoan: 'none',
  postgraduateLoan: false,
  otherSacrificeMonthly: 0,
};

describe('income tax', () => {
  it.each([
    [-100000, 0], [0, 0], [11850, 0], [11851, 0.2], [12000, 30], [38000, 5230],
    [100000, 28360], [120000, 40360], [150000, 53100], [200000, 75600],
  ])('2018/19: £%d pays £%d', (gross, tax) => {
    expect(incomeTax(gross, Y1819)).toBeCloseTo(tax, 4);
  });

  it.each([
    [11500, 0], [11850, 70], [12000, 100], [38000, 5300],
    [100000, 28700], [120000, 40700], [150000, 53300], [200000, 75800],
  ])('2017/18: £%d pays £%d', (gross, tax) => {
    expect(incomeTax(gross, Y1718)).toBeCloseTo(tax, 4);
  });

  it.each([
    [12570, 0], [35000, 4486], [50270, 7540], [60000, 11432],
    // Personal allowance tapers away between £100,000 and £125,140.
    [110000, 33432], [125140, 42516], [130000, 44703],
  ])('2026/27: £%d pays £%d', (gross, tax) => {
    expect(incomeTax(gross, Y2627)).toBeCloseTo(tax, 4);
  });
});

describe('national insurance', () => {
  it.each([
    [-1, 0], [8424, 0], [8425, 0.12], [11850, 411.12], [38000, 3549.12],
    [46383, 4551.78], [50000, 4624.12], [200000, 7624.12],
  ])('2018/19: £%d pays £%d', (gross, ni) => {
    expect(nationalInsurance(gross, Y1819)).toBeCloseTo(ni, 4);
  });

  it.each([
    [8164, 0], [8165, 0.12], [38000, 3580.32], [45001, 4420.44], [100000, 5523.52],
  ])('2017/18: £%d pays £%d', (gross, ni) => {
    expect(nationalInsurance(gross, Y1718)).toBeCloseTo(ni, 4);
  });

  it.each([
    [12570, 0], [35000, 1794.4], [50270, 3016], [60000, 3210.6],
  ])('2026/27: £%d pays £%d', (gross, ni) => {
    expect(nationalInsurance(gross, Y2627)).toBeCloseTo(ni, 4);
  });
});

describe('student loans', () => {
  it.each([
    [0, 0], [18330, 0], [18331, 0.09], [38000, 1770.3], [200000, 16350.3],
  ])('plan 1, 2018/19: £%d repays £%d', (gross, repaid) => {
    expect(loanRepayment(gross, Y1819.studentLoans.plan1)).toBeCloseTo(repaid, 4);
  });

  it('uses the correct threshold for each plan', () => {
    expect(loanRepayment(40000, Y2627.studentLoans.plan1)).toBeCloseTo((40000 - 26900) * 0.09, 4);
    expect(loanRepayment(40000, Y2627.studentLoans.plan2)).toBeCloseTo(955.35, 4);
    expect(loanRepayment(40000, Y2627.studentLoans.plan4)).toBeCloseTo((40000 - 33795) * 0.09, 4);
    expect(loanRepayment(40000, Y2627.studentLoans.postgraduate)).toBeCloseTo(1140, 4);
  });

  it('has no Plan 5 repayments before 2026/27', () => {
    const inputs: Inputs = { ...BASE, salary: 40000, studentLoan: 'plan5' };
    expect(calculate(inputs, Y2425).studentLoan).toBe(0);
    expect(calculate(inputs, Y2627).studentLoan).toBeCloseTo(1350, 4);
  });
});

describe('calculate', () => {
  it('works out take-home pay for a simple salary', () => {
    const result = calculate({ ...BASE, salary: 35000 }, Y2627);
    expect(result.incomeTax).toBeCloseTo(4486, 4);
    expect(result.nationalInsurance).toBeCloseTo(1794.4, 4);
    expect(result.takeHome).toBeCloseTo(28719.6, 4);
    expect(forPeriod(result.takeHome, 'month')).toBeCloseTo(2393.3, 4);
  });

  it('takes a standard pension from taxable pay but not from NI pay', () => {
    const result = calculate({ ...BASE, salary: 40000, pensionPercent: 5, studentLoan: 'plan2' }, Y2627);
    expect(result.pension).toBe(2000);
    expect(result.incomeTax).toBeCloseTo((38000 - 12570) * 0.2, 4);
    expect(result.nationalInsurance).toBeCloseTo((40000 - 12570) * 0.08, 4);
    expect(result.studentLoan).toBeCloseTo((40000 - 29385) * 0.09, 4);
  });

  it('takes a salary sacrifice pension from tax, NI and student loan pay', () => {
    const result = calculate(
      { ...BASE, salary: 40000, pensionPercent: 5, pensionMethod: 'sacrifice', studentLoan: 'plan2' },
      Y2627,
    );
    expect(result.incomeTax).toBeCloseTo((38000 - 12570) * 0.2, 4);
    expect(result.nationalInsurance).toBeCloseTo((38000 - 12570) * 0.08, 4);
    expect(result.studentLoan).toBeCloseTo((38000 - 29385) * 0.09, 4);
  });

  it('charges no pension on bonus pay', () => {
    const result = calculate({ ...BASE, salary: 30000, bonus: 10000, pensionPercent: 10 }, Y2627);
    expect(result.gross).toBe(40000);
    expect(result.pension).toBe(3000);
  });

  it('takes other salary sacrifice from all pay', () => {
    const result = calculate({ ...BASE, salary: 40000, otherSacrificeMonthly: 100 }, Y2627);
    expect(result.otherSacrifice).toBe(1200);
    expect(result.nationalInsurance).toBeCloseTo((38800 - 12570) * 0.08, 4);
    expect(result.takeHome).toBeCloseTo(
      40000 - 1200 - (38800 - 12570) * 0.2 - (38800 - 12570) * 0.08,
      4,
    );
  });
});

describe('marginal rate', () => {
  it.each([
    [10000, 0], [30000, 0.28], [60000, 0.42], [110000, 0.62], [200000, 0.47],
  ])('2026/27 at £%d is %d', (salary, rate) => {
    expect(marginalRate({ ...BASE, salary }, Y2627)).toBeCloseTo(rate, 6);
  });

  it('includes student loan repayments', () => {
    expect(marginalRate({ ...BASE, salary: 40000, studentLoan: 'plan2' }, Y2627)).toBeCloseTo(0.37, 6);
  });
});
