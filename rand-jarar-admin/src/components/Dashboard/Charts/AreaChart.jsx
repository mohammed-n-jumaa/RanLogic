import React, { useState, useEffect, useRef } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { AlertTriangle } from 'lucide-react';
import './Charts.scss';

const AreaChart = ({ data = [], height = 300 }) => {
  const [chartData, setChartData] = useState([]);
  const [hasData, setHasData] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // تحويل البيانات من API الجديد
      const formattedData = data.map(item => ({
        name: item.day || item.date || '--',
        revenue: item.revenue || item.total || 0
      }));
      
      setChartData(formattedData);
      setHasData(true);
    } else {
      setChartData([]);
      setHasData(false);
    }
  }, [data]);

  if (!hasData) {
    return (
      <div 
        ref={containerRef}
        className="chart-wrapper chart-no-data" 
        style={{ 
          height: `${height}px`,
          minHeight: '200px',
          width: '100%',
          minWidth: '0'
        }}
      >
        <div className="no-data-message">
          <AlertTriangle size={24} />
          <p>لا توجد بيانات متاحة</p>
        </div>
      </div>
    );
  }

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
        <RechartsAreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-secondary)"
            tick={{ fill: 'var(--text-secondary)' }}
          />
          <YAxis 
            stroke="var(--text-secondary)"
            tick={{ fill: 'var(--text-secondary)' }}
            tickFormatter={(value) => `${value} د.ع`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            formatter={(value) => [`${value} $`, 'الدخل']}
            labelFormatter={(label) => `التاريخ: ${label}`}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#4caf50" 
            fill="#4caf50"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;