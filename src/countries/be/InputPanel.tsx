import { Field, MoneyInput, PercentInput, Stepper } from '../../components/controls';
import { formatter } from '../../format';
import { MAX_CHILDREN } from './calculate';
import { MONTHS_WITH_BONUSES } from './pay';
import type { BEState } from './index';

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

      <Field label="Dependent children" hint="Children who live with you and count as dependants for tax. Each one raises your tax-free amount.">
        {(id) => (
          <>
            <Stepper id={id} value={state.dependentChildren} min={0} max={MAX_CHILDREN}
              onChange={(dependentChildren) => onChange({ dependentChildren })} />
            {state.dependentChildren > 0 && (
              <label className="check">
                <input type="checkbox" checked={state.singleParent}
                  onChange={(e) => onChange({ singleParent: e.target.checked })} />
                <span>I'm a single parent (extra tax-free amount)</span>
              </label>
            )}
          </>
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
