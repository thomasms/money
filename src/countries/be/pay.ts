import type { PayScaleComparison } from '../types';

// Statbel structure of earnings survey, reference year 2022 (published 2024).
// Gross monthly pay of full-time employees in firms with 10 or more staff,
// without the 13th month and holiday pay.
export const BELGIAN_PAY_YEAR = '2022';

// 12 monthly salaries, a 13th month and double holiday pay (92% of a month).
export const MONTHS_WITH_BONUSES = 13.92;

export const BELGIAN_PAY: PayScaleComparison = {
  kind: 'scale',
  measure: 'gross pay per month',
  yours: (gross) => gross / MONTHS_WITH_BONUSES,
  bottom10: 2443,
  median: 3728,
  average: 4076,
  top10: 6305,
  population: 'full-time employees in Belgium',
  source:
    `Statbel data for ${BELGIAN_PAY_YEAR}: full-time employees in firms with 10 or more staff, ` +
    'monthly gross pay without the 13th month and holiday pay. Your monthly pay is your yearly pay divided by 13.92. ' +
    'Pay has gone up since then, so treat it as a rough guide.',
};
