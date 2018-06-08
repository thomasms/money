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

function ReadOnlyRedLabel(props) {
  return (
    <div className="block">
      <label className="label-righty-red">{props.name} </label>
      <input type="number" name={props.name} value={props.value.toFixed(2)} readOnly/>
      <label> {props.unit}</label>
    </div>
  );
}

function ReadOnlyBlueLabel(props) {
  return (
    <div className="block">
      <label className="label-righty-blue">{props.name} </label>
      <input type="number" name={props.name} value={props.value.toFixed(2)} readOnly/>
      <label> {props.unit}</label>
    </div>
  );
}

export {LabelWithInput};
export {LabelWithCheck};
export {ReadOnlyRedLabel};
export {ReadOnlyBlueLabel};
