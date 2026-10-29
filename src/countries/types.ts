import type { ComponentType } from 'react';

export type CountryId = 'uk' | 'be';
export type Currency = 'GBP' | 'EUR';
export type Period = 'year' | 'month' | 'week' | 'day';

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

// One deduction from gross pay, as shown in the breakdown.
export interface LineItem {
  key: string;
  label: string;
  amount: number;
  // A categorical colour slot, e.g. 'var(--series-2)'. Fixed per item.
  color: string;
  // Show the row even when the amount is zero.
  alwaysShow?: boolean;
}

export interface Result {
  gross: number;
  takeHome: number;
  // Deductions that stay your money, such as pension contributions.
  kept: number;
  deductions: LineItem[];
  notes: string[];
}

// A full income distribution, as percentile points.
export interface PercentileComparison {
  kind: 'percentiles';
  data: { p: number; value: number }[];
  percentileOf: (gross: number) => number;
  median: number;
  population: string;
  source: string;
}

// A few published points of a pay distribution, such as the median.
export interface PayScaleComparison {
  kind: 'scale';
  // What the points measure, e.g. "gross pay per month".
  measure: string;
  // Turns yearly gross pay into the same measure as the points.
  yours: (gross: number) => number;
  bottom10: number;
  median: number;
  average: number;
  top10: number;
  population: string;
  source: string;
}

export type Comparison = PercentileComparison | PayScaleComparison;

export interface CountryState {
  taxYear: string;
  salary: number;
}

export interface CountryDef<S extends CountryState> {
  id: CountryId;
  name: string;
  currency: Currency;
  subtitle: string;
  yearLabel: string;
  years: { id: string; label: string }[];
  // What the "next 100" chart counts, e.g. "income tax, NI and student loan".
  marginalCovers: string;
  footer: string;
  defaults: S;
  fromParams: (params: URLSearchParams) => S;
  toParams: (state: S) => Record<string, string>;
  changeYear: (state: S, taxYear: string) => Partial<S>;
  calculate: (state: S) => Result;
  InputPanel: ComponentType<{ state: S; onChange: (patch: Partial<S>) => void }>;
  RatesTable: ComponentType<{ state: S }>;
  comparison?: Comparison;
}

// The share of the next `step` of salary lost to tax and contributions.
// Deductions that stay your money (`kept`) are not counted as lost.
export function marginalRate(calculate: (salary: number) => Result, salary: number, step = 100): number {
  const lost = (r: Result) => r.gross - r.takeHome - r.kept;
  return (lost(calculate(salary + step)) - lost(calculate(salary))) / step;
}

// Helpers for reading state from the address bar.
export function readNumber(params: URLSearchParams, name: string, fallback: number, max = Infinity): number {
  const raw = params.get(name);
  const value = Number(raw);
  return raw !== null && Number.isFinite(value) && value >= 0 ? Math.min(value, max) : fallback;
}

export function readOption<T extends string>(params: URLSearchParams, name: string, options: readonly T[], fallback: T): T {
  const value = params.get(name) as T | null;
  return value !== null && options.includes(value) ? value : fallback;
}

// Only values that differ from the defaults go into the address bar.
export function changedParams<S extends object>(state: S, defaults: S, names: Record<keyof S, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Object.keys(names) as (keyof S)[]) {
    const value = state[key];
    if (value === defaults[key]) continue;
    out[names[key]] = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
  }
  return out;
}
