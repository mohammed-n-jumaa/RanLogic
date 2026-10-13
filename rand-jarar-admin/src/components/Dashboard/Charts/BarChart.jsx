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

const BarChart = ({ data = [], height = 300 }) => {
  const [chartData, setChartData] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      setChartData([
        { program: t('تنشيف'), completion: 82 },
        { program: t('نحت'), completion: 75 },
        { program: t('زيادة عضل'), completion: 68 },
        { program: t('لياقة عامة'), completion: 88 },
        { program: t('تغذية'), completion: 92 },
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
            dataKey="program" 
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
            formatter={(value) => [`${value}%`, t('نسبة الإنجاز')]}
            labelFormatter={(label) => t('البرنامج: {0}', label)}
          />
          <Legend />
          <Bar 
            dataKey="completion" 
            fill="#e91e63"
            radius={[4, 4, 0, 0]}
            name={t('نسبة الإنجاز')}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;