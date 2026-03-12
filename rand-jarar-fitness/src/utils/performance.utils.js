/**
 * Performance Monitoring Utility for SEO
 * Tracks Core Web Vitals and other performance metrics
 * ✅ Production only - No logs in development/preview
 */

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 }
};

// ✅ تشغيل فقط في الإنتاج
const IS_PRODUCTION = typeof window !== 'undefined' && 
  import.meta.env?.PROD === true && 
  window.location.hostname !== 'localhost' && 
  !window.location.hostname.includes('127.0.0.1') &&
  window.location.port !== '4173';

/**
 * Get performance rating
 */
const getPerformanceRating = (value, threshold) => {
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};

/**
 * Track Largest Contentful Paint (LCP)
 */
export const trackLCP = (callback) => {
  if (!IS_PRODUCTION || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.renderTime || lastEntry.loadTime;
      
      callback({
        name: 'LCP',
        value: lcp,
        rating: getPerformanceRating(lcp, THRESHOLDS.LCP),
        threshold: THRESHOLDS.LCP
      });
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    // Silent fail in production
  }
};

/**
 * Track First Input Delay (FID)
 */
export const trackFID = (callback) => {
  if (!IS_PRODUCTION || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fid = entry.processingStart - entry.startTime;
        
        callback({
          name: 'FID',
          value: fid,
          rating: getPerformanceRating(fid, THRESHOLDS.FID),
          threshold: THRESHOLDS.FID
        });
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    // Silent fail
  }
};

/**
 * Track Cumulative Layout Shift (CLS)
 */
export const trackCLS = (callback) => {
  if (!IS_PRODUCTION || !('PerformanceObserver' in window)) return;

  let clsValue = 0;
  let clsEntries = [];

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });

      callback({
        name: 'CLS',
        value: clsValue,
        rating: getPerformanceRating(clsValue, THRESHOLDS.CLS),
        threshold: THRESHOLDS.CLS,
        entries: clsEntries
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    // Silent fail
  }
};

/**
 * Track First Contentful Paint (FCP)
 */
export const trackFCP = (callback) => {
  if (!IS_PRODUCTION || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          callback({
            name: 'FCP',
            value: entry.startTime,
            rating: getPerformanceRating(entry.startTime, THRESHOLDS.FCP),
            threshold: THRESHOLDS.FCP
          });
        }
      });
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    // Silent fail
  }
};

/**
 * Track Time to First Byte (TTFB)
 */
export const trackTTFB = (callback) => {
  if (!IS_PRODUCTION) return;

  try {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      
      callback({
        name: 'TTFB',
        value: ttfb,
        rating: getPerformanceRating(ttfb, THRESHOLDS.TTFB),
        threshold: THRESHOLDS.TTFB
      });
    }
  } catch (error) {
    // Silent fail
  }
};

/**
 * Initialize all Core Web Vitals tracking
 */
export const initCoreWebVitals = () => {
  if (!IS_PRODUCTION) {
    return () => ({});
  }

  const metrics = {};

  const reportMetric = (metric) => {
    metrics[metric.name] = metric;

    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.value),
        event_label: metric.rating,
        non_interaction: true
      });
    }
  };

  trackLCP(reportMetric);
  trackFID(reportMetric);
  trackCLS(reportMetric);
  trackFCP(reportMetric);
  trackTTFB(reportMetric);

  return () => metrics;
};

/**
 * Track page load time - Production only
 */
export const trackPageLoad = () => {
  if (!IS_PRODUCTION) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: 'page_load',
          value: pageLoadTime,
          event_category: 'Performance'
        });
      }
    }, 1000);
  });
};

/**
 * Track resource loading - Production only
 */
export const trackResourceLoading = () => {
  if (!IS_PRODUCTION || !window.performance) return;
};

/**
 * Monitor long tasks (>50ms) - Production only
 */
export const monitorLongTasks = () => {
  if (!IS_PRODUCTION || !('PerformanceObserver' in window)) return;
};

/**
 * Initialize all performance monitoring
 */
export const initPerformanceMonitoring = () => {
  if (!IS_PRODUCTION) {
    return () => ({});
  }

  // Track Core Web Vitals
  const getMetrics = initCoreWebVitals();

  // Track page load
  trackPageLoad();

  return getMetrics;
};

export default {
  initCoreWebVitals,
  initPerformanceMonitoring,
  trackLCP,
  trackFID,
  trackCLS,
  trackFCP,
  trackTTFB,
  trackPageLoad,
  trackResourceLoading,
  monitorLongTasks
};