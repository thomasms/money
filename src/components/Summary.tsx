import { forPeriod, type Period, type Result } from '../countries/types';
import { percent, PERIOD_LABELS, type Formatter } from '../format';
import { Segmented } from './controls';

const TAKE_HOME_COLOR = 'var(--series-1)';

interface Props {
  result: Result;
  period: Period;
  fmt: Formatter;
  onPeriodChange: (period: Period) => void;
}

export function Summary({ result, period, fmt, onPeriodChange }: Props) {
  const { gross, takeHome } = result;
  const share = (value: number) => (gross > 0 ? value / gross : 0);
  const amount = (value: number) => fmt.money(forPeriod(value, period), period);
  const deductions = result.deductions.filter((d) => d.alwaysShow || d.amount > 0);
  const segments = [
    { key: 'takeHome', label: 'Take-home pay', amount: takeHome, color: TAKE_HOME_COLOR },
    ...deductions,
  ].filter((s) => s.amount > 0);

  return (
    <section className="card summary" aria-labelledby="summary-title">
      <div className="summary-head">
        <div>
          <h2 id="summary-title" className="eyebrow">Your take-home pay</h2>
          <p className="hero" aria-live="polite">
            {amount(takeHome)}
            <span className="hero-unit"> {PERIOD_LABELS[period].long}</span>
          </p>
          <p className="muted">
            From {amount(gross)} {PERIOD_LABELS[period].long} before deductions
          </p>
        </div>
        <Segmented
          label="Show amounts"
          value={period}
          options={(['year', 'month', 'week', 'day'] as Period[]).map((p) => ({ value: p, label: PERIOD_LABELS[p].short }))}
          onChange={onPeriodChange}
        />
      </div>

      {gross > 0 && (
        <div className="stack" role="img"
          aria-label={segments.map(({ label, amount: a }) => `${label} ${percent(share(a))}`).join(', ')}>
          {segments.map(({ key, label, amount: a, color }) => (
            <div key={key} className="stack-segment" title={`${label}: ${percent(share(a), 1)}`}
              style={{ flexGrow: a, background: color }} />
          ))}
        </div>
      )}

      <table className="breakdown">
        <caption className="visually-hidden">Breakdown of your pay {PERIOD_LABELS[period].long}</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col" className="num">{PERIOD_LABELS[period].short}</th>
            <th scope="col" className="num">Share</th>
          </tr>
        </thead>
        <tbody>
          <tr className="row-gross">
            <th scope="row">Gross pay</th>
            <td className="num">{amount(gross)}</td>
            <td className="num muted">100%</td>
          </tr>
          {deductions.map(({ key, label, amount: a, color }) => (
            <tr key={key}>
              <th scope="row"><span className="swatch" style={{ background: color }} />{label}</th>
              <td className="num">−{amount(a)}</td>
              <td className="num muted">{percent(share(a), 1)}</td>
            </tr>
          ))}
          <tr className="row-total">
            <th scope="row"><span className="swatch" style={{ background: TAKE_HOME_COLOR }} />Take-home pay</th>
            <td className="num">{amount(takeHome)}</td>
            <td className="num muted">{percent(share(takeHome), 1)}</td>
          </tr>
        </tbody>
      </table>
      {(period === 'day' || period === 'week') && (
        <p className="footnote">Assumes 52 weeks in a year and 7 days in a week.</p>
      )}
      {result.notes.map((note) => <p key={note} className="footnote">{note}</p>)}
    </section>
  );
}
