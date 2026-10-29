import type { TaxYearRules } from '../tax/years';
import { pounds } from '../format';

export function RatesTable({ rules }: { rules: TaxYearRules }) {
  const tax = rules.incomeTax;
  const ni = rules.nationalInsurance;
  const higherStart = tax.personalAllowance + tax.basicRateBand;
  const loans = [
    { name: 'Plan 1', plan: rules.studentLoans.plan1 },
    { name: 'Plan 2', plan: rules.studentLoans.plan2 },
    { name: 'Plan 4', plan: rules.studentLoans.plan4 },
    { name: 'Plan 5', plan: rules.studentLoans.plan5 },
    { name: 'Postgraduate', plan: rules.studentLoans.postgraduate },
  ];

  return (
    <details className="card rates">
      <summary>
        <h3 className="card-title">Rates and thresholds for {rules.label}</h3>
      </summary>
      <div className="rates-grid">
        <table>
          <caption>Income tax</caption>
          <tbody>
            <Row label={`Up to ${pounds(tax.personalAllowance)}`} rate={0} />
            <Row label={`${pounds(tax.personalAllowance + 1)} to ${pounds(higherStart)}`} rate={tax.basicRate} />
            <Row label={`${pounds(higherStart + 1)} to ${pounds(tax.additionalRateThreshold)}`} rate={tax.higherRate} />
            <Row label={`Over ${pounds(tax.additionalRateThreshold)}`} rate={tax.additionalRate} />
          </tbody>
        </table>
        <table>
          <caption>National Insurance</caption>
          <tbody>
            <Row label={`Up to ${pounds(ni.primaryThreshold)}`} rate={0} />
            <Row label={`${pounds(ni.primaryThreshold + 1)} to ${pounds(ni.upperEarningsLimit)}`} rate={ni.mainRate} />
            <Row label={`Over ${pounds(ni.upperEarningsLimit)}`} rate={ni.upperRate} />
          </tbody>
        </table>
        <table>
          <caption>Student loans (on pay over)</caption>
          <tbody>
            {loans.map(({ name, plan }) =>
              plan ? <Row key={name} label={`${name}: ${pounds(plan.threshold)}`} rate={plan.rate} /> : null,
            )}
          </tbody>
        </table>
      </div>
      {rules.note && <p className="footnote">{rules.note}</p>}
      <p className="footnote">
        Your personal allowance goes down by £1 for every £2 of income over{' '}
        {pounds(tax.allowanceTaperStart)}. Rates are for England, Wales and Northern Ireland, from{' '}
        <a href="https://www.gov.uk/income-tax-rates" target="_blank" rel="noreferrer">GOV.UK</a>.
      </p>
    </details>
  );
}

function Row({ label, rate }: { label: string; rate: number }) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td className="num">{Number((rate * 100).toFixed(2))}%</td>
    </tr>
  );
}
