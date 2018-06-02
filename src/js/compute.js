
export function computeStudentLoanPaid(gross){
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

const weeksInYear = 52;

export function computeNIPaid(gross){
  const rates = [0.12, 0.02];
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

export function computeTaxPaid(gross){

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
