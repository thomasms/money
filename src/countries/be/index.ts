import { changedParams, readNumber, type CountryDef, type Result } from '../types';
import { calculate, MAX_CHILDREN, type BelgianInputs } from './calculate';
import { formatter } from '../../format';
import { BELGIAN_YEARS, DEFAULT_BELGIAN_YEAR, findBelgianYear } from './rules';
import { InputPanel } from './InputPanel';
import { RatesTable } from './RatesTable';
import { BELGIAN_PAY } from './pay';

export interface BEState extends BelgianInputs {
  taxYear: string;
}

const DEFAULTS: BEState = {
  taxYear: DEFAULT_BELGIAN_YEAR.id,
  salary: 50000,
  municipalPercent: 7,
  dependentChildren: 0,
  singleParent: false,
};

const PARAMS: Record<keyof BEState, string> = {
  taxYear: 'year',
  salary: 'salary',
  municipalPercent: 'municipal',
  dependentChildren: 'children',
  singleParent: 'singleParent',
};

// Roughly the yearly pay (13.92 months) below which the work bonus applies.
const WORK_BONUS_HINT_BELOW = 46500;

const fmt = formatter('EUR');

function toResult(state: BEState): Result {
  const rules = findBelgianYear(state.taxYear);
  const r = calculate(state, rules);
  const notes = [
    'Monthly amounts are a twelfth of the year, so they include holiday pay and any 13th month. Your normal monthly payslip will be lower.',
  ];
  if (r.taxFreeAmount > rules.taxFreeAmount) {
    const forWhom = state.singleParent ? 'for your children and as a single parent' : 'for your children';
    notes.push(`Your tax-free amount is ${fmt.whole(r.taxFreeAmount)}, including ${fmt.whole(r.taxFreeAmount - rules.taxFreeAmount)} ${forWhom}.`);
  }
  if (r.gross > 0 && r.gross < WORK_BONUS_HINT_BELOW) {
    notes.push('At this salary you may get the work bonus (werkbonus / bonus à l’emploi). It is not included here, so your real take-home pay may be higher.');
  }
  return {
    gross: r.gross,
    takeHome: r.takeHome,
    kept: 0,
    notes,
    deductions: [
      { key: 'socialSecurity', label: 'Social security', amount: r.socialSecurity, color: 'var(--series-3)', alwaysShow: true },
      { key: 'incomeTax', label: 'Income tax', amount: r.incomeTax, color: 'var(--series-2)', alwaysShow: true },
      { key: 'municipalTax', label: 'Municipal tax', amount: r.municipalTax, color: 'var(--series-5)' },
      { key: 'specialSocialSecurity', label: 'Special social security', amount: r.specialSocialSecurity, color: 'var(--series-4)' },
    ],
  };
}

export const BE: CountryDef<BEState> = {
  id: 'be',
  name: 'Belgium',
  currency: 'EUR',
  subtitle: 'Income tax, social security and municipal tax',
  yearLabel: 'Income year',
  years: BELGIAN_YEARS.map(({ id, label }) => ({ id, label })),
  marginalCovers: 'tax and social security',
  footer:
    'For a white-collar employee in Belgium who is taxed alone (not jointly with a partner), using the flat-rate allowance for work expenses. ' +
    'Only dependent children are counted, without the extra amount for children under 3 or the refundable tax credit for very low incomes. ' +
    'Tax is the final yearly income tax, not the monthly withholding (bedrijfsvoorheffing / précompte professionnel), ' +
    'so your payslip can differ. The work bonus for lower salaries is not included.',
  defaults: DEFAULTS,
  fromParams: (params) => ({
    taxYear: findBelgianYear(params.get(PARAMS.taxYear)).id,
    salary: readNumber(params, PARAMS.salary, DEFAULTS.salary),
    municipalPercent: readNumber(params, PARAMS.municipalPercent, DEFAULTS.municipalPercent, 10),
    dependentChildren: Math.floor(readNumber(params, PARAMS.dependentChildren, DEFAULTS.dependentChildren, MAX_CHILDREN)),
    singleParent: params.get(PARAMS.singleParent) === '1',
  }),
  toParams: (state) => changedParams(state, DEFAULTS, PARAMS),
  changeYear: (_state, taxYear) => ({ taxYear }),
  calculate: toResult,
  InputPanel,
  RatesTable,
  comparison: BELGIAN_PAY,
};
