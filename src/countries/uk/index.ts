import { changedParams, readNumber, readOption, type CountryDef, type Result } from '../types';
import { calculate, type Inputs, type PensionMethod, type StudentLoanPlan } from './calculate';
import { DEFAULT_TAX_YEAR, findTaxYear, TAX_YEARS } from './rules';
import { InputPanel } from './InputPanel';
import { RatesTable } from './RatesTable';
import { INCOME_PERCENTILES, INCOME_PERCENTILES_YEAR, percentileOf } from './percentiles';
import { formatter } from '../../format';

export interface UKState extends Inputs {
  taxYear: string;
}

const DEFAULTS: UKState = {
  taxYear: DEFAULT_TAX_YEAR.id,
  salary: 35000,
  bonus: 0,
  pensionPercent: 5,
  pensionMethod: 'standard',
  studentLoan: 'none',
  postgraduateLoan: false,
  otherSacrificeMonthly: 0,
};

// Short names keep shared links readable, e.g. ?salary=45000&loan=plan2
const PARAMS: Record<keyof UKState, string> = {
  taxYear: 'year',
  salary: 'salary',
  bonus: 'bonus',
  pensionPercent: 'pension',
  pensionMethod: 'pensionType',
  studentLoan: 'loan',
  postgraduateLoan: 'postgrad',
  otherSacrificeMonthly: 'sacrifice',
};

const PLANS: StudentLoanPlan[] = ['none', 'plan1', 'plan2', 'plan4', 'plan5'];
const PENSION_METHODS: PensionMethod[] = ['standard', 'sacrifice'];
const fmt = formatter('GBP');

function toResult(state: UKState): Result {
  const rules = findTaxYear(state.taxYear);
  const r = calculate(state, rules);
  const hasLoan = state.studentLoan !== 'none' || state.postgraduateLoan;
  const notes: string[] = [];
  if (rules.note) notes.push(rules.note);
  if (r.personalAllowance < rules.incomeTax.personalAllowance) {
    notes.push(`Your personal allowance is reduced to ${fmt.whole(r.personalAllowance)} because your income is over ${fmt.whole(rules.incomeTax.allowanceTaperStart)}.`);
  }
  return {
    gross: r.gross,
    takeHome: r.takeHome,
    kept: r.pension,
    notes,
    deductions: [
      { key: 'incomeTax', label: 'Income tax', amount: r.incomeTax, color: 'var(--series-2)', alwaysShow: true },
      { key: 'nationalInsurance', label: 'National Insurance', amount: r.nationalInsurance, color: 'var(--series-3)', alwaysShow: true },
      { key: 'pension', label: 'Pension', amount: r.pension, color: 'var(--series-4)' },
      { key: 'studentLoan', label: 'Student loan', amount: r.studentLoan, color: 'var(--series-5)', alwaysShow: hasLoan },
      { key: 'otherSacrifice', label: 'Other salary sacrifice', amount: r.otherSacrifice, color: 'var(--series-6)' },
    ],
  };
}

export const UK: CountryDef<UKState> = {
  id: 'uk',
  name: 'UK',
  currency: 'GBP',
  subtitle: 'Income tax, National Insurance, pension and student loan',
  yearLabel: 'Tax year',
  years: TAX_YEARS.map(({ id, label }) => ({ id, label })),
  marginalCovers: 'income tax, NI and student loan',
  footer:
    'For employees in England, Wales and Northern Ireland with a standard tax code and no other income. ' +
    'Results are estimates; your payslip can differ a little because tax and NI are worked out each pay period.',
  defaults: DEFAULTS,
  fromParams: (params) => ({
    taxYear: findTaxYear(params.get(PARAMS.taxYear)).id,
    salary: readNumber(params, PARAMS.salary, DEFAULTS.salary),
    bonus: readNumber(params, PARAMS.bonus, DEFAULTS.bonus),
    pensionPercent: readNumber(params, PARAMS.pensionPercent, DEFAULTS.pensionPercent, 100),
    pensionMethod: readOption(params, PARAMS.pensionMethod, PENSION_METHODS, DEFAULTS.pensionMethod),
    studentLoan: readOption(params, PARAMS.studentLoan, PLANS, DEFAULTS.studentLoan),
    postgraduateLoan: params.get(PARAMS.postgraduateLoan) === '1',
    otherSacrificeMonthly: readNumber(params, PARAMS.otherSacrificeMonthly, DEFAULTS.otherSacrificeMonthly),
  }),
  toParams: (state) => changedParams(state, DEFAULTS, PARAMS),
  changeYear: (state, taxYear) => {
    const year = findTaxYear(taxYear);
    const loanAvailable = state.studentLoan === 'none' || year.studentLoans[state.studentLoan];
    return { taxYear, ...(loanAvailable ? {} : { studentLoan: 'none' }) };
  },
  calculate: toResult,
  InputPanel,
  RatesTable,
  comparison: {
    kind: 'percentiles',
    data: INCOME_PERCENTILES.map(([p, before]) => ({ p, value: before })),
    median: INCOME_PERCENTILES[49][1],
    percentileOf,
    population: 'UK taxpayers',
    source: `Based on HMRC income data for ${INCOME_PERCENTILES_YEAR}, so treat it as a rough guide: pay has gone up since then.`,
  },
};
