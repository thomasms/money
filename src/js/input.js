import React from 'react';

import { LabelWithInput, LabelWithCheck } from './labels.js';

function InputMenu(props) {
  return (
    <div className={props.classname}>
      <b><LabelWithInput name="Salary" unit="(£ per year)" handler={props.handleGross}/></b>
      <LabelWithInput name="Non pensionable salary" unit="(£ per year)" handler={props.handleNonPensionableGross}/>
      <LabelWithInput name="Pension Rate" unit="(%)" handler={props.handlePensionRate} />
      <LabelWithInput name="Childcare voucher" unit="(£ per month)" handler={props.handleChildCareVoucher}/>
      <LabelWithCheck name="Student Loan" handler={props.handleStudentLoan}/>
    </div>
  );
}

export { InputMenu };
