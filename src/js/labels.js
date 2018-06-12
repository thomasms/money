import React from 'react';

function DropDownDateInput(props) {
  return (
    <div className={props.classname}>
      <select onChange={props.handler}>
        {
          props.data.map((x, i) => <option
                                     key={i}
                                     value={x}>
                                     {x}
                                   </option>)
        }
      </select>
    </div>
  );
}

function LabelWithInput(props) {
  return (
    <div className="block">
      <label className="label-lefty">{props.name} </label>
      <input type="number" name={props.name} onChange={props.handler}/>
      <label> {props.unit}</label>
    </div>
  );
}

function LabelWithCheck(props){
  return (
    <div className="block">
      <label className="label-lefty">{props.name} </label>
      <input type="checkbox" name={props.name} onChange={props.handler}/>
    </div>
  );
}

function ReadOnlyLabel(props) {
  return (
    <div className="block">
      <font color={props.color}><label className={props.classname}>{props.name} </label></font>
      <input type="number" name={props.name} value={props.value.toFixed(2)} readOnly/>
      <DropDownDateInput classname="inline" handler={props.handler} data={props.periods}/>
    </div>
  );
}

function OutputLabel(props){
  return (
    <ReadOnlyLabel
      classname="label-righty"
      color={props.color}
      name={props.name}
      value={props.value}
      handler={props.handler}
      timeperiod={props.timeperiod}
      unit="(£ per year)"
      periods = {['£ per year', '£ per month', '£ per week', '£ per day']}
    />
  );
}


export {LabelWithInput};
export {LabelWithCheck};
export {DropDownDateInput};
export {OutputLabel};
