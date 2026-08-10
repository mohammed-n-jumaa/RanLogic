export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = (fn, limit = 1000) => {
  let inThrottle = false;
  return (...args) => {
    if (inThrottle) return;
    fn(...args);
    inThrottle = true;
    setTimeout(() => { inThrottle = false; }, limit);
  };
};

// ── Rate Limiter ─────────────────────────────────────────
export const createRateLimiter = (maxAttempts = 5, windowMs = 60000) => {
  let attempts = 0;
  let resetTimer = null;

  return {
    canProceed() {
      if (attempts >= maxAttempts) return false;
      attempts++;
      if (!resetTimer) {
        resetTimer = setTimeout(() => {
          attempts = 0;
          resetTimer = null;
        }, windowMs);
      }
      return true;
    },
    getRemainingTime() {
      return resetTimer ? Math.ceil(windowMs / 1000) : 0;
    },
    reset() {
      attempts = 0;
      if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }
    }
  };
};