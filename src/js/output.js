import React from 'react';

import { TAX_COLOUR, NI_COLOUR, PENSION_COLOUR, SL_COLOUR, NET_COLOUR } from './colours.js';
import { computeAmountForPeriod } from './compute.js';
import { OutputLabel } from './labels.js';

function OutputMenu(props) {
  return (
    <div className={props.classname}>
      <OutputLabel
        color={TAX_COLOUR}
        name="Tax"
        value={computeAmountForPeriod(
          props.taxPaid,
          props.taxPeriod)
        }
        handler={props.handleTaxChange}
        timeperiod={props.taxPeriod}
      />
      <OutputLabel
        color={NI_COLOUR}
        name="NI"
        value={computeAmountForPeriod(
          props.niPaid,
          props.niPeriod)
        }
        handler={props.handleNIChange}
        timeperiod={props.niPeriod}
      />
      <OutputLabel
        color={PENSION_COLOUR}
        name="Pension"
        value={computeAmountForPeriod(
          props.pensionPaid,
          props.pensionPeriod)
        }
        handler={props.handlePensionChange}
        timeperiod={props.pensionPeriod}
      />
      <OutputLabel
        color={SL_COLOUR}
        name="Student Loan"
        value={computeAmountForPeriod(
          props.slPaid,
          props.slPeriod)
        }
        handler={props.handleSlChange}
        timeperiod={props.slPeriod}
      />
      <OutputLabel
        color={NET_COLOUR}
        name="Take home pay"
        value={computeAmountForPeriod(
          props.netSalary,
          props.netSalaryPeriod)
        }
        handler={props.handleNetPeriodChange}
        timeperiod={props.netSalaryPeriod}
      />
      <p className="small">*Assumes 52 weeks in a year and 7 days in a week</p>
    </div>
  );
}

export { OutputMenu };
