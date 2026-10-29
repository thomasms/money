import { useCallback, useDeferredValue, useMemo, type ReactNode } from 'react';
import { useAppState } from './state';
import { BE, COUNTRY_IDS, COUNTRY_NAMES, UK } from './countries';
import type { CountryDef, CountryId, CountryState, Period } from './countries/types';
import { formatter } from './format';
import { Segmented } from './components/controls';
import { Summary } from './components/Summary';
import { MarginalRateChart, PayScaleChart, PercentileChart, TakeHomeChart } from './components/Charts';

export default function App() {
  const [state, update] = useAppState();

  const countrySwitch = (
    <Segmented
      label="Country"
      value={state.country}
      options={COUNTRY_IDS.map((id) => ({ value: id, label: COUNTRY_NAMES[id] }))}
      onChange={(country: CountryId) => update({ country })}
    />
  );
  const shared = {
    period: state.period,
    onPeriodChange: (period: Period) => update({ period }),
    countrySwitch,
  };

  return state.country === 'uk' ? (
    <CountryView key="uk" def={UK} state={state.uk} onChange={(patch) => update({ uk: { ...state.uk, ...patch } })} {...shared} />
  ) : (
    <CountryView key="be" def={BE} state={state.be} onChange={(patch) => update({ be: { ...state.be, ...patch } })} {...shared} />
  );
}

interface ViewProps<S extends CountryState> {
  def: CountryDef<S>;
  state: S;
  period: Period;
  countrySwitch: ReactNode;
  onChange: (patch: Partial<S>) => void;
  onPeriodChange: (period: Period) => void;
}

function CountryView<S extends CountryState>({ def, state, period, countrySwitch, onChange, onPeriodChange }: ViewProps<S>) {
  const fmt = formatter(def.currency);
  const result = useMemo(() => def.calculate(state), [def, state]);
  // Let the charts lag a little behind fast typing so the form stays responsive.
  const chartState = useDeferredValue(state);
  const calc = useCallback((salary: number) => def.calculate({ ...chartState, salary }), [def, chartState]);
  const { InputPanel, RatesTable } = def;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">{fmt.symbol}</span>
          <div>
            <h1>Take-home pay calculator</h1>
            <p className="muted">{def.subtitle}</p>
          </div>
        </div>
        <div className="topbar-controls">
          <div className="country-switch">{countrySwitch}</div>
          <label className="year-select">
            <span>{def.yearLabel}</span>
            <select value={state.taxYear} onChange={(e) => onChange(def.changeYear(state, e.target.value))}>
              {def.years.map((year) => (
                <option key={year.id} value={year.id}>{year.label}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <InputPanel state={state} onChange={onChange} />
        </aside>

        <div className="results">
          <Summary result={result} period={period} fmt={fmt} onPeriodChange={onPeriodChange} />
          <div className="chart-grid">
            <TakeHomeChart calc={calc} salary={chartState.salary} fmt={fmt} period={period} />
            <MarginalRateChart calc={calc} salary={chartState.salary} fmt={fmt} covers={def.marginalCovers} />
            {def.comparison?.kind === 'percentiles' && <PercentileChart gross={result.gross} comparison={def.comparison} fmt={fmt} />}
            {def.comparison?.kind === 'scale' && <PayScaleChart gross={result.gross} comparison={def.comparison} fmt={fmt} />}
          </div>
          <RatesTable state={state} />
        </div>
      </main>

      <footer className="footer">
        <p>{def.footer}</p>
        <p>© Thomas Stainer</p>
      </footer>
    </div>
  );
}
