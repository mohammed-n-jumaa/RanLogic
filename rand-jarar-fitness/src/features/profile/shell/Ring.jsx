import { useEffect, useState } from 'react';

/** Animated SVG progress ring */
const Ring = ({ value = 0, max = 1, size = 120, stroke = 10, label, sub }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  const [offset, setOffset] = useState(c);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOffset(c * (1 - pct)));
    return () => cancelAnimationFrame(id);
  }, [c, pct]);

  return (
    <div className="pf-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle className="pf-ring__track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle
          className="pf-ring__value"
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset}
        />
      </svg>
      {(label !== undefined || sub) && (
        <div className="pf-ring__label">
          {label !== undefined && <strong className="pf-num">{label}</strong>}
          {sub && <small>{sub}</small>}
        </div>
      )}
    </div>
  );
};

export default Ring;
