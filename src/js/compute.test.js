import React from 'react';
import {computeStudentLoanPaid, computeNIPaid, computeTaxPaid } from './compute.js';

it('compute tax', () => {
  expect(computeTaxPaid(-100000)).toEqual(0);
  expect(computeTaxPaid(-1)).toEqual(0);
  expect(computeTaxPaid(0)).toEqual(0);
  expect(computeTaxPaid(10000)).toEqual(0);
  expect(computeTaxPaid(11850)).toEqual(0);
  expect(computeTaxPaid(11851)).toBeCloseTo(0.2, 4);
  expect(computeTaxPaid(12000)).toBeCloseTo(30, 4);
  expect(computeTaxPaid(38000)).toBeCloseTo(5230, 4);
  expect(computeTaxPaid(100000)).toBeCloseTo(28360, 4);
  expect(computeTaxPaid(120000)).toBeCloseTo(40360, 4);
  expect(computeTaxPaid(150000)).toBeCloseTo(53100, 4);
  expect(computeTaxPaid(200000)).toBeCloseTo(75600, 4);
});

it('compute ni', () => {
  expect(computeNIPaid(-100000)).toEqual(0);
  expect(computeNIPaid(-1)).toEqual(0);
  expect(computeNIPaid(0)).toEqual(0);
  expect(computeNIPaid(8424)).toEqual(0);
  expect(computeNIPaid(8425)).toBeCloseTo(0.12, 4);
  expect(computeNIPaid(11850)).toBeCloseTo(411.12, 4);
  expect(computeNIPaid(11851)).toBeCloseTo(411.24, 4);
  expect(computeNIPaid(12000)).toBeCloseTo(429.12, 4);
  expect(computeNIPaid(38000)).toBeCloseTo(3549.12, 4);
  expect(computeNIPaid(46383)).toBeCloseTo(4551.78, 4);
  expect(computeNIPaid(46384)).toBeCloseTo(4551.80, 4);
  expect(computeNIPaid(100000)).toBeCloseTo(5624.12, 4);
  expect(computeNIPaid(120000)).toBeCloseTo(6024.12, 4);
  expect(computeNIPaid(150000)).toBeCloseTo(6624.12, 4);
  expect(computeNIPaid(200000)).toBeCloseTo(7624.12, 4);
});
