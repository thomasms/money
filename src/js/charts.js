import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#FF0000', '#FF3411', '#FF5000', '#FF6347', '#0088FE'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
 	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
    	{`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function MoneyPie(props) {

  	return (
    	<PieChart width={600} height={600}>
        <Pie
          data={props.data}
          cx={300}
          cy={300}
          innerRadius={100}
          outerRadius={200}
          fill="#8884d8"
          label={renderCustomizedLabel}
          paddingAngle={0}
        >
        	{
          	props.data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
        </Pie>
      </PieChart>
    );
}

export {MoneyPie};
