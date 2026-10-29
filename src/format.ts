import type { Period } from './tax/calculate';

const wholePounds = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const poundsAndPence = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactPounds = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const plainNumber = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 });

// Yearly amounts in whole pounds; smaller periods to the penny.
export function money(value: number, period: Period = 'year'): string {
  return (period === 'year' ? wholePounds : poundsAndPence).format(value);
}

export function pounds(value: number): string {
  return wholePounds.format(value);
}

export function compactMoney(value: number): string {
  return compactPounds.format(value);
}

export function percent(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

export function formatNumber(value: number): string {
  return plainNumber.format(value);
}

export function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`;
}

export const PERIOD_LABELS: Record<Period, { short: string; long: string }> = {
  year: { short: 'Year', long: 'per year' },
  month: { short: 'Month', long: 'per month' },
  week: { short: 'Week', long: 'per week' },
  day: { short: 'Day', long: 'per day' },
};
