import { useCallback, useEffect, useState } from 'react';
import type { Inputs, PensionMethod, Period, StudentLoanPlan } from './tax/calculate';
import { DEFAULT_TAX_YEAR, findTaxYear } from './tax/years';

export interface AppState extends Inputs {
  taxYear: string;
  period: Period;
}

export const DEFAULT_STATE: AppState = {
  taxYear: DEFAULT_TAX_YEAR.id,
  period: 'month',
  salary: 35000,
  bonus: 0,
  pensionPercent: 5,
  pensionMethod: 'standard',
  studentLoan: 'none',
  postgraduateLoan: false,
  otherSacrificeMonthly: 0,
};

// Short names keep shared links readable, e.g. ?salary=45000&loan=plan2
const PARAMS: Record<keyof AppState, string> = {
  taxYear: 'year',
  period: 'period',
  salary: 'salary',
  bonus: 'bonus',
  pensionPercent: 'pension',
  pensionMethod: 'pensionType',
  studentLoan: 'loan',
  postgraduateLoan: 'postgrad',
  otherSacrificeMonthly: 'sacrifice',
};

const PERIODS: Period[] = ['year', 'month', 'week', 'day'];
const PLANS: StudentLoanPlan[] = ['none', 'plan1', 'plan2', 'plan4', 'plan5'];
const PENSION_METHODS: PensionMethod[] = ['standard', 'sacrifice'];

function readState(search: string): AppState {
  const params = new URLSearchParams(search);
  const get = (key: keyof AppState) => params.get(PARAMS[key]);
  const num = (key: keyof AppState, fallback: number) => {
    const value = Number(get(key));
    return get(key) !== null && Number.isFinite(value) && value >= 0 ? value : fallback;
  };
  const oneOf = <T extends string>(key: keyof AppState, options: T[], fallback: T): T => {
    const value = get(key) as T | null;
    return value !== null && options.includes(value) ? value : fallback;
  };

  return {
    taxYear: findTaxYear(get('taxYear')).id,
    period: oneOf('period', PERIODS, DEFAULT_STATE.period),
    salary: num('salary', DEFAULT_STATE.salary),
    bonus: num('bonus', DEFAULT_STATE.bonus),
    pensionPercent: Math.min(100, num('pensionPercent', DEFAULT_STATE.pensionPercent)),
    pensionMethod: oneOf('pensionMethod', PENSION_METHODS, DEFAULT_STATE.pensionMethod),
    studentLoan: oneOf('studentLoan', PLANS, DEFAULT_STATE.studentLoan),
    postgraduateLoan: get('postgraduateLoan') === '1',
    otherSacrificeMonthly: num('otherSacrificeMonthly', DEFAULT_STATE.otherSacrificeMonthly),
  };
}

function writeState(state: AppState) {
  const params = new URLSearchParams();
  for (const key of Object.keys(PARAMS) as (keyof AppState)[]) {
    if (state[key] === DEFAULT_STATE[key]) continue;
    const value = state[key];
    params.set(PARAMS[key], typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
  }
  const query = params.toString();
  window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
}

// App state, kept in the address bar so a result can be bookmarked or shared.
export function useAppState(): [AppState, (patch: Partial<AppState>) => void] {
  const [state, setState] = useState(() => readState(window.location.search));

  useEffect(() => writeState(state), [state]);

  const update = useCallback((patch: Partial<AppState>) => {
    setState((previous) => ({ ...previous, ...patch }));
  }, []);

  return [state, update];
}
