import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Jumbotron,
  Button,
  Row,
  Col  } from 'reactstrap';
import ReactPlayer from 'react-player'
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
                  <h2 className="display-3">Accounting Tom</h2>
                  <Row>
                    <Col>
                      <p className="lead">For all your income tax and budget planning needs.</p>
                      <hr className="my-2" />
                      <p>Try the income tax calculator.</p>
                      <p className="lead">
                        <Button color="primary" tag={Link} to="/income">Income Tax Calculator</Button>
                      </p>
                    </Col>
                  </Row>
                </Jumbotron>
              </div>

              <div>
              </div>

              <div>
                <ReactPlayer url='https://youtu.be/itOwbl6w4Wk'
                  playing
                  width='100%'
                  height='500px'/>
              </div>
            </div>
        );
      }
}

export default Home;
