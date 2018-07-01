import React from 'react';

import { TAX_COLOUR, NI_COLOUR, PENSION_COLOUR, SL_COLOUR, NET_COLOUR } from './colours.js';
import { computeAmountForPeriod } from './compute.js';
import { OutputLabel } from './labels.js';

function OutputMenu(props) {
  const periods = { ...props.periods };
  return (
    <div className={props.classname}>
      <OutputLabel
        color={TAX_COLOUR}
        name="Tax"
        value={computeAmountForPeriod(
          props.taxPaid,
          periods.taxPeriod)
        }
        handler={props.handleTaxChange}
        timeperiod={periods.taxPeriod}
      />
      <OutputLabel
        color={NI_COLOUR}
        name="NI"
        value={computeAmountForPeriod(
          props.niPaid,
          periods.niPeriod)
        }
        handler={props.handleNIChange}
        timeperiod={periods.niPeriod}
      />
      <OutputLabel
        color={PENSION_COLOUR}
        name="Pension"
        value={computeAmountForPeriod(
          props.pensionPaid,
          periods.pensionPeriod)
        }
        handler={props.handlePensionChange}
        timeperiod={periods.pensionPeriod}
      />
      <OutputLabel
        color={SL_COLOUR}
        name="Student Loan"
        value={computeAmountForPeriod(
          props.slPaid,
          periods.slPeriod)
        }
        handler={props.handleSlChange}
        timeperiod={periods.slPeriod}
      />
      <OutputLabel
        color={NET_COLOUR}
        name="Take home pay"
        value={computeAmountForPeriod(
          props.netSalary,
          periods.netSalaryPeriod)
        }
        handler={props.handleNetPeriodChange}
        timeperiod={periods.netSalaryPeriod}
      />
      <p className="small">*Assumes 52 weeks in a year and 7 days in a week</p>
    </div>
  );
}

export { OutputMenu };
