import React from 'react';
import { TAX_COLOUR, NI_COLOUR, PENSION_COLOUR, SL_COLOUR, NET_COLOUR } from './colours.js';
import {
  computeStudentLoanPaidTaxYear,
  computeNIPaidTaxYear,
  computeTaxPaidTaxYear,
  AVAILABLE_TAX_YEARS } from './compute.js';
import { InputMenu } from './input.js'
import { OutputMenu } from './output.js'
import { Timer } from './timer.js'
import { MoneyPie, MoneyChart } from './charts.js'
import {
  Navbar,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import { WidthProvider, Responsive } from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};

class IncomeForm extends React.Component {

      constructor( props ) {
        super( props );

        this.handleTaxYearSelected = this.handleTaxYearSelected.bind(this);

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
          layouts: JSON.parse(JSON.stringify(originalLayouts)),
          input: {
            taxYear: AVAILABLE_TAX_YEARS[0],
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

      static get defaultProps() {
        return {
          className: "layout",
          breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},
          cols: { lg: 6, md: 4, sm: 4, xs: 2, xxs: 2 },
          rowHeight: 400
        };
      }

      resetLayout() {
        this.setState({ layouts: {} });
      }

      onLayoutChange(layout, layouts) {
        saveToLS("layouts", layouts);
        this.setState({ layouts: layouts });
      }

      update(input){
        //NI is paid on pension
        //Tax is not paid on pension
        const totalGross = input.grossBasicSalary +
                      input.grossNonPensionableSalary - input.childcareVoucher;
        const niPaid = computeNIPaidTaxYear(totalGross, input.taxYear);
        const pensionPaid = parseFloat(input.pensionRate*input.grossBasicSalary);
        const taxPaid = computeTaxPaidTaxYear(totalGross - pensionPaid, input.taxYear);
        const slPaid = input.studentLoan ? computeStudentLoanPaidTaxYear(totalGross, input.taxYear) : 0.0;
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

      render(){
        const PAY_PIE_COLOURS = [ TAX_COLOUR, NI_COLOUR, PENSION_COLOUR,
                                  SL_COLOUR, NET_COLOUR ];

        const input = {...this.state.input};
        return (
            <div>

              <Navbar color="dark" dark expand="md" className="">
                  <NavbarBrand href="/">
                      <strong>Income Tax Calculator</strong>
                  </NavbarBrand>
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
              </Navbar>

              <div>
                <h2 className="centerit">How much tax are you paying?</h2>
                <p className="centerit">
                Just enter your salary, or desired salary, and see how much tax
                and national insurance you pay per year, month, week or day! 
                Supports financial years 2018 - 2019 and 2017 - 2018.
                </p>
                <div className="vertspace"/>
              </div>

              <ResponsiveReactGridLayout
                  className="layout"
                  isDraggable={false} isResizable={false}
                  breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                  cols={{ lg: 6, md: 4, sm: 4, xs: 2, xxs: 2 }}
                  rowHeight={400}
                  layouts={this.state.layouts}
                  onLayoutChange={(layout, layouts) =>
                    this.onLayoutChange(layout, layouts)
                  }
                >
                <div className="gridblock" key="22" data-grid={{ w: 2, h: 1, x: 0, y: 0 }}>
                  <h4 className="hozspace">Income</h4>
                  <InputMenu classname=""
                    input={input}
                    handleGross={this.handleGross}
                    handleNonPensionableGross={this.handleNonPensionableGross}
                    handlePensionRate={this.handlePensionRate}
                    handleChildCareVoucher={this.handleChildCareVoucher}
                    handleStudentLoan={this.handleStudentLoan}
                  />
                </div>

                <div className="gridblock" key="23" data-grid={{ w: 2, h: 1, x: 2, y: 0 }}>
                  <h4 className="hozspace">Breakdown</h4>
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

                <div className="gridblock" key="24" data-grid={{ w: 2, h: 1, x: 4, y: 0 }}>
                  <MoneyPie data={this.state.piedata} colours={PAY_PIE_COLOURS} size={450}/>
                </div>

                <div className="gridblock" key="25" data-grid={{ w: 1, h: 1, x: 0, y: 1 }}>
                  <Timer salary={this.state.netSalary}/>
                </div>

                <div className="gridblock" key="32" data-grid={{ w: 4, h: 1, x: 2, y: 1, minW: 4 }}>
                  <h5 className="">Earnings percentile compared to 2015/2016 data</h5>
                  <MoneyChart size={700} salary={this.state.netSalary}/>
                </div>

              </ResponsiveReactGridLayout>
            </div>
        );
      }
}

export default IncomeForm;

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value
      })
    );
  }
}
