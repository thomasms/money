import React from 'react';
import { TAX_COLOUR, NI_COLOUR, PENSION_COLOUR, SL_COLOUR, NET_COLOUR } from './colours.js';
import {
  computeStudentLoanPaidType1TaxYear,
  computeNIPaidTaxYear,
  computeTaxPaidTaxYear,
  AVAILABLE_TAX_YEARS } from './compute.js';
import { InputMenu } from './input.js'
import { OutputMenu } from './output.js'
import { Timer } from './timer.js'
import { MoneyPie, MoneyChart } from './charts.js'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavLink,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col } from 'reactstrap';
import FaHome from 'react-icons/lib/fa/home';
import FaPieChart from 'react-icons/lib/fa/pie-chart';

class IncomeForm extends React.Component {

      constructor( props ) {
        super( props );

        this.handleTaxYearSelected = this.handleTaxYearSelected.bind(this);

        this.handleGross = this.handleGross.bind(this);
        this.handleNonPensionableGross = this.handleNonPensionableGross.bind(this);
        this.handlePensionRate = this.handlePensionRate.bind(this);
        this.handleStudentLoanType1 = this.handleStudentLoanType1.bind(this);
        this.handleChildCareVoucher = this.handleChildCareVoucher.bind(this);

        this.handleTaxChange = this.handleTaxChange.bind(this);
        this.handleNIChange = this.handleNIChange.bind(this);
        this.handlePensionChange = this.handlePensionChange.bind(this);
        this.handleNetPeriodChange = this.handleNetPeriodChange.bind(this);
        this.handleSlChange = this.handleSlChange.bind(this);

        this.toggle = this.toggle.bind(this);

        this.state = {
          isOpen: false,
          input: {
            taxYear: AVAILABLE_TAX_YEARS[0],
            grossBasicSalary: 0.0,
            grossNonPensionableSalary: 0.0,
            pensionRate: 0.0,
            childcareVoucher: 0.0,
            studentLoanType1: false,
            studentLoanType2: false,
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

      resetLayout() {
        this.setState({ layouts: {} });
      }

      update(input){
        //NI is paid on pension
        //Tax is not paid on pension
        const totalGross = input.grossBasicSalary +
                      input.grossNonPensionableSalary - input.childcareVoucher;
        const niPaid = computeNIPaidTaxYear(totalGross, input.taxYear);
        const pensionPaid = parseFloat(input.pensionRate*input.grossBasicSalary);
        const taxPaid = computeTaxPaidTaxYear(totalGross - pensionPaid, input.taxYear);
        const slPaid = input.studentLoanType1 ? computeStudentLoanPaidType1TaxYear(totalGross, input.taxYear) : 0.0;
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

      handleStudentLoanType1(e){
        var input = {...this.state.input};
        input.studentLoanType1 = e.target.checked;
        this.update(input);
      }

      handleStudentLoanType2(e){
        var input = {...this.state.input};
        input.studentLoanType2 = e.target.checked;
        this.update(input);
      }

      handleTaxChange(e){
        var periods = {...this.state.outputPeriods};
        periods.taxPeriod = e.target.value.split("/").pop();
        this.setState({ outputPeriods: periods });
      }

      handleNIChange(e){
        var periods = {...this.state.outputPeriods};
        periods.niPeriod = e.target.value.split("/").pop();
        this.setState({ outputPeriods: periods });
      }

      handlePensionChange(e){
        var periods = {...this.state.outputPeriods};
        periods.pensionPeriod = e.target.value.split("/").pop();
        this.setState({ outputPeriods: periods });
      }

      handleSlChange(e){
        var periods = {...this.state.outputPeriods};
        periods.slPeriod = e.target.value.split("/").pop();
        this.setState({ outputPeriods: periods });
      }

      handleNetPeriodChange(e){
        var periods = {...this.state.outputPeriods};
        periods.netSalaryPeriod = e.target.value.split("/").pop();
        this.setState({ outputPeriods: periods });
      }

      handleTaxYearSelected(e){
        // long name is used
        var input = {...this.state.input};
        var index = AVAILABLE_TAX_YEARS.findIndex((y) => {
         return e.target.innerText === y['long'];
        });
        input.taxYear = AVAILABLE_TAX_YEARS[index];
        this.update(input);
      }

      toggle() {
        this.setState({
          isOpen: !this.state.isOpen
        });
      }

      render(){
        const PAY_PIE_COLOURS = [ TAX_COLOUR, NI_COLOUR, PENSION_COLOUR,
                                  SL_COLOUR, NET_COLOUR ];

        const input = {...this.state.input};
        return (
            <div>

              <Navbar color="light" light expand="md" className="">
                <NavbarBrand href="/"><b>Accounting Tom</b></NavbarBrand>
                <NavbarBrand href="/"><FaHome/></NavbarBrand>
                <NavbarBrand href="/income"><FaPieChart/></NavbarBrand>
                <NavbarBrand><Timer salary={this.state.netSalary}/></NavbarBrand>
                <NavbarBrand>Net per month: £ {(this.state.netSalary/12.0).toFixed(2)}</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="ml-auto" navbar>
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Tax Year - {this.state.input.taxYear['short']}
                      </DropdownToggle>
                      <DropdownMenu right onClick={this.handleTaxYearSelected}>
                        {
                          AVAILABLE_TAX_YEARS.map((x, i) =>
                              <DropdownItem key={i}>
                                {x['long']}
                              </DropdownItem>
                          )
                        }
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Nav>
                </Collapse>
              </Navbar>

              <div>
                <h1 className="title">Income Tax Calculator</h1>
                <p className="centerit">
                Just enter your salary, or desired salary, and see how much tax
                and national insurance you pay per year, month, week or day!
                Supports financial years 2018/2019 and 2017/2018.
                Remember, it's not the gross that matters it's the net.
                </p>
                <div className="vertspace"/>
              </div>

              <Row>
                <Col xs="12" sm="12" md="6" lg="6" xl="6">
                  <div className="gridblock">
                    <h3 className="sectiontitle">Income</h3>
                    <InputMenu classname=""
                      input={input}
                      handleGross={this.handleGross}
                      handleNonPensionableGross={this.handleNonPensionableGross}
                      handlePensionRate={this.handlePensionRate}
                      handleChildCareVoucher={this.handleChildCareVoucher}
                      handleStudentLoanType1={this.handleStudentLoanType1}
                    />
                  </div>
                  <br />
              </Col>

              <Col xs="12" sm="12" md="6" lg="6" xl="6">
                <div className="gridblock">
                  <h3 className="sectiontitle">Breakdown</h3>
                  <OutputMenu classname=""
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
                </div>
              </Col>
            </Row>

            <br />
            <br />
            <br />

            <Row>

              <Col xs="12" sm="12" md="6" lg="6" xl="6">
                <div className="gridblock">
                  <h3 className="sectiontitle">Percentages</h3>
                  <MoneyPie data={this.state.piedata} colours={PAY_PIE_COLOURS} size={500}/>
                </div>
              </Col>

              <Col xs="12" sm="12" md="6" lg="6" xl="6">
                <div className="gridblock">
                  <h3 className="sectiontitle">Relative</h3>
                  <h5 className="subsectiontitle">Earnings percentile compared to 2015/2016 data</h5>
                  <MoneyChart size={500} salary={this.state.netSalary}/>
                </div>
              </Col>
            </Row>

            <div>
              <div className="vertspace"/>
              <p className="centerit">
              Rates and thresholds accurate as of &nbsp;
              <NavLink href="https://www.gov.uk">https://www.gov.uk</NavLink>
              </p>
              <div className="vertspace"/>
            </div>
          </div>
        );
      }
}

export default IncomeForm;
