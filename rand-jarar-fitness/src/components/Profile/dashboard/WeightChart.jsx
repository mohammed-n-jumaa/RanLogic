import { useState } from 'react';
import { FaChartLine } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const WeightChart = ({ data }) => {
  const { t } = useProfileLanguage();
  const [tooltip, setTooltip] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="dash-card">
        <div className="dash-card-title">
          <FaChartLine />
          <span>{t('تتبع الوزن', 'Weight tracking')}</span>
        </div>
        <p className="dash-empty">{t('لا توجد بيانات بعد — حدّث وزنك من البروفايل', 'No data yet — update your weight in profile')}</p>
      </div>
    );
  }

  const weights = data.map(d => parseFloat(d.weight));
  const maxW = Math.max(...weights);
  const minW = Math.min(...weights);
  const range = maxW - minW || 1;
  const first = weights[0];
  const last = weights[weights.length - 1];
  const change = (last - first).toFixed(1);

  // SVG dimensions
  const svgW = 600;
  const svgH = 140;
  const padX = 30;
  const padY = 20;
  const chartW = svgW - padX * 2;
  const chartH = svgH - padY * 2;

  const points = weights.map((w, i) => ({
    x: padX + (i / (weights.length - 1 || 1)) * chartW,
    y: padY + (1 - (w - minW) / range) * chartH,
    weight: w,
    date: data[i].logged_at,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const areaPath = linePath
    + ` L ${points[points.length - 1].x} ${svgH - padY}`
    + ` L ${points[0].x} ${svgH - padY} Z`;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dash-card">
      <div className="dash-card-title">
        <FaChartLine />
        <span>{t('تتبع الوزن', 'Weight tracking')}</span>
      </div>

      <div className="weight-chart-svg">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
            <line
              key={i}
              x1={padX} x2={svgW - padX}
              y1={padY + r * chartH} y2={padY + r * chartH}
              stroke="#eee" strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#weightGrad)" opacity="0.3" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#FDB813" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {points.map((p, i) => (
            <g key={i}
              onMouseEnter={() => setTooltip(i)}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
              <circle
                cx={p.x} cy={p.y}
                r={tooltip === i ? 5 : 3.5}
                fill="#fff"
                stroke="#FDB813"
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Gradient def */}
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDB813" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FDB813" stopOpacity="0.02" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tooltip */}
        {tooltip !== null && (
          <div
            className="weight-tooltip"
            style={{
              left: `${(points[tooltip].x / svgW) * 100}%`,
              top: `${(points[tooltip].y / svgH) * 100 - 15}%`,
            }}
          >
            <strong>{points[tooltip].weight} {t('كغ', 'kg')}</strong>
            <span>{formatDate(points[tooltip].date)}</span>
          </div>
        )}
      </div>

      {/* X-axis labels */}
      <div className="weight-x-labels">
        {data.map((entry, i) => (
          <span key={i}>{formatDate(entry.logged_at)}</span>
        ))}
      </div>

      <div className="weight-summary">
        <span>{t('البداية', 'Start')}: <strong>{first} {t('كغ', 'kg')}</strong></span>
        <span>{t('الآن', 'Now')}: <strong>{last} {t('كغ', 'kg')}</strong></span>
        <span>
          {t('التغيير', 'Change')}:{' '}
          <strong className={change < 0 ? 'text-green' : change > 0 ? 'text-red' : ''}>
            {change > 0 ? '+' : ''}{change} {t('كغ', 'kg')}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default WeightChart;