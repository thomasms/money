import { useCallback, useEffect, useState } from 'react';
import { readOption, type CountryId, type Period } from './countries/types';
import { BE, COUNTRY_IDS, UK, type BEState, type UKState } from './countries';

export interface AppState {
  country: CountryId;
  period: Period;
  uk: UKState;
  be: BEState;
}

const PERIODS: Period[] = ['year', 'month', 'week', 'day'];
const DEFAULT_PERIOD: Period = 'month';

function readState(search: string): AppState {
  const params = new URLSearchParams(search);
  const country = readOption(params, 'country', COUNTRY_IDS, 'uk');
  const empty = new URLSearchParams();
  // Only the shown country's settings are in the address bar.
  return {
    country,
    period: readOption(params, 'period', PERIODS, DEFAULT_PERIOD),
    uk: UK.fromParams(country === 'uk' ? params : empty),
    be: BE.fromParams(country === 'be' ? params : empty),
  };
}

function writeState(state: AppState) {
  const params = new URLSearchParams();
  if (state.country !== 'uk') params.set('country', state.country);
  if (state.period !== DEFAULT_PERIOD) params.set('period', state.period);
  const own = state.country === 'uk' ? UK.toParams(state.uk) : BE.toParams(state.be);
  for (const [name, value] of Object.entries(own)) params.set(name, value);
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
