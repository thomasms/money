import React from 'react';
import { TAX_COLOUR, NI_COLOUR, PENSION_COLOUR, SL_COLOUR, NET_COLOUR } from './colours.js';
import { computeStudentLoanPaid, computeNIPaid, computeTaxPaid } from './compute.js';
import { DropDownDateInput } from './labels.js';
import { InputMenu } from './input.js'
import { OutputMenu } from './output.js'
import { MoneyPie } from './charts.js'

import Responsive from 'react-responsive';

const Desktop = props => <Responsive {...props} minWidth={992} />;
const TabletMobile = props => <Responsive {...props} maxWidth={991} />;

class IncomeForm extends React.Component {

      constructor( props ) {
        super( props );

        this.handleTaxYearChange = this.handleTaxYearChange.bind(this);

        this.handleGross = this.handleGross.bind(this);
        this.handleNonPensionableGross = this.handleNonPensionableGross.bind(this);
        this.handlePensionRate = this.handlePensionRate.bind(this);
        this.handleStudentLoan = this.handleStudentLoan.bind(this);
        this.handleChildCareVoucher = this.handleChildCareVoucher.bind(this);

        this.handleTaxChange = this.handleTaxChange.bind(this);
        this.handleNIChange = this.handleNIChange.bind(this);
        this.handlePensionChange = this.handlePensionChange.bind(this);
        this.handleNetPeriodChange = this.handleNetPeriodChange.bind(this);
        this.handleSlChange = this.handleSlChange.bind(this);

        this.state = {
          taxYear: '18/19',
          taxPeriod: 'year',
          niPeriod: 'year',
          pensionPeriod: 'year',
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
        this.setState({ taxPeriod: e.target.value.split(" ").pop() });
      }

      handleNIChange(e){
        this.setState({ niPeriod: e.target.value.split(" ").pop() });
      }

      handlePensionChange(e){
        this.setState({ pensionPeriod: e.target.value.split(" ").pop() });
      }

      handleSlChange(e){
        this.setState({ slPeriod: e.target.value.split(" ").pop() });
      }

      handleNetPeriodChange(e){
        this.setState({ netSalaryPeriod: e.target.value.split(" ").pop() });
      }

      handleTaxYearChange(e){
        this.setState({ taxYear: e.target.value.split(" ").pop()});
      }

      render(){
        const PAY_PIE_COLOURS = [ TAX_COLOUR, NI_COLOUR, PENSION_COLOUR,
                                  SL_COLOUR, NET_COLOUR ];

        return (
            <div>
              <h1 align="center">Income Tax Calculator</h1>

              {/* Desktop*/}
              <Desktop>
                <label>Tax Year</label>
                <DropDownDateInput handler={this.handleTaxYearChange} data={['18/19']}/>

                <InputMenu classname=""
                  handleGross={this.handleGross}
                  handleNonPensionableGross={this.handleNonPensionableGross}
                  handlePensionRate={this.handlePensionRate}
                  handleChildCareVoucher={this.handleChildCareVoucher}
                  handleStudentLoan={this.handleStudentLoan}
                />

                <div className="atthetopright">
                  <MoneyPie data={this.state.piedata} colours={PAY_PIE_COLOURS} size={400}/>
                </div>

                <OutputMenu classname="atthebottom"
                  taxPaid={this.state.taxPaid}
                  taxPeriod={this.state.taxPeriod}
                  handleTaxChange={this.handleTaxChange}
                  niPaid={this.state.niPaid}
                  niPeriod={this.state.niPeriod}
                  handleNIChange={this.handleNIChange}
                  pensionPaid={this.state.pensionPaid}
                  pensionPeriod={this.state.pensionPeriod}
                  handlePensionChange={this.handlePensionChange}
                  slPaid={this.state.slPaid}
                  slPeriod={this.state.slPeriod}
                  handleSlChange={this.handleSlChange}
                  netSalary={this.state.netSalary}
                  netSalaryPeriod={this.state.netSalaryPeriod}
                  handleNetPeriodChange={this.handleNetPeriodChange}
                />
              </Desktop>

              {/* Tablets or mobiles*/}
              <TabletMobile>
                <label>Tax Year</label>
                <DropDownDateInput handler={this.handleTaxYearChange} data={['18/19']}/>

                <InputMenu classname=""
                  handleGross={this.handleGross}
                  handleNonPensionableGross={this.handleNonPensionableGross}
                  handlePensionRate={this.handlePensionRate}
                  handleChildCareVoucher={this.handleChildCareVoucher}
                  handleStudentLoan={this.handleStudentLoan}
                />

                <OutputMenu classname=""
                  taxPaid={this.state.taxPaid}
                  taxPeriod={this.state.taxPeriod}
                  handleTaxChange={this.handleTaxChange}
                  niPaid={this.state.niPaid}
                  niPeriod={this.state.niPeriod}
                  handleNIChange={this.handleNIChange}
                  pensionPaid={this.state.pensionPaid}
                  pensionPeriod={this.state.pensionPeriod}
                  handlePensionChange={this.handlePensionChange}
                  slPaid={this.state.slPaid}
                  slPeriod={this.state.slPeriod}
                  handleSlChange={this.handleSlChange}
                  netSalary={this.state.netSalary}
                  netSalaryPeriod={this.state.netSalaryPeriod}
                  handleNetPeriodChange={this.handleNetPeriodChange}
                />

                <div className="">
                  <MoneyPie data={this.state.piedata} colours={PAY_PIE_COLOURS} size={400}/>
                </div>

              </TabletMobile>
            </div>
        );
      }
}

export default IncomeForm;
