import { Field, MoneyInput, PercentInput, Segmented } from '../../components/controls';
import { formatter } from '../../format';
import type { StudentLoanPlan } from './calculate';
import { findTaxYear } from './rules';
import type { UKState } from './index';

const PLAN_OPTIONS: { value: StudentLoanPlan; label: string; help: string }[] = [
  { value: 'none', label: 'None', help: '' },
  { value: 'plan1', label: 'Plan 1', help: 'Started in England or Wales before September 2012, or in Northern Ireland.' },
  { value: 'plan2', label: 'Plan 2', help: 'Started in England or Wales between September 2012 and July 2023.' },
  { value: 'plan4', label: 'Plan 4', help: 'Started in Scotland.' },
  { value: 'plan5', label: 'Plan 5', help: 'Started in England on or after 1 August 2023.' },
];

const fmt = formatter('GBP');

export function InputPanel({ state, onChange }: { state: UKState; onChange: (patch: Partial<UKState>) => void }) {
  const rules = findTaxYear(state.taxYear);
  const plan = PLAN_OPTIONS.find((option) => option.value === state.studentLoan)!;
  const planRules = state.studentLoan === 'none' ? undefined : rules.studentLoans[state.studentLoan];
  const hasExtras = state.bonus > 0 || state.otherSacrificeMonthly > 0;

  return (
    <form className="card inputs" onSubmit={(e) => e.preventDefault()} aria-label="Your details">
      <h2 className="card-title">Your details</h2>

      <Field label="Annual salary" hint="Your pay before tax, without bonus.">
        {(id) => (
          <MoneyInput id={id} value={state.salary} symbol={fmt.symbol} suffix="per year" autoFocus
            onChange={(salary) => onChange({ salary })} />
        )}
      </Field>

      <Field label="Pension contribution" hint={state.pensionMethod === 'sacrifice'
        ? 'Paid before tax and National Insurance.'
        : 'Paid before tax. National Insurance is still charged on it.'}>
        {(id) => (
          <>
            <PercentInput id={id} value={state.pensionPercent} suffix="% of salary"
              onChange={(pensionPercent) => onChange({ pensionPercent })} />
            <Segmented
              label="Pension type"
              value={state.pensionMethod}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'sacrifice', label: 'Salary sacrifice' },
              ]}
              onChange={(pensionMethod) => onChange({ pensionMethod })}
            />
          </>
        )}
      </Field>

      <fieldset className="field">
        <legend className="field-label">Student loan</legend>
        <Segmented
          label="Student loan plan"
          value={state.studentLoan}
          options={PLAN_OPTIONS.map(({ value, label }) => ({
            value,
            label,
            disabled: value !== 'none' && !rules.studentLoans[value],
          }))}
          onChange={(studentLoan) => onChange({ studentLoan })}
        />
        {planRules && (
          <p className="field-hint">
            {plan.help} You repay {planRules.rate * 100}% of your pay over {fmt.whole(planRules.threshold)}.
          </p>
        )}
        {!rules.studentLoans.plan5 && (
          <p className="field-hint">Plan 5 repayments start in the 2026/27 tax year.</p>
        )}
        <label className="check">
          <input type="checkbox" checked={state.postgraduateLoan}
            onChange={(e) => onChange({ postgraduateLoan: e.target.checked })} />
          <span>I have a postgraduate loan</span>
        </label>
      </fieldset>

      <details className="more" open={hasExtras || undefined}>
        <summary>More options</summary>
        <div className="more-fields">
          <Field label="Bonus or overtime" hint="Pay with no pension contribution taken from it.">
            {(id) => (
              <MoneyInput id={id} value={state.bonus} symbol={fmt.symbol} suffix="per year"
                onChange={(bonus) => onChange({ bonus })} />
            )}
          </Field>
          <Field label="Other salary sacrifice" hint="For example childcare vouchers or cycle to work.">
            {(id) => (
              <MoneyInput id={id} value={state.otherSacrificeMonthly} symbol={fmt.symbol} suffix="per month"
                onChange={(otherSacrificeMonthly) => onChange({ otherSacrificeMonthly })} />
            )}
          </Field>
        </div>
      </details>
    </form>
  );
}
