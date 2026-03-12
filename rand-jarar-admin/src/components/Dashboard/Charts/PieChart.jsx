import React, { useState, useEffect, useRef } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import './Charts.scss';

const PieChart = ({ data = [], height = 300 }) => {
  const [chartData, setChartData] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      setChartData([
        { name: 'مدفوع', value: 156, color: '#4caf50' },
        { name: 'قيد الانتظار', value: 24, color: '#ff9800' },
        { name: 'منتهي', value: 12, color: '#f44336' },
        { name: 'ملغي', value: 8, color: '#9e9e9e' },
      ]);
    }
  }, [data]);

  const COLORS = chartData.map(item => item.color || '#e91e63');

  return (
    <div 
      ref={containerRef}
      className="chart-wrapper" 
      style={{ 
        height: `${height}px`,
        minHeight: '200px',
        width: '100%',
        minWidth: '0'
      }}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
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
            formatter={(value) => [`${value} عملية`, 'العدد']}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;