import React from 'react';
import {
  computeStudentLoanPaidTaxYear,
  computeNIPaidTaxYear,
  computeTaxPaidTaxYear,
  AVAILABLE_TAX_YEARS,
  TAX_YEAR_1819,
  TAX_YEAR_1718 } from './compute.js';

it('compute tax 2018/2019', () => {
  expect(computeTaxPaidTaxYear(-100000, TAX_YEAR_1819)).toEqual(0);
  expect(computeTaxPaidTaxYear(-1, TAX_YEAR_1819)).toEqual(0);
  expect(computeTaxPaidTaxYear(0, TAX_YEAR_1819)).toEqual(0);
  expect(computeTaxPaidTaxYear(10000, TAX_YEAR_1819)).toEqual(0);
  expect(computeTaxPaidTaxYear(11850, TAX_YEAR_1819)).toEqual(0);
  expect(computeTaxPaidTaxYear(11851, TAX_YEAR_1819)).toBeCloseTo(0.2, 4);
  expect(computeTaxPaidTaxYear(12000, TAX_YEAR_1819)).toBeCloseTo(30, 4);
  expect(computeTaxPaidTaxYear(38000, TAX_YEAR_1819)).toBeCloseTo(5230, 4);
  expect(computeTaxPaidTaxYear(100000, TAX_YEAR_1819)).toBeCloseTo(28360, 4);
  expect(computeTaxPaidTaxYear(120000, TAX_YEAR_1819)).toBeCloseTo(40360, 4);
  expect(computeTaxPaidTaxYear(150000, TAX_YEAR_1819)).toBeCloseTo(53100, 4);
  expect(computeTaxPaidTaxYear(200000, TAX_YEAR_1819)).toBeCloseTo(75600, 4);
});

it('compute tax 2017/2018', () => {
  expect(computeTaxPaidTaxYear(-100000, TAX_YEAR_1718)).toEqual(0);
  expect(computeTaxPaidTaxYear(-1, TAX_YEAR_1718)).toEqual(0);
  expect(computeTaxPaidTaxYear(0, TAX_YEAR_1718)).toEqual(0);
  expect(computeTaxPaidTaxYear(10000, TAX_YEAR_1718)).toEqual(0);
  expect(computeTaxPaidTaxYear(11499, TAX_YEAR_1718)).toEqual(0);
  expect(computeTaxPaidTaxYear(11500, TAX_YEAR_1718)).toEqual(0);
  expect(computeTaxPaidTaxYear(11850, TAX_YEAR_1718)).toBeCloseTo(70.0, 4);
  expect(computeTaxPaidTaxYear(12000, TAX_YEAR_1718)).toBeCloseTo(100.0, 4);
  expect(computeTaxPaidTaxYear(38000, TAX_YEAR_1718)).toBeCloseTo(5300.0, 4);
  expect(computeTaxPaidTaxYear(100000, TAX_YEAR_1718)).toBeCloseTo(28700.0, 4);
  expect(computeTaxPaidTaxYear(120000, TAX_YEAR_1718)).toBeCloseTo(40700.0, 4);
  expect(computeTaxPaidTaxYear(150000, TAX_YEAR_1718)).toBeCloseTo(53300.0, 4);
  expect(computeTaxPaidTaxYear(200000, TAX_YEAR_1718)).toBeCloseTo(75800.0, 4);
});

it('compute ni 2018/2019', () => {
  expect(computeNIPaidTaxYear(-100000, TAX_YEAR_1819)).toEqual(0);
  expect(computeNIPaidTaxYear(-1, TAX_YEAR_1819)).toEqual(0);
  expect(computeNIPaidTaxYear(0, TAX_YEAR_1819)).toEqual(0);
  expect(computeNIPaidTaxYear(8424, TAX_YEAR_1819)).toEqual(0);
  expect(computeNIPaidTaxYear(8425, TAX_YEAR_1819)).toBeCloseTo(0.12, 4);
  expect(computeNIPaidTaxYear(11850, TAX_YEAR_1819)).toBeCloseTo(411.12, 4);
  expect(computeNIPaidTaxYear(11851, TAX_YEAR_1819)).toBeCloseTo(411.24, 4);
  expect(computeNIPaidTaxYear(12000, TAX_YEAR_1819)).toBeCloseTo(429.12, 4);
  expect(computeNIPaidTaxYear(38000, TAX_YEAR_1819)).toBeCloseTo(3549.12, 4);
  expect(computeNIPaidTaxYear(46383, TAX_YEAR_1819)).toBeCloseTo(4551.78, 4);
  expect(computeNIPaidTaxYear(46384, TAX_YEAR_1819)).toBeCloseTo(4551.80, 4);
  expect(computeNIPaidTaxYear(50000, TAX_YEAR_1819)).toBeCloseTo(4624.12, 4);
  expect(computeNIPaidTaxYear(100000, TAX_YEAR_1819)).toBeCloseTo(5624.12, 4);
  expect(computeNIPaidTaxYear(120000, TAX_YEAR_1819)).toBeCloseTo(6024.12, 4);
  expect(computeNIPaidTaxYear(150000, TAX_YEAR_1819)).toBeCloseTo(6624.12, 4);
  expect(computeNIPaidTaxYear(200000, TAX_YEAR_1819)).toBeCloseTo(7624.12, 4);
});


it('compute ni 2017/2018', () => {
  expect(computeNIPaidTaxYear(-100000, TAX_YEAR_1718)).toEqual(0);
  expect(computeNIPaidTaxYear(-1, TAX_YEAR_1718)).toEqual(0);
  expect(computeNIPaidTaxYear(0, TAX_YEAR_1718)).toEqual(0);
  expect(computeNIPaidTaxYear(8164, TAX_YEAR_1718)).toEqual(0);
  expect(computeNIPaidTaxYear(8165, TAX_YEAR_1718)).toBeCloseTo(0.12, 4);
  expect(computeNIPaidTaxYear(11850, TAX_YEAR_1718)).toBeCloseTo(442.32, 4);
  expect(computeNIPaidTaxYear(11851, TAX_YEAR_1718)).toBeCloseTo(442.44, 4);
  expect(computeNIPaidTaxYear(12000, TAX_YEAR_1718)).toBeCloseTo(460.32, 4);
  expect(computeNIPaidTaxYear(38000, TAX_YEAR_1718)).toBeCloseTo(3580.32, 4);
  expect(computeNIPaidTaxYear(44499, TAX_YEAR_1718)).toBeCloseTo(4360.20, 4);
  expect(computeNIPaidTaxYear(45000, TAX_YEAR_1718)).toBeCloseTo(4420.32, 4);
  expect(computeNIPaidTaxYear(45001, TAX_YEAR_1718)).toBeCloseTo(4420.44, 4);
  expect(computeNIPaidTaxYear(50000, TAX_YEAR_1718)).toBeCloseTo(4523.52, 4);
  expect(computeNIPaidTaxYear(100000, TAX_YEAR_1718)).toBeCloseTo(5523.52, 4);
  expect(computeNIPaidTaxYear(120000, TAX_YEAR_1718)).toBeCloseTo(5923.52, 4);
  expect(computeNIPaidTaxYear(150000, TAX_YEAR_1718)).toBeCloseTo(6523.52, 4);
  expect(computeNIPaidTaxYear(200000, TAX_YEAR_1718)).toBeCloseTo(7523.52, 4);
});
