import { motion } from 'framer-motion';
import { useMemo } from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({
  fullScreen = true,
  message    = 'Loading...'
}) => {
  // ← 15 نجمة بدل 50 — توفير 70% من الـ animations
  const stars = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id:       i,
        x:        Math.random() * 100,
        y:        Math.random() * 100,
        size:     Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
      })),
    []
  );

  return (
    <div className={`loading-spinner ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="stars-container" aria-hidden="true">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="star"
            style={{
              left:   `${star.x}%`,
              top:    `${star.y}%`,
              width:  `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="spinner-content">
        {/* ← fetchpriority="high" + loading="eager" للـ GIF */}
        <motion.div
          className="spinner-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src="/fitness.gif"
            alt=""
            aria-hidden="true"
            width="120"
            height="120"
            loading="eager"
            fetchpriority="high"
          />
        </motion.div>

        <motion.p
          className="spinner-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {message}
        </motion.p>

        <div className="spinner-dots" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            >
              .
            </motion.span>
          ))}
        </div>

        <motion.div
          className="spinner-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
