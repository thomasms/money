import type { Band, BelgianYear } from './rules';

export const MAX_CHILDREN = 10;

export interface BelgianInputs {
  // Yearly gross pay, including holiday pay and any 13th month.
  salary: number;
  // Municipal surcharge, as a percentage of the income tax.
  municipalPercent: number;
  dependentChildren: number;
  singleParent: boolean;
}

export interface BelgianBreakdown {
  gross: number;
  socialSecurity: number;
  professionalExpenses: number;
  taxableIncome: number;
  taxFreeAmount: number;
  incomeTax: number;
  municipalTax: number;
  specialSocialSecurity: number;
  takeHome: number;
}

// Tax on `amount` using progressive bands.
export function bandTax(amount: number, bands: Band[]): number {
  let tax = 0;
  let lower = 0;
  for (const { upTo, rate } of bands) {
    if (amount <= lower) break;
    tax += (Math.min(amount, upTo) - lower) * rate;
    lower = upTo;
  }
  return tax;
}

export function childSupplement(children: number, rules: BelgianYear): number {
  const n = Math.max(0, Math.floor(children));
  if (n === 0) return 0;
  const { totals, perExtraChild } = rules.children;
  return n <= 4 ? totals[n - 1] : totals[3] + (n - 4) * perExtraChild;
}

export function taxFreeAmount(children: number, singleParent: boolean, rules: BelgianYear): number {
  const parent = singleParent && children > 0 ? rules.singleParent : 0;
  return rules.taxFreeAmount + childSupplement(children, rules) + parent;
}

// Personal income tax (federal and regional together) for a person taxed alone.
// The tax-free amount is taxed at the lowest bands and taken off the tax.
export function incomeTax(taxableIncome: number, rules: BelgianYear, taxFree = rules.taxFreeAmount): number {
  const tax = bandTax(taxableIncome, rules.brackets);
  const reduction = bandTax(taxFree, rules.brackets);
  return Math.max(0, tax - reduction);
}

export function specialSocialSecurity(taxableIncome: number, rules: BelgianYear): number {
  const { bands, max } = rules.specialSocialSecurity;
  return Math.min(max, bandTax(taxableIncome, bands));
}

export function calculate(inputs: BelgianInputs, rules: BelgianYear): BelgianBreakdown {
  const gross = Math.max(0, inputs.salary);
  const socialSecurity = gross * rules.socialSecurityRate;
  const afterSocialSecurity = gross - socialSecurity;
  // Flat-rate allowance for work expenses, used unless you claim real costs.
  const professionalExpenses = Math.min(
    afterSocialSecurity * rules.professionalExpenses.rate,
    rules.professionalExpenses.max,
  );
  const taxableIncome = afterSocialSecurity - professionalExpenses;

  const taxFree = taxFreeAmount(inputs.dependentChildren, inputs.singleParent, rules);
  const tax = incomeTax(taxableIncome, rules, taxFree);
  const municipalTax = tax * Math.min(Math.max(0, inputs.municipalPercent), 100) / 100;
  const special = specialSocialSecurity(taxableIncome, rules);

  return {
    gross,
    socialSecurity,
    professionalExpenses,
    taxableIncome,
    taxFreeAmount: taxFree,
    incomeTax: tax,
    municipalTax,
    specialSocialSecurity: special,
    takeHome: gross - socialSecurity - tax - municipalTax - special,
  };
}
