import { useId, useState, type ReactNode } from 'react';
import { formatNumber } from '../format';

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: (id: string) => ReactNode }) {
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
  symbol: string;
  suffix: string;
  autoFocus?: boolean;
  onChange: (value: number) => void;
}

// A money input that shows "45,000" when idle and plain digits while editing.
export function MoneyInput({ id, value, symbol, suffix, autoFocus, onChange }: MoneyInputProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const shown = editing ?? (value === 0 ? '' : formatNumber(value));

  return (
    <div className="input-wrap">
      <span className="input-prefix">{symbol}</span>
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

interface PercentInputProps {
  id: string;
  value: number;
  suffix: string;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function PercentInput({ id, value, suffix, max = 100, step = 0.5, onChange }: PercentInputProps) {
  return (
    <div className="input-wrap">
      <input id={id} className="input" type="number" inputMode="decimal" min={0} max={max} step={step}
        value={value === 0 ? '' : value} placeholder="0"
        onChange={(e) => {
          const v = e.target.valueAsNumber;
          onChange(Number.isFinite(v) ? Math.min(max, Math.max(0, v)) : 0);
        }} />
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

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td className="num">{value}</td>
    </tr>
  );
}
