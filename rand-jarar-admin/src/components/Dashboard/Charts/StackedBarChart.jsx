import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import './Charts.scss';
import { t } from '../../../i18n';

const StackedBarChart = ({ data = [], height = 300 }) => {
  const [chartData, setChartData] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      setChartData([
        { month: t('يناير'), workout: 75, nutrition: 82 },
        { month: t('فبراير'), workout: 78, nutrition: 85 },
        { month: t('مارس'), workout: 72, nutrition: 80 },
        { month: t('أبريل'), workout: 80, nutrition: 88 },
        { month: t('مايو'), workout: 85, nutrition: 90 },
        { month: t('يونيو'), workout: 82, nutrition: 87 },
      ]);
    }
  }, [data]);

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
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="month" 
            stroke="var(--text-secondary)"
            tick={{ fill: 'var(--text-secondary)' }}
          />
          <YAxis 
            stroke="var(--text-secondary)"
            tick={{ fill: 'var(--text-secondary)' }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            formatter={(value, name) => {
              const label = name === 'workout' ? t('التمارين') : t('التغذية');
              return [`${value}%`, label];
            }}
            labelFormatter={(label) => t('الشهر: {0}', label)}
          />
          <Legend 
            formatter={(value) => value === 'workout' ? t('التمارين') : t('التغذية')}
          />
          <Bar 
            dataKey="workout" 
            stackId="a" 
            fill="#2196f3"
            radius={[4, 4, 0, 0]}
            name={t('التمارين')}
          />
          <Bar 
            dataKey="nutrition" 
            stackId="a" 
            fill="#4caf50"
            radius={[4, 4, 0, 0]}
            name={t('التغذية')}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;