import { Field, MoneyInput, PercentInput } from '../../components/controls';
import { formatter } from '../../format';
import type { BEState } from './index';

// 12 monthly salaries, a 13th month and double holiday pay (92% of a month).
const MONTHS_WITH_BONUSES = 13.92;

const fmt = formatter('EUR');

export function InputPanel({ state, onChange }: { state: BEState; onChange: (patch: Partial<BEState>) => void }) {
  return (
    <form className="card inputs" onSubmit={(e) => e.preventDefault()} aria-label="Your details">
      <h2 className="card-title">Your details</h2>

      <Field
        label="Annual gross salary"
        hint={state.salary > 0
          ? `Include holiday pay and any 13th month. With both, this is about ${fmt.whole(state.salary / MONTHS_WITH_BONUSES)} gross a month.`
          : 'Include holiday pay and any 13th month.'}
      >
        {(id) => (
          <MoneyInput id={id} value={state.salary} symbol={fmt.symbol} suffix="per year" autoFocus
            onChange={(salary) => onChange({ salary })} />
        )}
      </Field>

      <Field label="Municipal tax" hint="Set by your municipality, usually between 6% and 8% of your income tax.">
        {(id) => (
          <PercentInput id={id} value={state.municipalPercent} suffix="% of income tax" max={10} step={0.1}
            onChange={(municipalPercent) => onChange({ municipalPercent })} />
        )}
      </Field>
    </form>
  );
}
