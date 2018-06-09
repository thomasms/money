import React from 'react';
import { computeStudentLoanPaid, computeNIPaid, computeTaxPaid } from './compute.js';
import { LabelWithInput, LabelWithCheck, ReadOnlyLabel } from './labels.js';
import { MoneyPie } from './charts.js'


class IncomeForm extends React.Component {

      constructor( props ) {
        super( props );

        this.handleGross = this.handleGross.bind(this);
        this.handleNonPensionableGross = this.handleNonPensionableGross.bind(this);
        this.handlePensionRate = this.handlePensionRate.bind(this);
        this.handleStudentLoan = this.handleStudentLoan.bind(this);
        this.handleChildCareVoucher = this.handleChildCareVoucher.bind(this);

        this.state = {
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

      render(){
        return (
          <div>
            <div>
              <LabelWithInput name="Salary" unit="(£ per year)" handler={this.handleGross}/>
              <LabelWithInput name="Non pensionable salary" unit="(£ per year)" handler={this.handleNonPensionableGross}/>
              <LabelWithInput name="Pension Rate" unit="(%)" handler={this.handlePensionRate} />
              <LabelWithInput name="Childcare voucher" unit="(£ per month)" handler={this.handleChildCareVoucher}/>
              <LabelWithCheck name="Student Loan" handler={this.handleStudentLoan}/>
            </div>
            <div className="atthetopright">
              <MoneyPie data={this.state.piedata}/>
            </div>

            <div className="atthebottom">
              <ReadOnlyLabel classname="label-righty-red" name="Tax" value={this.state.taxPaid} unit="(£ per year)"/>
              <ReadOnlyLabel classname="label-righty-red" name="NI" value={this.state.niPaid} unit="(£ per year)"/>
              <ReadOnlyLabel classname="label-righty-red" name="Student Loan" value={this.state.slPaid} unit="(£ per year)"/>
              <ReadOnlyLabel classname="label-righty-red" name="Pension" value={this.state.pensionPaid} unit="(£ per year)"/>
              <ReadOnlyLabel classname="label-righty-blue" name="Take home pay" value={this.state.netSalary} unit="(£ per year)"/>
            </div>
          </div>
        );
      }
}

export default IncomeForm;
