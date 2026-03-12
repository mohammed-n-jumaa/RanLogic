import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({ 
  fullScreen = true, 
  message = 'Loading...',
  minDuration = 0 // مدة عرض دنيا بالميلي ثانية
}) => {
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    if (minDuration > 0) {
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, minDuration);
      
      return () => clearTimeout(timer);
    }
  }, [minDuration]);

  if (!shouldShow && minDuration > 0) return null;

  // Generate random stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className={`loading-spinner ${fullScreen ? 'fullscreen' : ''}`}>
      {/* Animated stars background */}
      <div className="stars-container">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="spinner-content">
        <motion.div
          className="spinner-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/fitness.gif" alt="Loading" />
        </motion.div>

        <motion.p
          className="spinner-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.p>

        <div className="spinner-dots">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              .
            </motion.span>
          ))}
        </div>

        <motion.div
          className="spinner-bar"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;