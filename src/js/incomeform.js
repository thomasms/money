import React from 'react';
import { TAX_COLOUR, NI_COLOUR, PENSION_COLOUR, SL_COLOUR, NET_COLOUR } from './colours.js';
import { computeStudentLoanPaid, computeNIPaid, computeTaxPaid } from './compute.js';
import { DropDownDateInput } from './labels.js';
import { InputMenu } from './input.js'
import { OutputMenu } from './output.js'
import { MoneyPie } from './charts.js'

import Responsive from 'react-responsive';

const Desktop = props => <Responsive {...props} minWidth={992} minHeight={692}/>;
const TabletLandscape = props => <Responsive {...props} maxHeight={691}/>;
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
          input: {
            grossBasicSalary: 0.0,
            grossNonPensionableSalary: 0.0,
            pensionRate: 0.0,
            childcareVoucher: 0.0,
            studentLoan: false,
          },
          outputPeriods:{
            taxPeriod: 'year',
            niPeriod: 'year',
            pensionPeriod: 'year',
            slPeriod: 'year',
            netSalaryPeriod: 'year',
          },
          netSalary: 0.0,
          taxPaid: 0.0,
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

      update(input){
        //NI is paid on pension
        //Tax is not paid on pension
        const totalGross = input.grossBasicSalary +
                      input.grossNonPensionableSalary - input.childcareVoucher;
        const niPaid = computeNIPaid(totalGross);
        const pensionPaid = parseFloat(input.pensionRate*input.grossBasicSalary);
        const taxPaid = computeTaxPaid(totalGross - pensionPaid);
        const slPaid = input.studentLoan ? computeStudentLoanPaid(totalGross) : 0.0;
        const net = input.grossBasicSalary + input.grossNonPensionableSalary -
              parseFloat(niPaid) - parseFloat(taxPaid) -
              parseFloat(input.pensionRate*input.grossBasicSalary) -
              parseFloat(slPaid) - parseFloat(input.childcareVoucher);

        this.setState({
          input: input,
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
        var input = {...this.state.input};
        input.grossBasicSalary = e.target.value === "" ? 0.0 : parseFloat(e.target.value);
        this.update(input);
      }

      handleNonPensionableGross(e) {
        var input = {...this.state.input};
        input.grossNonPensionableSalary = e.target.value === "" ? 0.0 : parseFloat(e.target.value);
        this.update(input);
      }

      handlePensionRate(e){
        var input = {...this.state.input};
        const rate = e.target.value === "" ? 0.0 : parseFloat(e.target.value);
        input.pensionRate = parseFloat(parseFloat(rate)/100.0);
        this.update(input);
      }

      handleChildCareVoucher(e){
        var input = {...this.state.input};
        input.childcareVoucher = e.target.value === "" ? 0.0 : parseFloat(e.target.value)*12.0;
        this.update(input);
      }

      handleStudentLoan(e){
        var input = {...this.state.input};
        input.studentLoan = e.target.checked;
        this.update(input);
      }

      handleTaxChange(e){
        var periods = {...this.state.outputPeriods};
        periods.taxPeriod = e.target.value.split(" ").pop();
        this.setState({ outputPeriods: periods });
      }

      handleNIChange(e){
        var periods = {...this.state.outputPeriods};
        periods.niPeriod = e.target.value.split(" ").pop();
        this.setState({ outputPeriods: periods });
      }

      handlePensionChange(e){
        var periods = {...this.state.outputPeriods};
        periods.pensionPeriod = e.target.value.split(" ").pop();
        this.setState({ outputPeriods: periods });
      }

      handleSlChange(e){
        var periods = {...this.state.outputPeriods};
        periods.slPeriod = e.target.value.split(" ").pop();
        this.setState({ outputPeriods: periods });
      }

      handleNetPeriodChange(e){
        var periods = {...this.state.outputPeriods};
        periods.netSalaryPeriod = e.target.value.split(" ").pop();
        this.setState({ outputPeriods: periods });
      }

      handleTaxYearChange(e){
        this.setState({ taxYear: e.target.value.split(" ").pop()});
      }

      render(){
        const PAY_PIE_COLOURS = [ TAX_COLOUR, NI_COLOUR, PENSION_COLOUR,
                                  SL_COLOUR, NET_COLOUR ];

        const input = {...this.state.input};
        return (
            <div>
              <h1 align="center">Income Tax Calculator</h1>

              {/* Desktop*/}
              <Desktop>
                <label>Tax Year</label>
                <DropDownDateInput handler={this.handleTaxYearChange} data={['18/19']}/>

                <InputMenu classname=""
                  input={input}
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
                  periods={this.state.outputPeriods}
                  taxPaid={this.state.taxPaid}
                  handleTaxChange={this.handleTaxChange}
                  niPaid={this.state.niPaid}
                  handleNIChange={this.handleNIChange}
                  pensionPaid={this.state.pensionPaid}
                  handlePensionChange={this.handlePensionChange}
                  slPaid={this.state.slPaid}
                  handleSlChange={this.handleSlChange}
                  netSalary={this.state.netSalary}
                  handleNetPeriodChange={this.handleNetPeriodChange}
                />
              </Desktop>

              {/* Tablets or mobiles*/}
              <TabletLandscape>
                <label>Tax Year</label>
                <DropDownDateInput handler={this.handleTaxYearChange} data={['18/19']}/>

                <InputMenu classname=""
                  input={input}
                  handleGross={this.handleGross}
                  handleNonPensionableGross={this.handleNonPensionableGross}
                  handlePensionRate={this.handlePensionRate}
                  handleChildCareVoucher={this.handleChildCareVoucher}
                  handleStudentLoan={this.handleStudentLoan}
                />

                <div className="vertspace"/>
                
                <OutputMenu classname="attheright"
                  periods={this.state.outputPeriods}
                  taxPaid={this.state.taxPaid}
                  handleTaxChange={this.handleTaxChange}
                  niPaid={this.state.niPaid}
                  handleNIChange={this.handleNIChange}
                  pensionPaid={this.state.pensionPaid}
                  handlePensionChange={this.handlePensionChange}
                  slPaid={this.state.slPaid}
                  handleSlChange={this.handleSlChange}
                  netSalary={this.state.netSalary}
                  handleNetPeriodChange={this.handleNetPeriodChange}
                />

                <div className="">
                  <MoneyPie data={this.state.piedata} colours={PAY_PIE_COLOURS} size={400}/>
                </div>

              </TabletLandscape>

              {/* Tablets or mobiles*/}
              <TabletMobile>
                <label>Tax Year</label>
                <DropDownDateInput handler={this.handleTaxYearChange} data={['18/19']}/>

                <InputMenu classname=""
                  input={input}
                  handleGross={this.handleGross}
                  handleNonPensionableGross={this.handleNonPensionableGross}
                  handlePensionRate={this.handlePensionRate}
                  handleChildCareVoucher={this.handleChildCareVoucher}
                  handleStudentLoan={this.handleStudentLoan}
                />

                <div className="vertspace"/>

                <OutputMenu classname="attheright"
                  periods={this.state.outputPeriods}
                  taxPaid={this.state.taxPaid}
                  handleTaxChange={this.handleTaxChange}
                  niPaid={this.state.niPaid}
                  handleNIChange={this.handleNIChange}
                  pensionPaid={this.state.pensionPaid}
                  handlePensionChange={this.handlePensionChange}
                  slPaid={this.state.slPaid}
                  handleSlChange={this.handleSlChange}
                  netSalary={this.state.netSalary}
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
