import React, { useState, useEffect } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import './Charts.scss';

const DonutChart = ({ data = [], height = 300 }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      // بيانات افتراضية
      setChartData([
        { name: 'تنشيف', value: 65, color: '#e91e63' },
        { name: 'نحت', value: 45, color: '#9c27b0' },
        { name: 'زيادة عضل', value: 30, color: '#2196f3' },
        { name: 'لياقة عامة', value: 25, color: '#4caf50' },
        { name: 'تغذية', value: 15, color: '#ff9800' },
      ]);
    }
  }, [data]);

  const COLORS = chartData.map(item => item.color);

  return (
    <div className="chart-wrapper" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            formatter={(value) => [`${value} متدربة`, 'العدد']}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;