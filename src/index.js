import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import IncomeForm from './js/incomeform.js';

class Main extends React.Component {
  render() {
    return (
      <div>
          <IncomeForm />
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
