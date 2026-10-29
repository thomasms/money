import { useMemo, type ReactNode } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { calculate, forPeriod, marginalRate, type Inputs, type Period } from '../tax/calculate';
import type { TaxYearRules } from '../tax/years';
import { compactMoney, money, ordinal, percent, PERIOD_LABELS, pounds } from '../format';
import { INCOME_PERCENTILES, INCOME_PERCENTILES_YEAR, percentileOf } from '../data/percentiles';

const CHART_HEIGHT = 260;
const AXIS = { stroke: 'var(--axis)', tick: { fill: 'var(--text-muted)', fontSize: 12 }, tickLine: false };
const GRID = <CartesianGrid vertical={false} stroke="var(--grid)" />;
const CURSOR = { stroke: 'var(--axis)', strokeWidth: 1 };

interface ChartProps {
  inputs: Inputs;
  rules: TaxYearRules;
  period: Period;
}

// The salary range to plot: wide enough to show context around the user's salary.
function salaryRange(salary: number): number[] {
  const max = Math.max(150000, Math.ceil((salary * 1.5) / 10000) * 10000);
  const step = max / 300;
  const points: number[] = [];
  for (let s = 0; s <= max; s += step) points.push(Math.round(s));
  return points;
}

export function TakeHomeChart({ inputs, rules, period }: ChartProps) {
  const data = useMemo(
    () =>
      salaryRange(inputs.salary).map((salary) => {
        const r = calculate({ ...inputs, salary }, rules);
        return { salary, gross: forPeriod(r.gross, period), takeHome: forPeriod(r.takeHome, period) };
      }),
    [inputs, rules, period],
  );
  const you = calculate(inputs, rules);

  return (
    <ChartCard
      title="Take-home pay at other salaries"
      subtitle={`Your settings, ${PERIOD_LABELS[period].long}. The gap between the lines is what is taken off.`}
      legend={[
        { label: 'Gross pay', color: 'var(--text-muted)' },
        { label: 'Take-home pay', color: 'var(--series-1)' },
      ]}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          {GRID}
          <XAxis dataKey="salary" type="number" domain={['dataMin', 'dataMax']} tickFormatter={compactMoney} {...AXIS} />
          <YAxis tickFormatter={compactMoney} width={56} {...AXIS} axisLine={false} />
          <Tooltip
            cursor={CURSOR}
            content={({ active, payload }) => {
              const row = active && payload?.[0]?.payload;
              if (!row) return null;
              return (
                <TooltipBox title={`Salary ${pounds(row.salary)}`}>
                  <TooltipRow color="var(--text-muted)" label="Gross" value={money(row.gross, period)} />
                  <TooltipRow color="var(--series-1)" label="Take-home" value={money(row.takeHome, period)} />
                </TooltipBox>
              );
            }}
          />
          <Line dataKey="gross" stroke="var(--text-muted)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Area dataKey="takeHome" stroke="var(--series-1)" strokeWidth={2} fill="var(--series-1)" fillOpacity={0.1}
            dot={false} activeDot={{ r: 5, stroke: 'var(--surface)', strokeWidth: 2 }} isAnimationActive={false} />
          {inputs.salary > 0 && (
            <ReferenceDot x={inputs.salary} y={forPeriod(you.takeHome, period)} r={6}
              fill="var(--series-1)" stroke="var(--surface)" strokeWidth={2}
              label={{ value: 'You', position: 'top', fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MarginalRateChart({ inputs, rules }: Omit<ChartProps, 'period'>) {
  const data = useMemo(
    () => salaryRange(inputs.salary).map((salary) => ({ salary, rate: marginalRate({ ...inputs, salary }, rules) })),
    [inputs, rules],
  );
  const yours = marginalRate(inputs, rules);
  const top = Math.max(0.7, Math.ceil(Math.max(...data.map((d) => d.rate)) * 10) / 10);
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1].filter((t) => t <= top);

  return (
    <ChartCard
      title="Tax on your next £100"
      subtitle={`From a £100 pay rise you would keep ${pounds(100 * (1 - yours))}. ${percent(yours)} goes to income tax, NI and student loan.`}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          {GRID}
          <XAxis dataKey="salary" type="number" domain={['dataMin', 'dataMax']} tickFormatter={compactMoney} {...AXIS} />
          <YAxis tickFormatter={(v: number) => percent(v)} domain={[0, top]} ticks={ticks} width={56}
            {...AXIS} axisLine={false} />
          <Tooltip
            cursor={CURSOR}
            content={({ active, payload }) => {
              const row = active && payload?.[0]?.payload;
              if (!row) return null;
              return (
                <TooltipBox title={`Salary ${pounds(row.salary)}`}>
                  <TooltipRow color="var(--series-2)" label="Taken off" value={percent(row.rate)} />
                  <TooltipRow label="You keep" value={pounds(100 * (1 - row.rate))} />
                </TooltipBox>
              );
            }}
          />
          <Line dataKey="rate" type="stepAfter" stroke="var(--series-2)" strokeWidth={2} dot={false}
            activeDot={{ r: 5, stroke: 'var(--surface)', strokeWidth: 2 }} isAnimationActive={false} />
          {inputs.salary > 0 && (
            <ReferenceDot x={inputs.salary} y={yours} r={6} fill="var(--series-2)" stroke="var(--surface)" strokeWidth={2}
              label={{ value: 'You', position: 'top', fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PercentileChart({ gross }: { gross: number }) {
  const data = useMemo(() => INCOME_PERCENTILES.map(([p, before]) => ({ p, before })), []);
  const position = percentileOf(gross);
  const markerX = Math.min(99, Math.max(1, position));
  const headline =
    position >= 99 ? 'Your pay is in the top 1% of UK taxpayers.'
      : position < 1 ? 'Your pay is in the bottom 1% of UK taxpayers.'
        : `Your pay is higher than about ${Math.floor(position)}% of UK taxpayers.`;

  return (
    <ChartCard
      title="How your pay compares"
      subtitle={`${headline} Based on HMRC income data for ${INCOME_PERCENTILES_YEAR}, so treat it as a rough guide: pay has gone up since then.`}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          {GRID}
          <XAxis dataKey="p" type="number" domain={[1, 99]} ticks={[1, 25, 50, 75, 99]}
            tickFormatter={(v: number) => ordinal(v)} {...AXIS} />
          <YAxis tickFormatter={compactMoney} width={56} {...AXIS} axisLine={false} />
          <Tooltip
            cursor={CURSOR}
            content={({ active, payload }) => {
              const row = active && payload?.[0]?.payload;
              if (!row) return null;
              return (
                <TooltipBox title={`${ordinal(row.p)} percentile`}>
                  <TooltipRow color="var(--series-7)" label="Income before tax" value={pounds(row.before)} />
                </TooltipBox>
              );
            }}
          />
          <Area dataKey="before" stroke="var(--series-7)" strokeWidth={2} fill="var(--series-7)" fillOpacity={0.1}
            dot={false} activeDot={{ r: 5, stroke: 'var(--surface)', strokeWidth: 2 }} isAnimationActive={false} />
          {gross > 0 && (
            <ReferenceDot x={markerX} y={gross} r={6} fill="var(--series-7)" stroke="var(--surface)" strokeWidth={2}
              ifOverflow="extendDomain"
              label={{ value: 'You', position: 'left', fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function ChartCard({ title, subtitle, legend, children }: {
  title: string;
  subtitle: string;
  legend?: { label: string; color: string }[];
  children: ReactNode;
}) {
  return (
    <figure className="card chart">
      <figcaption>
        <h3 className="card-title">{title}</h3>
        <p className="muted">{subtitle}</p>
        {legend && (
          <ul className="legend">
            {legend.map(({ label, color }) => (
              <li key={label}><span className="legend-line" style={{ background: color }} />{label}</li>
            ))}
          </ul>
        )}
      </figcaption>
      {children}
    </figure>
  );
}

function TooltipBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="tooltip">
      <div className="tooltip-title">{title}</div>
      {children}
    </div>
  );
}

function TooltipRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="tooltip-row">
      <span>{color && <span className="swatch" style={{ background: color }} />}{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
