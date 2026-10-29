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
import { forPeriod, marginalRate, type Comparison, type Period, type Result } from '../countries/types';
import { ordinal, percent, PERIOD_LABELS, type Formatter } from '../format';

const CHART_HEIGHT = 260;
const AXIS = { stroke: 'var(--axis)', tick: { fill: 'var(--text-muted)', fontSize: 12 }, tickLine: false };
const GRID = <CartesianGrid vertical={false} stroke="var(--grid)" />;
const CURSOR = { stroke: 'var(--axis)', strokeWidth: 1 };

interface ChartProps {
  // Works out the result for a salary, keeping all other settings.
  calc: (salary: number) => Result;
  salary: number;
  fmt: Formatter;
}

// The salary range to plot: wide enough to show context around the user's salary.
function salaryRange(salary: number): number[] {
  const max = Math.max(150000, Math.ceil((salary * 1.5) / 10000) * 10000);
  const step = max / 300;
  const points: number[] = [];
  for (let s = 0; s <= max; s += step) points.push(Math.round(s));
  return points;
}

export function TakeHomeChart({ calc, salary: yourSalary, fmt, period }: ChartProps & { period: Period }) {
  const data = useMemo(
    () =>
      salaryRange(yourSalary).map((salary) => {
        const r = calc(salary);
        return { salary, gross: forPeriod(r.gross, period), takeHome: forPeriod(r.takeHome, period) };
      }),
    [calc, yourSalary, period],
  );
  const you = calc(yourSalary);

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
          <XAxis dataKey="salary" type="number" domain={['dataMin', 'dataMax']} tickFormatter={fmt.compact} {...AXIS} />
          <YAxis tickFormatter={fmt.compact} width={56} {...AXIS} axisLine={false} />
          <Tooltip
            cursor={CURSOR}
            content={({ active, payload }) => {
              const row = active && payload?.[0]?.payload;
              if (!row) return null;
              return (
                <TooltipBox title={`Salary ${fmt.whole(row.salary)}`}>
                  <TooltipRow color="var(--text-muted)" label="Gross" value={fmt.money(row.gross, period)} />
                  <TooltipRow color="var(--series-1)" label="Take-home" value={fmt.money(row.takeHome, period)} />
                </TooltipBox>
              );
            }}
          />
          <Line dataKey="gross" stroke="var(--text-muted)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Area dataKey="takeHome" stroke="var(--series-1)" strokeWidth={2} fill="var(--series-1)" fillOpacity={0.1}
            dot={false} activeDot={{ r: 5, stroke: 'var(--surface)', strokeWidth: 2 }} isAnimationActive={false} />
          {yourSalary > 0 && (
            <ReferenceDot x={yourSalary} y={forPeriod(you.takeHome, period)} r={6}
              fill="var(--series-1)" stroke="var(--surface)" strokeWidth={2}
              label={{ value: 'You', position: 'top', fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MarginalRateChart({ calc, salary: yourSalary, fmt, covers }: ChartProps & { covers: string }) {
  const data = useMemo(
    () => salaryRange(yourSalary).map((salary) => ({ salary, rate: marginalRate(calc, salary) })),
    [calc, yourSalary],
  );
  const yours = marginalRate(calc, yourSalary);
  const top = Math.max(0.7, Math.ceil(Math.max(...data.map((d) => d.rate)) * 10) / 10);
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1].filter((t) => t <= top);

  return (
    <ChartCard
      title={`Tax on your next ${fmt.whole(100)}`}
      subtitle={`From a ${fmt.whole(100)} pay rise you would keep ${fmt.whole(100 * (1 - yours))}. ${percent(yours)} goes to ${covers}.`}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          {GRID}
          <XAxis dataKey="salary" type="number" domain={['dataMin', 'dataMax']} tickFormatter={fmt.compact} {...AXIS} />
          <YAxis tickFormatter={(v: number) => percent(v)} domain={[0, top]} ticks={ticks} width={56}
            {...AXIS} axisLine={false} />
          <Tooltip
            cursor={CURSOR}
            content={({ active, payload }) => {
              const row = active && payload?.[0]?.payload;
              if (!row) return null;
              return (
                <TooltipBox title={`Salary ${fmt.whole(row.salary)}`}>
                  <TooltipRow color="var(--series-2)" label="Taken off" value={percent(row.rate)} />
                  <TooltipRow label="You keep" value={fmt.whole(100 * (1 - row.rate))} />
                </TooltipBox>
              );
            }}
          />
          <Line dataKey="rate" type="stepAfter" stroke="var(--series-2)" strokeWidth={2} dot={false}
            activeDot={{ r: 5, stroke: 'var(--surface)', strokeWidth: 2 }} isAnimationActive={false} />
          {yourSalary > 0 && (
            <ReferenceDot x={yourSalary} y={yours} r={6} fill="var(--series-2)" stroke="var(--surface)" strokeWidth={2}
              label={{ value: 'You', position: 'top', fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PercentileChart({ gross, comparison, fmt }: { gross: number; comparison: Comparison; fmt: Formatter }) {
  const { data, population } = comparison;
  const position = comparison.percentileOf(gross);
  const markerX = Math.min(99, Math.max(1, position));
  const headline =
    position >= 99 ? `Your pay is in the top 1% of ${population}.`
      : position < 1 ? `Your pay is in the bottom 1% of ${population}.`
        : `Your pay is higher than about ${Math.floor(position)}% of ${population}.`;

  return (
    <ChartCard
      title="How your pay compares"
      subtitle={`${headline} ${comparison.source}`}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          {GRID}
          <XAxis dataKey="p" type="number" domain={[1, 99]} ticks={[1, 25, 50, 75, 99]}
            tickFormatter={(v: number) => ordinal(v)} {...AXIS} />
          <YAxis tickFormatter={fmt.compact} width={56} {...AXIS} axisLine={false} />
          <Tooltip
            cursor={CURSOR}
            content={({ active, payload }) => {
              const row = active && payload?.[0]?.payload;
              if (!row) return null;
              return (
                <TooltipBox title={`${ordinal(row.p)} percentile`}>
                  <TooltipRow color="var(--series-7)" label="Income before tax" value={fmt.whole(row.value)} />
                </TooltipBox>
              );
            }}
          />
          <Area dataKey="value" stroke="var(--series-7)" strokeWidth={2} fill="var(--series-7)" fillOpacity={0.1}
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
