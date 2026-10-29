// Belgian rules for employees (white-collar), by income year.
// Income year 2026 is taxed in assessment year (aanslagjaar / exercice) 2027.
// Sources: FOD Financiën / SPF Finances indexed amounts, the Personal Income Tax
// Reform Act of 15 July 2026 (tax-free amount from 2026), and RSZ / ONSS
// instructions for the special social security contribution.

export interface Band {
  // Upper limit of the band; Infinity for the top band.
  upTo: number;
  rate: number;
}

export interface BelgianYear {
  id: string;
  label: string;
  // Personal income tax bands, applied to net taxable income.
  brackets: Band[];
  // Taxed at the lowest bands and taken off the tax, not off income.
  taxFreeAmount: number;
  // Extra tax-free amount for dependent children: the total for 1, 2, 3 and
  // 4 children, then `perExtraChild` for each child after the fourth.
  children: { totals: [number, number, number, number]; perExtraChild: number };
  // Extra tax-free amount for a single parent with dependent children.
  singleParent: number;
  professionalExpenses: { rate: number; max: number };
  socialSecurityRate: number;
  // Special social security contribution for a single person,
  // based on yearly net taxable income. Capped at `max`.
  specialSocialSecurity: { bands: Band[]; max: number };
}

const RATES = [0.25, 0.4, 0.45, 0.5];

function brackets(b1: number, b2: number, b3: number): Band[] {
  return [b1, b2, b3, Infinity].map((upTo, i) => ({ upTo, rate: RATES[i] }));
}

// Scale for singles since the mini tax shift of 1 April 2022. Not indexed.
const SPECIAL_SOCIAL_SECURITY = {
  bands: [
    { upTo: 18592.02, rate: 0 },
    { upTo: 21070.96, rate: 0.05 },
    { upTo: 37344.02, rate: 0.013 },
    { upTo: 40997.26, rate: 0.04009 },
    { upTo: 60181.95, rate: 0.012996 },
  ],
  max: 731.28,
};

const SOCIAL_SECURITY_RATE = 0.1307;

export const BELGIAN_YEARS: BelgianYear[] = [
  {
    id: '2026',
    label: '2026',
    brackets: brackets(16720, 29510, 51070),
    taxFreeAmount: 11550,
    // The 2026 reform raises the amounts for the first two children; the rest are frozen.
    children: { totals: [2130, 5130, 11440, 18510], perExtraChild: 7070 },
    singleParent: 1980,
    professionalExpenses: { rate: 0.3, max: 6070 },
    socialSecurityRate: SOCIAL_SECURITY_RATE,
    specialSocialSecurity: SPECIAL_SOCIAL_SECURITY,
  },
  {
    id: '2025',
    label: '2025',
    brackets: brackets(16320, 28800, 49840),
    taxFreeAmount: 10910,
    children: { totals: [1980, 5110, 11440, 18510], perExtraChild: 7070 },
    singleParent: 1980,
    professionalExpenses: { rate: 0.3, max: 5930 },
    socialSecurityRate: SOCIAL_SECURITY_RATE,
    specialSocialSecurity: SPECIAL_SOCIAL_SECURITY,
  },
  {
    id: '2024',
    label: '2024',
    brackets: brackets(15820, 27920, 48320),
    taxFreeAmount: 10570,
    children: { totals: [1920, 4950, 11090, 17940], perExtraChild: 6850 },
    singleParent: 1920,
    professionalExpenses: { rate: 0.3, max: 5750 },
    socialSecurityRate: SOCIAL_SECURITY_RATE,
    specialSocialSecurity: SPECIAL_SOCIAL_SECURITY,
  },
  {
    id: '2023',
    label: '2023',
    brackets: brackets(15200, 26830, 46440),
    taxFreeAmount: 10160,
    children: { totals: [1850, 4760, 10660, 17250], perExtraChild: 6580 },
    singleParent: 1850,
    professionalExpenses: { rate: 0.3, max: 5520 },
    socialSecurityRate: SOCIAL_SECURITY_RATE,
    specialSocialSecurity: SPECIAL_SOCIAL_SECURITY,
  },
  {
    id: '2022',
    label: '2022',
    brackets: brackets(13870, 24480, 42370),
    taxFreeAmount: 9270,
    children: { totals: [1690, 4340, 9730, 15740], perExtraChild: 6010 },
    singleParent: 1690,
    professionalExpenses: { rate: 0.3, max: 5040 },
    socialSecurityRate: SOCIAL_SECURITY_RATE,
    // The lower scale applied from 1 April 2022; it is used for the whole year.
    specialSocialSecurity: SPECIAL_SOCIAL_SECURITY,
  },
];

export const DEFAULT_BELGIAN_YEAR = BELGIAN_YEARS[0];

export function findBelgianYear(id: string | null | undefined): BelgianYear {
  return BELGIAN_YEARS.find((year) => year.id === id) ?? DEFAULT_BELGIAN_YEAR;
}
