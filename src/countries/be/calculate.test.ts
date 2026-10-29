import { describe, expect, it } from 'vitest';
import { bandTax, calculate, childSupplement, incomeTax, specialSocialSecurity, taxFreeAmount } from './calculate';
import { findBelgianYear } from './rules';
import { marginalRate } from '../types';
import { BE } from './index';

const Y2026 = findBelgianYear('2026');
const Y2025 = findBelgianYear('2025');
const Y2024 = findBelgianYear('2024');
const Y2022 = findBelgianYear('2022');

const NO_CHILDREN = { dependentChildren: 0, singleParent: false };

describe('band tax', () => {
  it('applies each rate to its own band', () => {
    // 16,320 × 25% + 12,480 × 40% + 8,735 × 45%
    expect(bandTax(37535, Y2025.brackets)).toBeCloseTo(13002.75, 6);
    expect(bandTax(0, Y2025.brackets)).toBe(0);
    expect(bandTax(-100, Y2025.brackets)).toBe(0);
  });
});

describe('income tax', () => {
  it('takes the tax-free amount off at the lowest rate', () => {
    expect(incomeTax(37535, Y2025)).toBeCloseTo(13002.75 - 10910 * 0.25, 6);
    expect(incomeTax(37535, Y2026)).toBeCloseTo(bandTax(37535, Y2026.brackets) - 11550 * 0.25, 6);
  });

  it('is never below zero', () => {
    expect(incomeTax(5000, Y2025)).toBe(0);
  });
});

describe('special social security contribution', () => {
  it.each([
    [18000, 0],
    [20000, (20000 - 18592.02) * 0.05],
    [37535, 123.947 + 211.54978 + (37535 - 37344.02) * 0.04009],
    [70000, 731.28],
  ])('on €%d taxable income is %d', (income, expected) => {
    expect(specialSocialSecurity(income, Y2025)).toBeCloseTo(expected, 2);
  });

  it('reaches the maximum at the top of the scale', () => {
    expect(specialSocialSecurity(60181.95, Y2025)).toBeCloseTo(731.28, 1);
  });
});

describe('calculate', () => {
  it('works out take-home pay for €50,000 in 2025', () => {
    const r = calculate({ salary: 50000, municipalPercent: 7, ...NO_CHILDREN }, Y2025);
    expect(r.socialSecurity).toBeCloseTo(6535, 6);
    expect(r.professionalExpenses).toBe(5930);
    expect(r.taxableIncome).toBeCloseTo(37535, 6);
    expect(r.incomeTax).toBeCloseTo(10275.25, 6);
    expect(r.municipalTax).toBeCloseTo(719.2675, 6);
    expect(r.specialSocialSecurity).toBeCloseTo(343.15, 2);
    expect(r.takeHome).toBeCloseTo(32127.33, 2);
  });

  it('uses 30% work expenses below the cap', () => {
    const r = calculate({ salary: 20000, municipalPercent: 7, ...NO_CHILDREN }, Y2025);
    expect(r.professionalExpenses).toBeCloseTo((20000 - 2614) * 0.3, 6);
    expect(r.incomeTax).toBeCloseTo(12170.2 * 0.25 - 2727.5, 6);
    expect(r.specialSocialSecurity).toBe(0);
  });

  it('caps work expenses for each year', () => {
    expect(calculate({ salary: 30000, municipalPercent: 0, ...NO_CHILDREN }, Y2024).professionalExpenses).toBe(5750);
    expect(calculate({ salary: 30000, municipalPercent: 0, ...NO_CHILDREN }, Y2026).professionalExpenses).toBe(6070);
  });

  it('charges municipal tax as a share of income tax', () => {
    const none = calculate({ salary: 50000, municipalPercent: 0, ...NO_CHILDREN }, Y2025);
    const some = calculate({ salary: 50000, municipalPercent: 8, ...NO_CHILDREN }, Y2025);
    expect(none.municipalTax).toBe(0);
    expect(some.municipalTax).toBeCloseTo(none.incomeTax * 0.08, 6);
  });
});

describe('marginal rate', () => {
  it('counts social security, income tax, municipal tax and the special contribution', () => {
    const rate = marginalRate((salary) => BE.calculate({ taxYear: '2025', salary, municipalPercent: 7, ...NO_CHILDREN }), 50000);
    // 13.07% social security, then 45% tax plus 7% municipal and 4.009% special contribution on the rest.
    expect(rate).toBeCloseTo(0.1307 + 0.8693 * (0.45 * 1.07 + 0.04009), 6);
  });
});

describe('dependent children', () => {
  it.each([
    [0, 0], [1, 1980], [2, 5110], [3, 11440], [4, 18510], [6, 18510 + 2 * 7070],
  ])('2025: %d children add €%d to the tax-free amount', (children, extra) => {
    expect(childSupplement(children, Y2025)).toBe(extra);
  });

  it('uses each year\'s amounts', () => {
    expect(childSupplement(2, Y2022)).toBe(4340);
    expect(childSupplement(1, Y2026)).toBe(2130);
  });

  it('adds the single-parent amount only with children', () => {
    expect(taxFreeAmount(1, true, Y2026)).toBe(11550 + 2130 + 1980);
    expect(taxFreeAmount(0, true, Y2026)).toBe(11550);
    expect(taxFreeAmount(1, false, Y2026)).toBe(11550 + 2130);
  });

  it('takes the extra tax-free amount off at the lowest rates first', () => {
    const two = calculate({ salary: 50000, municipalPercent: 7, dependentChildren: 2, singleParent: false }, Y2025);
    // 10,910 + 5,110 = 16,020, all in the 25% band.
    expect(two.incomeTax).toBeCloseTo(13002.75 - 16020 * 0.25, 6);
    const three = calculate({ salary: 50000, municipalPercent: 7, dependentChildren: 3, singleParent: false }, Y2025);
    // 10,910 + 11,440 = 22,350: 16,320 at 25% and 6,030 at 40%.
    expect(three.incomeTax).toBeCloseTo(13002.75 - (16320 * 0.25 + 6030 * 0.4), 6);
    expect(three.municipalTax).toBeCloseTo(three.incomeTax * 0.07, 6);
  });

  it('never makes income tax negative', () => {
    const r = calculate({ salary: 15000, municipalPercent: 7, dependentChildren: 4, singleParent: true }, Y2025);
    expect(r.incomeTax).toBe(0);
    expect(r.municipalTax).toBe(0);
  });
});
