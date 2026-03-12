import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { AlertTriangle } from 'lucide-react';
import './Charts.scss';

const LineChart = ({ data = [], height = 250 }) => {
  const [chartData, setChartData] = useState([]);
  const [hasData, setHasData] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // تحويل البيانات من API الجديد
      const formattedData = data.map(item => ({
        name: item.date || item.month || '--',
        subscriptions: item.subscriptions || item.count || 0
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
          minHeight: '180px', 
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
        minHeight: '180px', 
        width: '100%',
        minWidth: '0'
      }}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <RechartsLineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-secondary)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          />
          <YAxis 
            stroke="var(--text-secondary)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value}`, 'الاشتراكات']}
            labelFormatter={(label) => `التاريخ: ${label}`}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px' }}
            formatter={() => 'الاشتراكات'}
          />
          <Line 
            type="monotone" 
            dataKey="subscriptions" 
            stroke="#e91e63" 
            strokeWidth={2}
            dot={{ stroke: '#e91e63', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="الاشتراكات"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;