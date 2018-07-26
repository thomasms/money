
const MONTH_TO_YEAR = 12.0;
const WEEK_TO_YEAR = 52.0;
const DAY_TO_YEAR = 7.0*WEEK_TO_YEAR;

export const TAX_YEAR_1819 = { 'short': '18/19', 'long': '2018 - 2019', 'id': 0 }
export const TAX_YEAR_1718 = { 'short': '17/18', 'long': '2017 - 2018', 'id': 1 }

export const AVAILABLE_TAX_YEARS = [TAX_YEAR_1819, TAX_YEAR_1718];

function findYearIndex(year){
    return AVAILABLE_TAX_YEARS.findIndex((y) => {
     return year['id'] === y['id'];
    });
}

export function computeAmountForPeriod(amount, period){
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

function computeStudentLoanPaid(gross, rate, threshold){
  // less than or equal to threshold - no NI paid
  if(gross <= threshold){
    return 0.0;
  }
  else{
    return ((gross - threshold)*rate);
  }
}

export function computeStudentLoanPaidType1TaxYear(gross, year){

  const rates      = [0.09, 0.09];
  const thresholds = [18330.0, 17775.0];

  var index = findYearIndex(year);
  return computeStudentLoanPaid(gross, rates[index], thresholds[index])
}

export function computeStudentLoanPaidType2TaxYear(gross, year){

  const rates      = [0.09, 0.09];
  const thresholds = [25000.0, 25000.0];

  var index = findYearIndex(year);
  return computeStudentLoanPaid(gross, rates[index], thresholds[index])
}

function computeNIPaid(gross, rates, thresholds){
  // less than or equal to threshold - no NI paid
  if(gross <= thresholds[0]){
    return 0.0;
  }
  else if(gross < thresholds[1]){
    return (gross - thresholds[0])*rates[0];
  }
  else{
    return ((gross - thresholds[1])*rates[1] + (thresholds[1] - thresholds[0])*rates[0]);
  }
}

export function computeNIPaidTaxYear(gross, year){

  const rates = [[0.12, 0.02], [0.12, 0.02]];
  const thresholds = [[8424.0, 46350.0], [8164.0, 45032.0]];

  var index = findYearIndex(year);
  return computeNIPaid(gross, rates[index], thresholds[index])
}

function computeTaxPaid(gross, rates, thresholds){

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

export function computeTaxPaidTaxYear(gross, year){

  const rates = [[0.2, 0.4, 0.45], [0.2, 0.4, 0.45]];
  const thresholds = [[11850.0, 34500.0, 150000.0], [11500.0, 33500.0, 150000.0]];

  var index = findYearIndex(year);
  return computeTaxPaid(gross, rates[index], thresholds[index])
}
