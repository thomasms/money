import React from 'react';


function LabelWithInput(props) {
  return (
    <div className="block">
      <label className="label-righty">{props.name} </label>
      <input type="number" name={props.name} onChange={props.handler}/>
      <label> {props.unit}</label>
    </div>
  );
}

function LabelWithCheck(props){
  return (
    <div className="block">
      <label className="label-righty">{props.name} </label>
      <input type="checkbox" name={props.name} onChange={props.handler}/>
    </div>
  );
}

function ReadOnlyLabel(props) {
  return (
    <div className="block">
      <font color={props.color}><label className={props.classname}>{props.name} </label></font>
      <input type="number" name={props.name} value={props.value.toFixed(2)} readOnly/>
      <label> {props.unit}</label>
    </div>
  );
}

export {LabelWithInput};
export {LabelWithCheck};
export {ReadOnlyLabel};
