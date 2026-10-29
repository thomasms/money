import type { Band, BelgianYear } from './rules';

export interface BelgianInputs {
  // Yearly gross pay, including holiday pay and any 13th month.
  salary: number;
  // Municipal surcharge, as a percentage of the income tax.
  municipalPercent: number;
}

export interface BelgianBreakdown {
  gross: number;
  socialSecurity: number;
  professionalExpenses: number;
  taxableIncome: number;
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

// Personal income tax (federal and regional together) for a single person.
// The tax-free amount is taxed at the lowest bands and taken off the tax.
export function incomeTax(taxableIncome: number, rules: BelgianYear): number {
  const tax = bandTax(taxableIncome, rules.brackets);
  const reduction = bandTax(rules.taxFreeAmount, rules.brackets);
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

  const tax = incomeTax(taxableIncome, rules);
  const municipalTax = tax * Math.min(Math.max(0, inputs.municipalPercent), 100) / 100;
  const special = specialSocialSecurity(taxableIncome, rules);

  return {
    gross,
    socialSecurity,
    professionalExpenses,
    taxableIncome,
    incomeTax: tax,
    municipalTax,
    specialSocialSecurity: special,
    takeHome: gross - socialSecurity - tax - municipalTax - special,
  };
}
