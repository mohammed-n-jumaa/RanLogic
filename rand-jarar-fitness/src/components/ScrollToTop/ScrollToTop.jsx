import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import './ScrollToTop.scss';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      const scrollTop = window.scrollY;
      const docHeight = document.body.clientHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(scrollProgress, 100));
    };

    toggleVisibility();
    
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="scroll-to-top"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: 5 
          }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="progress-ring">
            <svg className="progress-ring__circle" width="60" height="60">
              <circle
                className="progress-ring__circle-bg"
                cx="30"
                cy="30"
                r="27"
                strokeWidth="3"
              />
              <motion.circle
                className="progress-ring__circle-progress"
                cx="30"
                cy="30"
                r="27"
                strokeWidth="3"
                strokeDasharray={`${progress * 1.7} 170`}
                initial={{ strokeDasharray: "0 170" }}
                animate={{ strokeDasharray: `${progress * 1.7} 170` }}
                transition={{ duration: 0.2 }}
              />
            </svg>
          </div>
          <FaArrowUp className="arrow-icon" />
          
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;