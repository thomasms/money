import React from 'react';

function DropDownDateInput(props) {
  return (
    <div className="inline">
      <select onChange={props.handler}>
        {
          props.data.map((x, i) => <option
                                     key={i}
                                     value={x}>
                                     £ per {x}
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
      <DropDownDateInput handler={props.handler} data={props.periods}/>
    </div>
  );
}

export {LabelWithInput};
export {LabelWithCheck};
export {ReadOnlyLabel};
