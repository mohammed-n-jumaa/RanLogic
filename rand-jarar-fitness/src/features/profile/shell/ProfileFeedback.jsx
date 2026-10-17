import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, PartyPopper } from 'lucide-react';
import { ProfileFeedbackContext } from './feedbackContext';

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info, celebrate: PartyPopper };
const TOAST_MS = 2800;

const ProfileFeedbackProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [fireworksKey, setFireworksKey] = useState(0);
  const idRef = useRef(0);

  const toast = useCallback((message, type = 'success') => {
    const id = ++idRef.current;
    setToasts(list => [...list.slice(-2), { id, message, type }]);    // max 3 on screen
    setTimeout(() => setToasts(list => list.filter(t => t.id !== id)), TOAST_MS);
  }, []);

  const celebrate = useCallback((message) => {
    setFireworksKey(k => k + 1);
    if (message) toast(message, 'celebrate');
  }, [toast]);

  const value = useMemo(() => ({ toast, celebrate }), [toast, celebrate]);

  return (
    <ProfileFeedbackContext.Provider value={value}>
      {children}

      <div className="pf-toasts" aria-live="polite" role="status">
        {toasts.map(({ id, message, type }) => {
          const Icon = ICONS[type] || ICONS.success;
          return (
            <div key={id} className={`pf-toast pf-toast--${type}`}>
              <Icon />
              <span>{message}</span>
            </div>
          );
        })}
      </div>

      {fireworksKey > 0 && <Fireworks key={fireworksKey} />}
    </ProfileFeedbackContext.Provider>
  );
};

// ─── Canvas fireworks: a few rockets that burst into sparks ───
const Fireworks = () => {
  const canvasRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setDone(true); return undefined; }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const brand = getComputedStyle(document.documentElement).getPropertyValue('--site-primary').trim() || '#FDB813';
    const palette = [brand, '#FFFFFF', '#FF6B35', '#4F9DDE', '#1F9D55', '#EF6C57', '#9B7EDE'];
    const pick = () => palette[Math.floor(Math.random() * palette.length)];

    const rockets = [];
    const sparks = [];
    const ROCKETS = 6;
    for (let i = 0; i < ROCKETS; i++) {
      rockets.push({
        x: W * (0.15 + Math.random() * 0.7),
        y: H + 10,
        vy: -(H / 75 + Math.random() * 3),
        targetY: H * (0.15 + Math.random() * 0.3),
        delay: i * 14 + Math.random() * 10,
        color: pick(),
        exploded: false,
      });
    }

    const burst = (x, y, color) => {
      const count = 70;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 4.5;
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.012,
          color: Math.random() < 0.75 ? color : pick(),
          size: 1.6 + Math.random() * 1.8,
        });
      }
    };

    let frame = 0;
    let raf;
    const tick = () => {
      frame++;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';                 // trails
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      rockets.forEach(r => {
        if (r.exploded || frame < r.delay) return;
        r.y += r.vy;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.targetY) { r.exploded = true; burst(r.x, r.y, r.color); }
      });

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.vx *= 0.975; s.vy = s.vy * 0.975 + 0.06;              // drag + gravity
        s.x += s.vx; s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = s.life;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const finished = rockets.every(r => r.exploded) && sparks.length === 0;
      if (finished || frame > 600) { setDone(true); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (done) return null;
  return <canvas ref={canvasRef} className="pf-fireworks" aria-hidden="true" />;
};

export default ProfileFeedbackProvider;
