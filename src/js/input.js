import React from 'react';

import { LabelWithInput, LabelWithCheck } from './labels.js';

function InputMenu(props) {

  const input = { ...props.input };
  return (
    <div className={props.classname}>
      <b><LabelWithInput name="Salary" unit="£/year" handler={props.handleGross} value={input.grossBasicSalary}/></b>
      <LabelWithInput name="Non pensionable salary" unit="£/year" handler={props.handleNonPensionableGross} value={input.grossNonPensionableSalary}/>
      <LabelWithInput name="Pension Rate" unit="%" handler={props.handlePensionRate} value={parseFloat(input.pensionRate)*100.0}/>
      <LabelWithInput name="Childcare voucher" unit="£/month" handler={props.handleChildCareVoucher} value={parseFloat(input.childcareVoucher)/12.0}/>
      <LabelWithCheck name="Student Loan (Type 1)" handler={props.handleStudentLoan} value={input.studentLoan}/>
    </div>
  );
}

export { InputMenu };
