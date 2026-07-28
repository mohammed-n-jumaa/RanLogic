import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './MetricCard.scss';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  format, 
  unit, 
  currency, 
  progress, 
  showLineChart 
}) => {
  const hasValue = value !== undefined && value !== null;
  const hasChange = change !== undefined && change !== null;
  
  const isPositive = hasChange ? change > 0 : false;
  const isNegative = hasChange ? change < 0 : false;
  const isNeutral = hasChange ? change === 0 : true;
  
  const formattedChange = hasChange ? `${isPositive ? '+' : ''}${change}%` : '--';
  
  const formatValue = () => {
    if (!hasValue) return '--';
    
    switch(format) {
      case 'currency':
        return `${value.toLocaleString()} ${currency || ''}`;
      case 'percentage':
        return `${value}%`;
      case 'duration':
        return `${value} ${unit || ''}`;
      default:
        return value.toLocaleString();
    }
  };

  const getColorClass = () => {
    switch(color) {
      case 'primary': return 'metric-card--primary';
      case 'blue': return 'metric-card--blue';
      case 'green': return 'metric-card--green';
      case 'orange': return 'metric-card--orange';
      case 'purple': return 'metric-card--purple';
      default: return 'metric-card--primary';
    }
  };

  return (
    <motion.div 
      className={`metric-card ${getColorClass()} ${!hasValue ? 'metric-card--no-data' : ''}`}
      whileHover={{ y: hasValue ? -5 : 0 }}
    >
      <div className="metric-card__icon">
        <Icon size={24} />
      </div>
      
      <div className="metric-card__content">
        <span className="metric-card__label">{title}</span>
        <div className="metric-card__value">{formatValue()}</div>
        
        <div className="metric-card__change">
          {hasChange ? (
            <>
              {isPositive ? (
                <TrendingUp size={16} />
              ) : isNegative ? (
                <TrendingDown size={16} />
              ) : (
                <Minus size={16} />
              )}
              <span className={`change-text ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
                {formattedChange}
              </span>
            </>
          ) : (
            <>
              <Minus size={16} />
              <span className="change-text neutral">--</span>
            </>
          )}
          <span className="change-label">عن الفترة السابقة</span>
        </div>
      </div>
      
      {format === 'percentage' && hasValue && progress && (
        <div className="metric-card__progress">
          <div 
            className="metric-card__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {showLineChart && hasValue && (
        <div className="metric-card__chart">
          <svg width="100" height="30" viewBox="0 0 100 30">
            <path
              d="M0,20 L25,15 L50,10 L75,5 L100,0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
      
      {!hasValue && (
        <div className="metric-card__no-data">
          <span>لا توجد بيانات</span>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;