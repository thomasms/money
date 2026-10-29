import type { Currency, Period } from './countries/types';

export interface Formatter {
  // Yearly amounts in whole units; smaller periods to the penny or cent.
  money: (value: number, period?: Period) => string;
  whole: (value: number) => string;
  compact: (value: number) => string;
  symbol: string;
}

const cache = new Map<Currency, Formatter>();

export function formatter(currency: Currency): Formatter {
  let f = cache.get(currency);
  if (!f) {
    const make = (options: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat('en-GB', { style: 'currency', currency, ...options });
    const whole = make({ maximumFractionDigits: 0 });
    const exact = make({ minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const compact = make({ notation: 'compact', maximumFractionDigits: 1 });
    f = {
      money: (value, period = 'year') => (period === 'year' ? whole : exact).format(value),
      whole: (value) => whole.format(value),
      compact: (value) => compact.format(value),
      symbol: currency === 'GBP' ? '£' : '€',
    };
    cache.set(currency, f);
  }
  return f;
}

export function percent(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

// A rate such as 0.1307 as "13.07%", without trailing zeros.
export function rate(fraction: number): string {
  return `${Number((fraction * 100).toFixed(3))}%`;
}

const plainNumber = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 });

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
