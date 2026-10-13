import React, { useState, useEffect } from 'react';
import './Charts.scss';
import { t } from '../../../i18n';

const SimpleHeatmapChart = ({ height = 250 }) => {
  const [isMobile, setIsMobile] = useState(false);
  const days = [t('السبت'), t('الأحد'), t('الإثنين'), t('الثلاثاء'), t('الأربعاء'), t('الخميس'), t('الجمعة')];
  const hours = [t('6ص'), t('8ص'), t('10ص'), t('12م'), t('2م'), t('4م'), t('6م'), t('8م'), t('10م')];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // توليد بيانات مبسطة للجوال
  const generateData = () => {
    const data = [];
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < hours.length; j++) {
        let value;
        if (j >= 5 && j <= 7) { // المساء
          value = Math.floor(Math.random() * 40) + 40;
        } else if (j >= 1 && j <= 3) { // الصباح
          value = Math.floor(Math.random() * 30) + 20;
        } else {
          value = Math.floor(Math.random() * 20);
        }
        data.push({
          dayIndex: i,
          hourIndex: j,
          value,
          day: days[i],
          hour: hours[j]
        });
      }
    }
    return data;
  };

  const data = generateData();

  const getColor = (value) => {
    if (value < 20) return '#f0f0f0';
    if (value < 40) return '#90caf9';
    if (value < 60) return '#42a5f5';
    if (value < 80) return '#1976d2';
    return '#0d47a1';
  };

  return (
    <div className="simple-heatmap" style={{ height: `${height}px` }}>
      <div className="heatmap-container">
        <div className="heatmap-header">
          <div className="heatmap-title">{t('حرارة الالتزام خلال الأسبوع')}</div>
          <div className="heatmap-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#f0f0f0' }} />
              <span>{t('منخفض')}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#90caf9' }} />
              <span>{t('متوسط')}</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#42a5f5' }} />
              <span>{t('جيد')}</span>
            </div>
          </div>
        </div>
        
        <div className="heatmap-grid">
          <div className="days-axis">
            <div className="day-label">{t('اليوم/الوقت')}</div>
            {days.map(day => (
              <div key={day} className="day-label">{isMobile ? day.substring(0, 3) : day}</div>
            ))}
          </div>
          
          <div className="heatmap-main">
            {hours.map(hour => (
              <div key={hour} className="hours-axis">
                <div className="hour-label">{hour}</div>
                {days.map((day, dayIndex) => {
                  const cell = data.find(d => d.day === day && d.hour === hour);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="heatmap-cell"
                      style={{
                        backgroundColor: cell ? getColor(cell.value) : '#f0f0f0'
                      }}
                      title={cell ? `${day} ${hour}: ${cell.value}%` : ''}
                    >
                      <span className="cell-value">{cell?.value}%</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHeatmapChart;