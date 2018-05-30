import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function LabelWithInput(props) {
  return (
    <div className="block">
      <label className="label-righty">{props.name}: </label>
      <input type="number" name={props.name} onChange={props.handler}/>
      <label> {props.unit}</label>
    </div>
  );
}

function LabelWithCheck(props){
  return (
    <div className="block">
      <label className="label-righty">{props.name}: </label>
      <input type="checkbox" name={props.name} onChange={props.handler}/>
    </div>
  );
}

function ReadOnlyRedLabel(props) {
  return (
    <div className="block">
      <label className="label-righty-red">{props.name} : </label>
      <input type="number" name={props.name} value={props.value.toFixed(2)} readOnly/>
      <label> {props.unit}</label>
    </div>
  );
}

function ReadOnlyBlueLabel(props) {
  return (
    <div className="block">
      <label className="label-righty-blue">{props.name} : </label>
      <input type="number" name={props.name} value={props.value.toFixed(2)} readOnly/>
      <label> {props.unit}</label>
    </div>
  );
}

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
        };
      }

      update(basicGross, nonPensionableGross, pensionRate){
        //NI is paid on pension
        //Tax is not paid on pension
        const childcareVoucher = parseFloat(this.state.childcareVoucher);
        const totalGross = basicGross + nonPensionableGross - childcareVoucher;
        const niPaid = computeNIPaid(totalGross);
        const taxPaid = computeTaxPaid(totalGross - (basicGross*pensionRate));
        const slPaid = this.state.studentLoan ? computeStudentLoanPaid(totalGross) : 0.0;

        this.setState({
          grossBasicSalary: parseFloat(basicGross),
          grossNonPensionableSalary: parseFloat(nonPensionableGross),
          pensionRate: parseFloat(pensionRate),
          taxPaid: parseFloat(taxPaid),
          niPaid: parseFloat(niPaid),
          slPaid: parseFloat(slPaid),
          pensionPaid: parseFloat(pensionRate*basicGross),
          netSalary: parseFloat(basicGross) + parseFloat(nonPensionableGross) -
                parseFloat(niPaid) - parseFloat(taxPaid) -
                parseFloat(pensionRate*basicGross) - parseFloat(slPaid) - parseFloat(childcareVoucher),
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

      // has a bug - need to fix
      handleChildCareVoucher(e){
        const amount = e.target.value === "" ? 0.0 : parseFloat(e.target.value)*12.0;
        this.setState({
          childcareVoucher: amount,
        });

        const pensionRate = parseFloat(this.state.pensionRate);
        const basicGross = parseFloat(this.state.grossBasicSalary);
        const nonPensionableGross = parseFloat(this.state.grossNonPensionableSalary);
        this.update(basicGross, nonPensionableGross, pensionRate);
      }

      handleStudentLoan(e){
        const studentLoan = !e.target.checked;
        this.setState({
          studentLoan: studentLoan,
        });

        const pensionRate = parseFloat(this.state.pensionRate);
        const basicGross = parseFloat(this.state.grossBasicSalary);
        const nonPensionableGross = parseFloat(this.state.grossNonPensionableSalary);
        this.update(basicGross, nonPensionableGross, pensionRate);
      }

      render(){
        return (
          <div>
            <div>
              <LabelWithInput name="Salary" unit="(£ per year)" handler={this.handleGross}/>
              <LabelWithInput name="Non pensionable salary" unit="(£ per year)" handler={this.handleNonPensionableGross}/>
              <LabelWithInput name="Pension Rate" unit="(%)" handler={this.handlePensionRate}/>
              {/*<LabelWithInput name="Childcare voucher" unit="(£ per month)" handler={this.handleChildCareVoucher}/>}*/}
              <LabelWithCheck name="Student Loan" handler={this.handleStudentLoan}/>
            </div>

            <div className="atthebottom">
              <ReadOnlyRedLabel name="Tax" value={this.state.taxPaid} unit="(£ per year)"/>
              <ReadOnlyRedLabel name="NI" value={this.state.niPaid} unit="(£ per year)"/>
              <ReadOnlyRedLabel name="Student Loan" value={this.state.slPaid} unit="(£ per year)"/>
              <ReadOnlyRedLabel name="Pension" value={this.state.pensionPaid} unit="(£ per year)"/>
              <ReadOnlyBlueLabel name="Take home pay" value={this.state.netSalary} unit="(£ per year)"/>
            </div>
          </div>
        );
      }
}

function computeStudentLoanPaid(gross){
  const rate = 0.09;
  const threshold = 18330.0;

  // less than or equal to threshold - no NI paid
  if(gross <= threshold){
    return 0.0;
  }
  else{
    return ((gross - threshold)*rate);
  }

}

function computeNIPaid(gross){
  const rates = [0.12, 0.02];
  const weeksInYear = 52;
  const thresholds = [162.0*weeksInYear, 892.0*weeksInYear];

  // less than or equal to threshold - no NI paid
  if(gross <= thresholds[0]){
    return 0.0;
  }
  else if(gross <= thresholds[1]){
    return (gross - thresholds[0])*rates[0];
  }
  else{
    return ((gross - thresholds[1])*rates[1] + (thresholds[1] - thresholds[0])*rates[0]);
  }
}

function computeTaxPaid(gross){

  const rates = [0.2, 0.4, 0.45];
  const thresholds = [11850.0, 34500.0, 150000.0];

  const personalAllowance = thresholds[0];
  const personalAllowanceLowerGrossLimit = 100000.0;
  const personalAllowanceUpperGrossLimit = personalAllowanceLowerGrossLimit +
                                           2.0*personalAllowance;

  // less than or equal to threshold - no tax paid
  if(gross <= personalAllowance){
    return 0.0;
  }
  // less than or equal to next threshold - pay 20% on earnings above allowance
  else if(gross <= (thresholds[1] + personalAllowance)){
    return (gross - personalAllowance)*rates[0];
  }
  // above 100,000 the tax free allowance decreases by £1 for every £2 over
  // if under or equal to 100,000 but over 46350 you get all the allowance and pay 20%
  // on 34500 and 40% on remaining amount
  else if(gross <= personalAllowanceLowerGrossLimit){
    return (thresholds[1]*rates[0] +
            (gross - thresholds[1] - personalAllowance)*rates[1]);
  }
  // above 100,000 the tax free allowance decreases by £1 for every £2 over
  // if over 100,000 but under 150,000 you get some allowance and pay 20%
  // on 34500 and 40% on remaining amount
  else if(gross <= personalAllowanceUpperGrossLimit){
    return (thresholds[1]*rates[0] +
            (gross - thresholds[1] -
              (personalAllowance - (gross-personalAllowanceLowerGrossLimit)/2.0))
              *rates[1]);
  }
  // no allowance but under 150,000
  else if(gross <= thresholds[2]){
    return (thresholds[1]*rates[0] + (gross - thresholds[1])*rates[1]);
  }
  // over 150,000 pay alot of tax
  else{
    return (thresholds[1]*rates[0] +
              (thresholds[2] - thresholds[1])*rates[1] +
                  (gross - thresholds[2])*rates[2]);
  }
}

class Main extends React.Component {
  render() {
    return (
      <div>
          <IncomeForm />
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
