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
        <div class="waveWrapper waveAnimation">
  <div class="waveWrapperInner bgTop">
    <div class="wave waveTop" style={{backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-top.png')"}}></div>
  </div>
  <div class="waveWrapperInner bgMiddle">
    <div class="wave waveMiddle" style={{backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-mid.png')"}}></div>
  </div>
  <div class="waveWrapperInner bgBottom">
    <div class="wave waveBottom" style={{backgroundImage: "url('http://front-end-noobs.com/jecko/img/wave-bot.png')"}}></div>
  </div>
</div>
        <BrowserRouter>
          <div>
            <Route exact path='/' component={Home} />
            <Route path='/home' component={Home} />
            <Route path='/income' component={IncomeForm} />
          </div>
        </BrowserRouter>

        <div className="footer3">
          <p align="center">Thomas Stainer &copy; 2018</p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
