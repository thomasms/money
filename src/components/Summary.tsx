import type { Breakdown, Period } from '../tax/calculate';
import { forPeriod } from '../tax/calculate';
import { money, percent, PERIOD_LABELS, pounds } from '../format';
import { Segmented } from './InputPanel';

type ItemKey = 'takeHome' | 'incomeTax' | 'nationalInsurance' | 'pension' | 'studentLoan' | 'otherSacrifice';

// Fixed colour slots: an item keeps its colour even when others are hidden.
export const ITEMS: { key: ItemKey; label: string; color: string }[] = [
  { key: 'takeHome', label: 'Take-home pay', color: 'var(--series-1)' },
  { key: 'incomeTax', label: 'Income tax', color: 'var(--series-2)' },
  { key: 'nationalInsurance', label: 'National Insurance', color: 'var(--series-3)' },
  { key: 'pension', label: 'Pension', color: 'var(--series-4)' },
  { key: 'studentLoan', label: 'Student loan', color: 'var(--series-5)' },
  { key: 'otherSacrifice', label: 'Other salary sacrifice', color: 'var(--series-6)' },
];

interface Props {
  result: Breakdown;
  period: Period;
  hasStudentLoan: boolean;
  fullAllowance: number;
  onPeriodChange: (period: Period) => void;
}

export function Summary({ result, period, hasStudentLoan, fullAllowance, onPeriodChange }: Props) {
  const gross = result.gross;
  const share = (value: number) => (gross > 0 ? value / gross : 0);
  const visible = ITEMS.filter(({ key }) =>
    key === 'takeHome' || key === 'incomeTax' || key === 'nationalInsurance' ||
    result[key] > 0 || (key === 'studentLoan' && hasStudentLoan));
  const deductions = visible.filter(({ key }) => key !== 'takeHome');

  return (
    <section className="card summary" aria-labelledby="summary-title">
      <div className="summary-head">
        <div>
          <h2 id="summary-title" className="eyebrow">Your take-home pay</h2>
          <p className="hero" aria-live="polite">
            {money(forPeriod(result.takeHome, period), period)}
            <span className="hero-unit"> {PERIOD_LABELS[period].long}</span>
          </p>
          <p className="muted">
            From {money(forPeriod(gross, period), period)} {PERIOD_LABELS[period].long} before deductions
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
          aria-label={visible.map(({ key, label }) => `${label} ${percent(share(result[key]))}`).join(', ')}>
          {visible.filter(({ key }) => result[key] > 0).map(({ key, label, color }) => (
            <div key={key} className="stack-segment" title={`${label}: ${percent(share(result[key]), 1)}`}
              style={{ flexGrow: result[key], background: color }} />
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
            <td className="num">{money(forPeriod(gross, period), period)}</td>
            <td className="num muted">100%</td>
          </tr>
          {deductions.map(({ key, label, color }) => (
            <tr key={key}>
              <th scope="row"><span className="swatch" style={{ background: color }} />{label}</th>
              <td className="num">−{money(forPeriod(result[key], period), period)}</td>
              <td className="num muted">{percent(share(result[key]), 1)}</td>
            </tr>
          ))}
          <tr className="row-total">
            <th scope="row"><span className="swatch" style={{ background: ITEMS[0].color }} />Take-home pay</th>
            <td className="num">{money(forPeriod(result.takeHome, period), period)}</td>
            <td className="num muted">{percent(share(result.takeHome), 1)}</td>
          </tr>
        </tbody>
      </table>
      {period === 'day' || period === 'week' ? (
        <p className="footnote">Assumes 52 weeks in a year and 7 days in a week.</p>
      ) : null}
      {result.personalAllowance < fullAllowance && (
        <p className="footnote">
          Your personal allowance is reduced to {pounds(result.personalAllowance)} because your
          income is over £100,000.
        </p>
      )}
    </section>
  );
}
