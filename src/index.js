import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import IncomeForm from './js/incomeform.js';

class Main extends React.Component {
  render() {
    return (
      <div>
          <IncomeForm />
          <p className="footer" align="center">Thomas Stainer &copy; 2018</p>
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
