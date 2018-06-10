import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

function MoneyPie(props) {

  	return (
    	<PieChart width={550} height={550}>
        <Pie
          data={props.data}
          cx={250}
          cy={250}
          innerRadius={100}
          outerRadius={180}
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
