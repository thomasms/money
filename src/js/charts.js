import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Brush, ReferenceLine } from 'recharts';

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = outerRadius + 25.0;
  const x = cx + (radius * Math.cos(-midAngle * RADIAN));
  const y = cy + (radius * Math.sin(-midAngle * RADIAN));

  if(percent <= 0.0){
    return(<div />);
  }

  return (
    <g>
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
      	{name}
      </text>
      <text x={x} y={y+20} fill="black" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

function MoneyPie(props) {

  	return (
      	<PieChart width={props.size} height={props.size}
              margin={{top: 5, right: 15, left: 60, bottom: 40}}>
          <Pie
            data={props.data}
            cx={(props.size/2.0) - 20}
            cy={(props.size/2.0) - 50}
            innerRadius={50.0}
            outerRadius={140.0}
            fill="#8884d8"
            paddingAngle={0.2}
            dataKey="value"
            label={renderCustomizedLabel}
          >
          	{
            	props.data.map((entry, index) => <Cell key={index} fill={props.colours[index % props.colours.length]}/>)
            }
          </Pie>
        </PieChart>
    );
}

function MoneyChart(props){
  // 2015/2016 data
  const data = [
      {name: '1%', bt : 10800.0, at: 10800.0},
      {name: '2%', bt : 11100.0, at: 11000.0},
      {name: '3%', bt : 11300.0, at: 11200.0},
      {name: '4%', bt : 11500.0, at: 11300.0},
      {name: '5%', bt : 11700.0, at: 11500.0},
      {name: '6%', bt : 11900.0, at: 11700.0},
      {name: '7%', bt : 12100.0, at: 11900.0},
      {name: '8%', bt : 12300.0, at: 12000.0},
      {name: '9%', bt : 12500.0, at: 12200.0},
      {name: '10%', bt : 12800.0, at: 12400.0},
      {name: '11%', bt : 13000.0, at: 12600.0},
      {name: '12%', bt : 13200.0, at: 12700.0},
      {name: '13%', bt : 13400.0, at: 12900.0},
      {name: '14%', bt : 13600.0, at: 13100.0},
      {name: '15%', bt : 13800.0, at: 13300.0},
      {name: '16%', bt : 14100.0, at: 13400.0},
      {name: '17%', bt : 14300.0, at: 13600.0},
      {name: '18%', bt : 14500.0, at: 13800.0},
      {name: '19%', bt : 14700.0, at: 14000.0},
      {name: '20%', bt : 15000.0, at: 14100.0},
      {name: '21%', bt : 15200.0, at: 14300.0},
      {name: '22%', bt : 15400.0, at: 14500.0},
      {name: '23%', bt : 15600.0, at: 14700.0},
      {name: '24%', bt : 15900.0, at: 14900.0},
      {name: '25%', bt : 16100.0, at: 15100.0},
      {name: '26%', bt : 16300.0, at: 15300.0},
      {name: '27%', bt : 16600.0, at: 15500.0},
      {name: '28%', bt : 16800.0, at: 15700.0},
      {name: '29%', bt : 17100.0, at: 15800.0},
      {name: '30%', bt : 17300.0, at: 16000.0},
      {name: '31%', bt : 17600.0, at: 16300.0},
      {name: '32%', bt : 17800.0, at: 16500.0},
      {name: '33%', bt : 18100.0, at: 16700.0},
      {name: '34%', bt : 18300.0, at: 16900.0},
      {name: '35%', bt : 18600.0, at: 17100.0},
      {name: '36%', bt : 18900.0, at: 17300.0},
      {name: '37%', bt : 19100.0, at: 17500.0},
      {name: '38%', bt : 19400.0, at: 17800.0},
      {name: '39%', bt : 19700.0, at: 18000.0},
      {name: '40%', bt : 20000.0, at: 18200.0},
      {name: '41%', bt : 20300.0, at: 18400.0},
      {name: '42%', bt : 20600.0, at: 18700.0},
      {name: '43%', bt : 20900.0, at: 18900.0},
      {name: '44%', bt : 21200.0, at: 19200.0},
      {name: '45%', bt : 21500.0, at: 19500.0},
      {name: '46%', bt : 21800.0, at: 19700.0},
      {name: '47%', bt : 22200.0, at: 20000.0},
      {name: '48%', bt : 22500.0, at: 20200.0},
      {name: '49%', bt : 22800.0, at: 20500.0},
      {name: '50%', bt : 23200.0, at: 20800.0},
      {name: '51%', bt : 23500.0, at: 21100.0},
      {name: '52%', bt : 23900.0, at: 21400.0},
      {name: '53%', bt : 24300.0, at: 21700.0},
      {name: '54%', bt : 24600.0, at: 22000.0},
      {name: '55%', bt : 25000.0, at: 22300.0},
      {name: '56%', bt : 25400.0, at: 22600.0},
      {name: '57%', bt : 25800.0, at: 22900.0},
      {name: '58%', bt : 26200.0, at: 23300.0},
      {name: '59%', bt : 26700.0, at: 23600.0},
      {name: '60%', bt : 27100.0, at: 24000.0},
      {name: '61%', bt : 27500.0, at: 24300.0},
      {name: '62%', bt : 28000.0, at: 24700.0},
      {name: '63%', bt : 28500.0, at: 25100.0},
      {name: '64%', bt : 29000.0, at: 25500.0},
      {name: '65%', bt : 29500.0, at: 25900.0},
      {name: '66%', bt : 30000.0, at: 26300.0},
      {name: '67%', bt : 30500.0, at: 26800.0},
      {name: '68%', bt : 31100.0, at: 27200.0},
      {name: '69%', bt : 31700.0, at: 27700.0},
      {name: '70%', bt : 32300.0, at: 28200.0},
      {name: '71%', bt : 32900.0, at: 28700.0},
      {name: '72%', bt : 33500.0, at: 29200.0},
      {name: '73%', bt : 34200.0, at: 29800.0},
      {name: '74%', bt : 34900.0, at: 30300.0},
      {name: '75%', bt : 35600.0, at: 30900.0},
      {name: '76%', bt : 36300.0, at: 31500.0},
      {name: '77%', bt : 37100.0, at: 32100.0},
      {name: '78%', bt : 37900.0, at: 32800.0},
      {name: '79%', bt : 38800.0, at: 33600.0},
      {name: '80%', bt : 39700.0, at: 34300.0},
      {name: '81%', bt : 40600.0, at: 35100.0},
      {name: '82%', bt : 41500.0, at: 35900.0},
      {name: '83%', bt : 42300.0, at: 36700.0},
      {name: '84%', bt : 43200.0, at: 37500.0},
      {name: '85%', bt : 44400.0, at: 38400.0},
      {name: '86%', bt : 45800.0, at: 39100.0},
      {name: '87%', bt : 47300.0, at: 39900.0},
      {name: '88%', bt : 49000.0, at: 41000.0},
      {name: '89%', bt : 50900.0, at: 42200.0},
      {name: '90%', bt : 53100.0, at: 43600.0},
      {name: '91%', bt : 55800.0, at: 45300.0},
      {name: '92%', bt : 59000.0, at: 47300.0},
      {name: '93%', bt : 63200.0, at: 49900.0},
      {name: '94%', bt : 68400.0, at: 53200.0},
      {name: '95%', bt : 75000.0, at: 57400.0},
      {name: '96%', bt : 84100.0, at: 63100.0},
      {name: '97%', bt : 97100.0, at: 71500.0},
      {name: '98%', bt : 117000.0, at: 81900.0},
      {name: '99%', bt : 170000.0, at: 114000.0},
  ];

  // find the percentile for your inpu net salary
  var index = 0;
  if(props.salary <= data[data.length-1].at){
     index = data.findIndex((element) => {
      return element.at >= props.salary;
    });
  }
  else{
    index = data.length-1;
  }

  // 10 points either side
  const range = 15;
  const startIndex = Math.min(Math.max(0, index - range), data.length-1);
  const endIndex = Math.max(Math.min(data.length-1, index + range), 0);

  return (
      	<LineChart width={props.size} height={props.size/1.7} data={data}
              margin={{top: 5, right: 10, left: 30, bottom: 60}}>
           <XAxis dataKey="name" label={{ value: "percentile",  position: 'insideBottom', offset: -40 }}/>
           <YAxis label={{ value: "£/year" , angle: -90, position: 'insideLeft', offset: -10 }}/>
           <Tooltip cursor={{ stroke: 'red', strokeWidth: 2 }} />
           <Legend verticalAlign="top" height={36}/>
           <Line type="monotone" name="before tax" dataKey="bt" stroke="black" activeDot={{r: 8}} />
           <Line type="monotone" name="after tax" dataKey="at" stroke="red" />
           <ReferenceLine x={data[index].name} label={{ value: "Take Home" , angle: -90}} stroke="red" strokeDasharray="3 3" />
           <Brush data={data} startIndex={startIndex} endIndex={endIndex} height={20}/>
        </LineChart>
  );
}

export { MoneyPie };
export { MoneyChart };
