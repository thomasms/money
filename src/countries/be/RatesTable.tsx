import { Row } from '../../components/controls';
import { formatter, rate } from '../../format';
import { findBelgianYear } from './rules';
import type { BEState } from './index';

const fmt = formatter('EUR');

export function RatesTable({ state }: { state: BEState }) {
  const rules = findBelgianYear(state.taxYear);
  const bands = rules.brackets;

  return (
    <details className="card rates">
      <summary>
        <h3 className="card-title">Rates for income year {rules.label}</h3>
      </summary>
      <div className="rates-grid">
        <table>
          <caption>Income tax</caption>
          <tbody>
            {bands.map((band, i) => {
              const from = i === 0 ? 0 : bands[i - 1].upTo;
              const label = i === 0 ? `Up to ${fmt.whole(band.upTo)}`
                : band.upTo === Infinity ? `Over ${fmt.whole(from)}`
                  : `${fmt.whole(from)} to ${fmt.whole(band.upTo)}`;
              return <Row key={i} label={label} value={rate(band.rate)} />;
            })}
          </tbody>
        </table>
        <table>
          <caption>Allowances and contributions</caption>
          <tbody>
            <Row label="Tax-free amount" value={fmt.whole(rules.taxFreeAmount)} />
            {rules.children.totals.map((total, i) => (
              <Row key={i} label={`Extra for ${i + 1} ${i === 0 ? 'child' : 'children'}`} value={fmt.whole(total)} />
            ))}
            <Row label="Extra for each child after 4" value={fmt.whole(rules.children.perExtraChild)} />
            <Row label="Extra for a single parent" value={fmt.whole(rules.singleParent)} />
            <Row label={`Work expenses (${rate(rules.professionalExpenses.rate)}, up to)`} value={fmt.whole(rules.professionalExpenses.max)} />
            <Row label="Social security" value={rate(rules.socialSecurityRate)} />
            <Row label="Special social security (yearly maximum)" value={fmt.money(rules.specialSocialSecurity.max, 'month')} />
          </tbody>
        </table>
      </div>
      <p className="footnote">
        Income tax is charged on pay after social security and work expenses. The tax-free amount is
        taxed at the lowest rate and taken off your tax. Municipal tax is added on top at your
        municipality's rate. Income year {rules.label} is taxed in assessment year {Number(rules.id) + 1}.
      </p>
    </details>
  );
}
