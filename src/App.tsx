import { useDeferredValue, useMemo } from 'react';
import { useAppState } from './state';
import { calculate, type Inputs } from './tax/calculate';
import { findTaxYear, TAX_YEARS } from './tax/years';
import { InputPanel } from './components/InputPanel';
import { Summary } from './components/Summary';
import { MarginalRateChart, PercentileChart, TakeHomeChart } from './components/Charts';
import { RatesTable } from './components/RatesTable';

export default function App() {
  const [state, update] = useAppState();
  const rules = findTaxYear(state.taxYear);
  const inputs: Inputs = state;
  const result = useMemo(() => calculate(inputs, rules), [inputs, rules]);
  // Let the charts lag a little behind fast typing so the form stays responsive.
  const chartInputs = useDeferredValue(inputs);

  const changeYear = (taxYear: string) => {
    const year = findTaxYear(taxYear);
    const loanAvailable = state.studentLoan === 'none' || year.studentLoans[state.studentLoan];
    update({ taxYear, ...(loanAvailable ? {} : { studentLoan: 'none' }) });
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">£</span>
          <div>
            <h1>Take-home pay calculator</h1>
            <p className="muted">Income tax, National Insurance, pension and student loan</p>
          </div>
        </div>
        <label className="year-select">
          <span>Tax year</span>
          <select value={state.taxYear} onChange={(e) => changeYear(e.target.value)}>
            {TAX_YEARS.map((year) => (
              <option key={year.id} value={year.id}>{year.label}</option>
            ))}
          </select>
        </label>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <InputPanel state={state} rules={rules} onChange={update} />
        </aside>

        <div className="results">
          <Summary
            result={result}
            period={state.period}
            hasStudentLoan={state.studentLoan !== 'none' || state.postgraduateLoan}
            fullAllowance={rules.incomeTax.personalAllowance}
            note={rules.note}
            onPeriodChange={(period) => update({ period })}
          />
          <div className="chart-grid">
            <TakeHomeChart inputs={chartInputs} rules={rules} period={state.period} />
            <MarginalRateChart inputs={chartInputs} rules={rules} />
            <PercentileChart gross={result.gross} />
          </div>
          <RatesTable rules={rules} />
        </div>
      </main>

      <footer className="footer">
        <p>
          For employees in England, Wales and Northern Ireland with a standard tax code and no other
          income. Results are estimates; your payslip can differ a little because tax and NI are
          worked out each pay period.
        </p>
        <p>© Thomas Stainer</p>
      </footer>
    </div>
  );
}
