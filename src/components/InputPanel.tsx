import { useId, useState, type ReactNode } from 'react';
import type { AppState } from '../state';
import type { StudentLoanPlan } from '../tax/calculate';
import type { TaxYearRules } from '../tax/years';
import { formatNumber, pounds } from '../format';

interface Props {
  state: AppState;
  rules: TaxYearRules;
  onChange: (patch: Partial<AppState>) => void;
}

const PLAN_OPTIONS: { value: StudentLoanPlan; label: string; help: string }[] = [
  { value: 'none', label: 'None', help: '' },
  { value: 'plan1', label: 'Plan 1', help: 'Started in England or Wales before September 2012, or in Northern Ireland.' },
  { value: 'plan2', label: 'Plan 2', help: 'Started in England or Wales between September 2012 and July 2023.' },
  { value: 'plan4', label: 'Plan 4', help: 'Started in Scotland.' },
  { value: 'plan5', label: 'Plan 5', help: 'Started in England on or after 1 August 2023.' },
];

export function InputPanel({ state, rules, onChange }: Props) {
  const plan = PLAN_OPTIONS.find((option) => option.value === state.studentLoan)!;
  const planRules = state.studentLoan === 'none' ? undefined : rules.studentLoans[state.studentLoan];
  const hasExtras = state.bonus > 0 || state.otherSacrificeMonthly > 0;

  return (
    <form className="card inputs" onSubmit={(e) => e.preventDefault()} aria-label="Your details">
      <h2 className="card-title">Your details</h2>

      <Field label="Annual salary" hint="Your pay before tax, without bonus.">
        {(id) => (
          <MoneyInput id={id} value={state.salary} suffix="per year" autoFocus
            onChange={(salary) => onChange({ salary })} />
        )}
      </Field>

      <Field label="Pension contribution" hint={state.pensionMethod === 'sacrifice'
        ? 'Paid before tax and National Insurance.'
        : 'Paid before tax. National Insurance is still charged on it.'}>
        {(id) => (
          <>
            <div className="input-wrap">
              <input id={id} className="input" type="number" inputMode="decimal" min={0} max={100} step={0.5}
                value={state.pensionPercent === 0 ? '' : state.pensionPercent} placeholder="0"
                onChange={(e) => onChange({ pensionPercent: clampPercent(e.target.valueAsNumber) })} />
              <span className="input-suffix">% of salary</span>
            </div>
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
            {plan.help} You repay {planRules.rate * 100}% of your pay over {pounds(planRules.threshold)}.
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
              <MoneyInput id={id} value={state.bonus} suffix="per year"
                onChange={(bonus) => onChange({ bonus })} />
            )}
          </Field>
          <Field label="Other salary sacrifice" hint="For example childcare vouchers or cycle to work.">
            {(id) => (
              <MoneyInput id={id} value={state.otherSacrificeMonthly} suffix="per month"
                onChange={(otherSacrificeMonthly) => onChange({ otherSacrificeMonthly })} />
            )}
          </Field>
        </div>
      </details>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      {children(id)}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

interface MoneyInputProps {
  id: string;
  value: number;
  suffix: string;
  autoFocus?: boolean;
  onChange: (value: number) => void;
}

// A pound input that shows "45,000" when idle and plain digits while editing.
function MoneyInput({ id, value, suffix, autoFocus, onChange }: MoneyInputProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const shown = editing ?? (value === 0 ? '' : formatNumber(value));

  return (
    <div className="input-wrap">
      <span className="input-prefix">£</span>
      <input
        id={id}
        className="input input--money"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder="0"
        autoFocus={autoFocus}
        value={shown}
        onFocus={() => setEditing(value === 0 ? '' : String(value))}
        onBlur={() => setEditing(null)}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, '');
          setEditing(raw);
          const parsed = Number.parseFloat(raw);
          onChange(Number.isFinite(parsed) ? parsed : 0);
        }}
      />
      <span className="input-suffix">{suffix}</span>
    </div>
  );
}

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; disabled?: boolean }[];
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  const name = useId();
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <label key={option.value} className="segment" data-disabled={option.disabled || undefined}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function clampPercent(value: number): number {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}
