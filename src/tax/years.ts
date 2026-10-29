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
  // Shown to the user when the year needs explaining.
  note?: string;
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

// Before April 2023 the additional rate started at £150,000.
const INCOME_TAX_TO_2023 = { ...INCOME_TAX, additionalRateThreshold: 150000 };

const POSTGRADUATE = { threshold: 21000, rate: 0.06 };

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
      postgraduate: POSTGRADUATE,
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
      postgraduate: POSTGRADUATE,
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
      postgraduate: POSTGRADUATE,
    },
  },
  {
    id: '2023-24',
    label: '2023/24',
    incomeTax: INCOME_TAX,
    // NI fell from 12% to 10% on 6 January 2024. This is HMRC's annual
    // (directors') rate for the whole year: 39 weeks at 12% and 13 at 10%.
    nationalInsurance: { ...NATIONAL_INSURANCE, mainRate: 0.115 },
    studentLoans: {
      plan1: { threshold: 22015, rate: 0.09 },
      plan2: { threshold: 27295, rate: 0.09 },
      plan4: { threshold: 27660, rate: 0.09 },
      postgraduate: POSTGRADUATE,
    },
    note: 'NI changed from 12% to 10% on 6 January 2024, so this uses the blended annual rate of 11.5%.',
  },
  {
    id: '2022-23',
    label: '2022/23',
    incomeTax: INCOME_TAX_TO_2023,
    // NI changed twice in the year (threshold up in July, rates down in
    // November). These are HMRC's annual (directors') figures for the year.
    nationalInsurance: { primaryThreshold: 11908, upperEarningsLimit: 50270, mainRate: 0.1273, upperRate: 0.0273 },
    studentLoans: {
      plan1: { threshold: 20195, rate: 0.09 },
      plan2: { threshold: 27295, rate: 0.09 },
      plan4: { threshold: 25375, rate: 0.09 },
      postgraduate: POSTGRADUATE,
    },
    note: 'NI rates and thresholds changed during the year, so this uses HMRC\'s blended annual figures.',
  },
  {
    id: '2021-22',
    label: '2021/22',
    incomeTax: INCOME_TAX_TO_2023,
    nationalInsurance: { primaryThreshold: 9568, upperEarningsLimit: 50270, mainRate: 0.12, upperRate: 0.02 },
    studentLoans: {
      plan1: { threshold: 19895, rate: 0.09 },
      plan2: { threshold: 27295, rate: 0.09 },
      plan4: { threshold: 25000, rate: 0.09 },
      postgraduate: POSTGRADUATE,
    },
  },
  {
    id: '2020-21',
    label: '2020/21',
    incomeTax: { ...INCOME_TAX_TO_2023, personalAllowance: 12500, basicRateBand: 37500 },
    nationalInsurance: { primaryThreshold: 9500, upperEarningsLimit: 50000, mainRate: 0.12, upperRate: 0.02 },
    studentLoans: {
      plan1: { threshold: 19390, rate: 0.09 },
      plan2: { threshold: 26575, rate: 0.09 },
      // Plan 4 started in April 2021; before that Scottish loans used Plan 1 rules.
      plan4: { threshold: 19390, rate: 0.09 },
      postgraduate: POSTGRADUATE,
    },
  },
];

export const DEFAULT_TAX_YEAR = TAX_YEARS[0];

export function findTaxYear(id: string | null | undefined): TaxYearRules {
  return TAX_YEARS.find((year) => year.id === id) ?? DEFAULT_TAX_YEAR;
}
