import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8b0000', '#FF3411', '#FF5000', '#FF6347', '#0088FE'];

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
          	props.data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
      </PieChart>
    );
}

export {MoneyPie};
