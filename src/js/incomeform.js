import React from 'react';
import { TAX_COLOUR, NI_COLOUR, PENSION_COLOUR, SL_COLOUR, NET_COLOUR } from './colours.js';
import { computeStudentLoanPaid, computeNIPaid, computeTaxPaid } from './compute.js';
import { LabelWithInput, LabelWithCheck, ReadOnlyLabel } from './labels.js';
import { MoneyPie } from './charts.js'

const MONTH_TO_YEAR = 12.0;
const WEEK_TO_YEAR = 52.0;
const DAY_TO_YEAR = 7.0*WEEK_TO_YEAR;

function computeAmountForPeriod(amount, period){
    if(period === 'year'){
      return parseFloat(amount);
    }
    else if(period === 'month'){
      return parseFloat(amount/MONTH_TO_YEAR);
    }
    else if(period === 'week'){
      return parseFloat(amount/WEEK_TO_YEAR);
    }
    else{
      return parseFloat(amount/DAY_TO_YEAR);
    }
}

class IncomeForm extends React.Component {

      constructor( props ) {
        super( props );

        this.handleGross = this.handleGross.bind(this);
        this.handleNonPensionableGross = this.handleNonPensionableGross.bind(this);
        this.handlePensionRate = this.handlePensionRate.bind(this);
        this.handleStudentLoan = this.handleStudentLoan.bind(this);
        this.handleChildCareVoucher = this.handleChildCareVoucher.bind(this);

        this.handleTaxChange = this.handleTaxChange.bind(this);
        this.handleNIChange = this.handleNIChange.bind(this);
        this.handleNetPeriodChange = this.handleNetPeriodChange.bind(this);
        this.handleSlChange = this.handleSlChange.bind(this);

        this.state = {
          taxPeriod: 'year',
          niPeriod: 'year',
          slPeriod: 'year',
          netSalaryPeriod: 'year',
          grossBasicSalary: 0.0,
          grossNonPensionableSalary: 0.0,
          pensionRate: 0.0,
          netSalary: 0.0,
          taxPaid: 0.0,
          childcareVoucher: 0.0,
          studentLoan: false,
          slPaid: 0.0,
          niPaid: 0.0,
          pensionPaid: 0.0,
          piedata: [{name: 'Tax', value: 0},
                 {name: 'NI', value: 0},
                 {name: 'Pension', value: 0},
                 {name: 'Student Loan', value: 0},
                 {name: 'Take Home', value: 0}],
        };
      }

      update(basicGross, nonPensionableGross, pensionRate){
        //NI is paid on pension
        //Tax is not paid on pension
        const childcareVoucher = parseFloat(this.state.childcareVoucher);
        const totalGross = basicGross + nonPensionableGross - childcareVoucher;
        const niPaid = computeNIPaid(totalGross);
        const pensionPaid = parseFloat(pensionRate*basicGross);
        const taxPaid = computeTaxPaid(totalGross - pensionPaid);
        const slPaid = this.state.studentLoan ? computeStudentLoanPaid(totalGross) : 0.0;
        const net = parseFloat(basicGross) + parseFloat(nonPensionableGross) -
              parseFloat(niPaid) - parseFloat(taxPaid) -
              parseFloat(pensionRate*basicGross) - parseFloat(slPaid) - parseFloat(childcareVoucher);

        this.setState({
          grossBasicSalary: parseFloat(basicGross),
          grossNonPensionableSalary: parseFloat(nonPensionableGross),
          pensionRate: parseFloat(pensionRate),
          taxPaid: parseFloat(taxPaid),
          niPaid: parseFloat(niPaid),
          slPaid: parseFloat(slPaid),
          pensionPaid: parseFloat(pensionPaid),
          netSalary: parseFloat(net),
          piedata: [{name: 'Tax', value: taxPaid},
                    {name: 'NI', value: niPaid},
                    {name: 'Pension', value: pensionPaid},
                    {name: 'Student Loan', value: slPaid},
                    {name: 'Take Home', value: net}],
        });
      }

      handleGross(e) {
        const basicGross = e.target.value === "" ? 0.0 : parseFloat(e.target.value);
        const nonPensionableGross = parseFloat(this.state.grossNonPensionableSalary);
        this.update(basicGross, nonPensionableGross, parseFloat(this.state.pensionRate));
      }

      handleNonPensionableGross(e) {
        const nonPensionableGross = e.target.value === "" ? 0.0 : parseFloat(e.target.value);
        const basicGross = parseFloat(this.state.grossBasicSalary);
        this.update(basicGross, nonPensionableGross, parseFloat(this.state.pensionRate));
      }

      handlePensionRate(e){
        const rate = e.target.value === "" ? 0.0 : parseFloat(e.target.value);
        const pensionRate = parseFloat(parseFloat(rate)/100.0);
        const basicGross = parseFloat(this.state.grossBasicSalary);
        const nonPensionableGross = parseFloat(this.state.grossNonPensionableSalary);
        this.update(basicGross, nonPensionableGross, pensionRate);
      }

      handleChildCareVoucher(e){
        const amount = e.target.value === "" ? 0.0 : parseFloat(e.target.value)*12.0;
        this.setState({ childcareVoucher: amount, },
                () => {
                    const pensionRate = parseFloat(this.state.pensionRate);
                    const basicGross = parseFloat(this.state.grossBasicSalary);
                    const nonPensionableGross = parseFloat(this.state.grossNonPensionableSalary);
                    this.update(basicGross, nonPensionableGross, pensionRate);
                });
      }

      handleStudentLoan(e){
        this.setState({ studentLoan: e.target.checked, },
                () => {
                  const pensionRate = parseFloat(this.state.pensionRate);
                  const basicGross = parseFloat(this.state.grossBasicSalary);
                  const nonPensionableGross = parseFloat(this.state.grossNonPensionableSalary);
                  this.update(basicGross, nonPensionableGross, pensionRate);
                });
      }

      handleTaxChange(e){
        this.setState({ taxPeriod: e.target.value });
      }

      handleNIChange(e){
        this.setState({ niPeriod: e.target.value });
      }

      handleSlChange(e){
        this.setState({ slPeriod: e.target.value });
      }

      handleNetPeriodChange(e){
        this.setState({ netSalaryPeriod: e.target.value });
      }

      render(){
        const PAY_PIE_COLOURS = [ TAX_COLOUR, NI_COLOUR, PENSION_COLOUR,
                                  SL_COLOUR, NET_COLOUR ];

        return (
          <div>
            <h1 align="center">Income Tax Calculator</h1>

            <div>
              <b><LabelWithInput name="Salary" unit="(£ per year)" handler={this.handleGross}/></b>
              <LabelWithInput name="Non pensionable salary" unit="(£ per year)" handler={this.handleNonPensionableGross}/>
              <LabelWithInput name="Pension Rate" unit="(%)" handler={this.handlePensionRate} />
              <LabelWithInput name="Childcare voucher" unit="(£ per month)" handler={this.handleChildCareVoucher}/>
              <LabelWithCheck name="Student Loan" handler={this.handleStudentLoan}/>
            </div>

            <div className="atthetopright">
              <MoneyPie data={this.state.piedata} colours={PAY_PIE_COLOURS}/>
            </div>

            <div className="atthebottom">
              <ReadOnlyLabel
                classname="label-righty"
                color={TAX_COLOUR}
                name="Tax"
                value={computeAmountForPeriod(
                  this.state.taxPaid,
                  this.state.taxPeriod)
                }
                handler={this.handleTaxChange}
                timeperiod={this.taxPeriod}
                unit="(£ per year)"
                periods = {['year', 'month', 'week', 'day']}
              />
              <ReadOnlyLabel
                classname="label-righty"
                color={NI_COLOUR}
                name="NI"
                value={computeAmountForPeriod(
                  this.state.niPaid,
                  this.state.niPeriod)
                }
                handler={this.handleNIChange}
                timeperiod={this.niPeriod}
                unit="(£ per year)"
                periods = {['year', 'month', 'week', 'day']}
              />
              <ReadOnlyLabel
                classname="label-righty"
                color={PENSION_COLOUR}
                name="Pension"
                value={this.state.pensionPaid}
                unit="(£ per year)"
                periods = {['year', 'month', 'week', 'day']}
              />
              <ReadOnlyLabel
                classname="label-righty"
                color={SL_COLOUR}
                name="Student Loan"
                value={computeAmountForPeriod(
                  this.state.slPaid,
                  this.state.slPeriod)
                }
                handler={this.handleSlChange}
                timeperiod={this.slPeriod}
                unit="(£ per year)"
                periods = {['year', 'month', 'week', 'day']}
              />
              <ReadOnlyLabel
                classname="label-righty"
                color={NET_COLOUR}
                name="Take home pay"
                value={computeAmountForPeriod(
                  this.state.netSalary,
                  this.state.netSalaryPeriod)
                }
                unit="(£ per year)"
                handler={this.handleNetPeriodChange}
                timeperiod={this.netSalaryPeriod}
                periods = {['year', 'month', 'week', 'day']}
              />
              <p className="small">*Assumes 52 weeks in a year and 7 days in a week</p>
            </div>
          </div>
        );
      }
}

export default IncomeForm;
