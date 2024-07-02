import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export const LineChartComponent = (props) => {
  return (
    <ResponsiveContainer width='90%' aspect={2/1}>
      <LineChart data={props.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="notification_date" style={{fontSize: '0.8rem'}}/>
        <YAxis/>
        <Tooltip />
        <Legend />
        <Line
          name="Case count"
          type="monotone"
          dataKey="confirmed_cases_count"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}