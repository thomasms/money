import React from 'react';


class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0
    };
  }

  tick() {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const YEAR_TO_SEC = 365.25*24.0*60.0*60.0;
    const value = this.state.seconds*this.props.salary/YEAR_TO_SEC;
    return (
      <div className="vertspace">
        <div className="centerit">
          Money earned since browsing site
        </div>
        <div className="vertspace"/>
        <div className="large">
          £ {value.toFixed(2)}
        </div>
      </div>
    );
  }
}

export { Timer };
