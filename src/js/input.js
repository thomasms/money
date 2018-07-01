import React from 'react';

import { LabelWithInput, LabelWithCheck } from './labels.js';

function InputMenu(props) {

  const input = { ...props.input };
  return (
    <div className={props.classname}>
      <b><LabelWithInput name="Salary" unit="(£ per year)" handler={props.handleGross} value={input.grossBasicSalary}/></b>
      <LabelWithInput name="Non pensionable salary" unit="(£ per year)" handler={props.handleNonPensionableGross} value={input.grossNonPensionableSalary}/>
      <LabelWithInput name="Pension Rate" unit="(%)" handler={props.handlePensionRate} value={parseFloat(input.pensionRate)*100.0}/>
      <LabelWithInput name="Childcare voucher" unit="(£ per month)" handler={props.handleChildCareVoucher} value={parseFloat(input.childcareVoucher)/12.0}/>
      <LabelWithCheck name="Student Loan" handler={props.handleStudentLoan} value={input.studentLoan}/>
    </div>
  );
}

export { InputMenu };
