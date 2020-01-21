import React, { Component } from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";

const COLORS = [
  "#0088FE",
  "#228B22",
  "#FF7F00",
  "#F91C57",
  "#4B0082",
  "#8B1C00"
];
const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy - 15} dy={11} textAnchor="middle" fill="#333">
        Rs.{value}
      </text>
      <text x={cx} y={cy} dy={10} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>

      <text x={cx} y={cy + 15} dy={10} textAnchor="middle" fill="#999">
        {`( ${(percent * 100).toFixed(2)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

class PieChartz extends Component {
  state = {
    activeIndex: 0
  };

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index
    });
  };
  render() {
    const data = [
      { name: "Food", value: this.props.Food },
      { name: "Travel", value: this.props.Travel },
      { name: "Accomodaion", value: this.props.Accomodation },
      { name: "Shopping", value: this.props.Shopping },
      { name: "Health", value: this.props.Health },
      { name: "Entertainment", value: this.props.Entertainment }
    ];

    return (
      <React.Fragment>
        <PieChart width={200} height={200}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx={100}
            cy={100}
            innerRadius={60}
            outerRadius={85}
            fill="#00C49F"
            dataKey="value"
            onMouseEnter={this.onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </React.Fragment>
    );
  }
}
export default PieChartz;
