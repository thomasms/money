import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Jumbotron,
  Button,
  Row,
  Col  } from 'reactstrap';
import { Link } from 'react-router-dom';
import FaPieChart from 'react-icons/lib/fa/pie-chart';
import FaHome from 'react-icons/lib/fa/home';

class Home extends React.Component {

      render(){
        return (
            <div>
              <Navbar color="light" light expand="md" className="">
                  <NavbarBrand href="/">Accounting Tom</NavbarBrand>
                  <NavbarBrand href="/"><FaHome/></NavbarBrand>
                  <NavbarBrand href="/income"><FaPieChart/></NavbarBrand>
              </Navbar>

              <div>
                <Jumbotron>
                  <h3 className="display-4">Accounting Tom</h3>
                  <Row>
                    <Col>
                      <p className="subtitle1">For all your income tax and budget planning needs.</p>
                      <hr/>
                      <p className="subtitle2">Try the income tax calculator.</p>
                      <p className="subtitle2">
                        <Button color="primary" tag={Link} to="/income">Income Tax Calculator</Button>
                      </p>
                    </Col>
                  </Row>
                </Jumbotron>
              </div>
            </div>
        );
      }
}

export default Home;
