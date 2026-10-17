import { memo, useState } from 'react';
import { LineChart } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const W = 640, H = 220;
const PAD = { t: 18, r: 14, b: 30, l: 36 };

const WeightChart = ({ data }) => {
  const { t, currentLang } = useProfileLanguage();
  const [hover, setHover] = useState(null);
  const locale = currentLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
  const fmt = d => new Date(d).toLocaleDateString(locale, { month: 'short', day: 'numeric' });

  const header = (
    <div className="pf-card__head">
      <h3 className="pf-card__title"><span className="pf-card__icon"><LineChart /></span>{t('تقدّم الوزن', 'Weight progress')}</h3>
    </div>
  );

  if (!data?.length) {
    return (
      <section className="pf-card">
        {header}
        <p className="pf-card__sub">{t('لا توجد بيانات بعد — حدّث وزنك من الملف الشخصي', 'No data yet — update your weight from your profile')}</p>
      </section>
    );
  }

  const weights = data.map(d => parseFloat(d.weight));
  const min = Math.floor(Math.min(...weights) - 1);
  const max = Math.ceil(Math.max(...weights) + 1);
  const x = i => PAD.l + (data.length === 1 ? 0.5 : i / (data.length - 1)) * (W - PAD.l - PAD.r);
  const y = v => PAD.t + (1 - (v - min) / (max - min || 1)) * (H - PAD.t - PAD.b);
  const pts = weights.map((w, i) => ({ x: x(i), y: y(w), w, date: data[i].logged_at }));
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1].x},${H - PAD.b} L${pts[0].x},${H - PAD.b} Z`;
  const ticks = [min, (min + max) / 2, max];
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));
  const first = weights[0], last = weights[weights.length - 1];
  const change = +(last - first).toFixed(1);

  return (
    <section className="pf-card">
      {header}
      <div className="db-chart">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={t('رسم بياني للوزن', 'Weight chart')}>
          <defs>
            <linearGradient id="db-weight-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--pf-primary)" stopOpacity=".35" />
              <stop offset="1" stopColor="var(--pf-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map(v => <line key={v} className="db-chart__grid" x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} />)}
          {ticks.map(v => <text key={`l${v}`} className="db-chart__axis" x="4" y={y(v) + 4}>{Math.round(v)}</text>)}
          {pts.map((p, i) => ((i % labelEvery === 0 || i === pts.length - 1)
            ? <text key={`d${i}`} className="db-chart__axis" x={p.x} y={H - 8} textAnchor="middle">{fmt(p.date)}</text>
            : null))}
          <path d={area} fill="url(#db-weight-fill)" />
          <path d={line} className="db-chart__line" />
          {pts.map((p, i) => (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => setHover(i)}>
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
              <circle cx={p.x} cy={p.y} r={hover === i ? 6 : 4} className="db-chart__dot" />
            </g>
          ))}
        </svg>
        {hover !== null && (
          <div className="db-chart__tip" style={{ left: `${(pts[hover].x / W) * 100}%`, top: `${(pts[hover].y / H) * 100}%` }}>
            <span className="pf-num">{pts[hover].w}</span> {t('كغ', 'kg')} · {fmt(pts[hover].date)}
          </div>
        )}
      </div>
      <div className="db-chart__summary">
        <span>{t('البداية', 'Start')}: <strong className="pf-num">{first}</strong></span>
        <span>{t('الآن', 'Now')}: <strong className="pf-num">{last}</strong></span>
        <span>{t('التغيير', 'Change')}: <strong className={`pf-num ${change < 0 ? 'is-good' : change > 0 ? 'is-bad' : ''}`}>{change > 0 ? '+' : ''}{change} {t('كغ', 'kg')}</strong></span>
      </div>
    </section>
  );
};

export default memo(WeightChart);
