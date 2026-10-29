import { Row } from '../../components/controls';
import { formatter, rate } from '../../format';
import { findTaxYear } from './rules';
import type { UKState } from './index';

const fmt = formatter('GBP');

export function RatesTable({ state }: { state: UKState }) {
  const rules = findTaxYear(state.taxYear);
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
            <Row label={`Up to ${fmt.whole(tax.personalAllowance)}`} value={rate(0)} />
            <Row label={`${fmt.whole(tax.personalAllowance + 1)} to ${fmt.whole(higherStart)}`} value={rate(tax.basicRate)} />
            <Row label={`${fmt.whole(higherStart + 1)} to ${fmt.whole(tax.additionalRateThreshold)}`} value={rate(tax.higherRate)} />
            <Row label={`Over ${fmt.whole(tax.additionalRateThreshold)}`} value={rate(tax.additionalRate)} />
          </tbody>
        </table>
        <table>
          <caption>National Insurance</caption>
          <tbody>
            <Row label={`Up to ${fmt.whole(ni.primaryThreshold)}`} value={rate(0)} />
            <Row label={`${fmt.whole(ni.primaryThreshold + 1)} to ${fmt.whole(ni.upperEarningsLimit)}`} value={rate(ni.mainRate)} />
            <Row label={`Over ${fmt.whole(ni.upperEarningsLimit)}`} value={rate(ni.upperRate)} />
          </tbody>
        </table>
        <table>
          <caption>Student loans (on pay over)</caption>
          <tbody>
            {loans.map(({ name, plan }) =>
              plan ? <Row key={name} label={`${name}: ${fmt.whole(plan.threshold)}`} value={rate(plan.rate)} /> : null,
            )}
          </tbody>
        </table>
      </div>
      {rules.note && <p className="footnote">{rules.note}</p>}
      <p className="footnote">
        Your personal allowance goes down by £1 for every £2 of income over{' '}
        {fmt.whole(tax.allowanceTaperStart)}. Rates are for England, Wales and Northern Ireland, from{' '}
        <a href="https://www.gov.uk/income-tax-rates" target="_blank" rel="noreferrer">GOV.UK</a>.
      </p>
    </details>
  );
}
