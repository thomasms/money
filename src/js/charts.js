import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

function MoneyPie(props) {

  	return (
    	<PieChart width={props.size} height={props.size}>
        <Pie
          data={props.data}
          cx={props.size/2.0}
          cy={props.size/2.0}
          innerRadius={props.size/5.0}
          outerRadius={props.size/3.0}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
        >
        	{
          	props.data.map((entry, index) => <Cell key={index} fill={props.colours[index % props.colours.length]}/>)
          }
        </Pie>
      </PieChart>
    );
}

export {MoneyPie};
