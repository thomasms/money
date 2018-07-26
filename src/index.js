import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Route, BrowserRouter } from 'react-router-dom';
import Home from './js/home.js'
import IncomeForm from './js/incomeform.js';

class Main extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route exact path='/' component={Home} />
            <Route path='/home' component={Home} />
            <Route path='/income' component={IncomeForm} />
          </div>
        </BrowserRouter>

        <div>
          <p className="footer2" align="center">Thomas Stainer &copy; 2018</p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
