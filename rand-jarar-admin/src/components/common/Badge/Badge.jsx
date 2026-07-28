import React from 'react';
import './Badge.scss';

const Badge = ({ count, pulse = false }) => {
  if (!count || count === 0) return null;
  
  return (
    <span className={`badge ${pulse ? 'pulse' : ''}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default Badge;