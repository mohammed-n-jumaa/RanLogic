import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHONE_QUERY = '(max-width: 680px)';

const useIsPhone = () => {
  const [isPhone, setIsPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(PHONE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const onChange = (e) => setIsPhone(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isPhone;
};

/**
 * Modal shell for the exercise library:
 * centered dialog on wide screens, bottom sheet on phones.
 */
const ExSheet = ({ isOpen, onClose, size = 'md', className = '', labelledBy, children }) => {
  const isPhone = useIsPhone();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [isOpen, onClose]);

  const motionProps = isPhone
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { type: 'spring', damping: 30, stiffness: 300 } }
    : { initial: { opacity: 0, y: 24, scale: 0.94 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 12, scale: 0.96 }, transition: { type: 'spring', damping: 22, stiffness: 280 } };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="exs-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
        >
          <motion.div
            className={`exs exs--${size} ${className}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            {...motionProps}
          >
            <div className="exs__handle" aria-hidden="true" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExSheet;
