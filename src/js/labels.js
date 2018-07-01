import React from 'react';

function DropDownDateInput(props) {
  return (
    <span className={props.classname}>
    <select onChange={props.handler} defaultValue={props.selected}>
      {
        props.data.map((x, i) =>
            <option
              key={i}
              value={x}>
              {x}
            </option>
        )
      }
    </select>
  </span>
  );
}

function LabelWithInput(props) {
  return (
    <div className="block">
      <label className="label-lefty">{props.name} </label>
      <input type="number" name={props.name} onChange={props.handler} value={props.value}/>
      <label> {props.unit}</label>
    </div>
  );
}

function LabelWithCheck(props){
  return (
    <div className="block">
      <label className="label-lefty">{props.name} </label>
      <input type="checkbox" name={props.name} onChange={props.handler} value={props.value}/>
    </div>
  );
}

function ReadOnlyLabel(props) {
  return (
    <div className="block">
      <font color={props.color}><label className={props.classname}>{props.name} </label></font>
      <input type="number" name={props.name} value={props.value.toFixed(2)} readOnly/>
      <DropDownDateInput classname="hozspace" handler={props.handler} data={props.periods} selected={props.selected}/>
    </div>
  );
}

function OutputLabel(props){
  const prepend = '£ per ';
  const selected = prepend + props.timeperiod;
  const periods = [prepend +'year', prepend +'month', prepend +'week', prepend +'day'];
  return (
    <ReadOnlyLabel
      classname="label-righty"
      color={props.color}
      name={props.name}
      value={props.value}
      handler={props.handler}
      selected={selected}
      periods = {periods}
    />
  );
}


export {LabelWithInput};
export {LabelWithCheck};
export {DropDownDateInput};
export {OutputLabel};
