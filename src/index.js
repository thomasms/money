import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import IncomeForm from './js/incomeform.js';


class Main extends React.Component {
  render() {
    return (
      <div>
          <IncomeForm />
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
