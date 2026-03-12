/**
 * Analytics & Tracking Loader
 * Loads once in App.jsx to prevent duplicate injections
 * Improves CLS and performance
 */

import { siteConfig } from './seoConfig';

// Track if scripts are already loaded
let analyticsLoaded = false;
let gtmLoaded = false;
let fbPixelLoaded = false;

/**
 * Load Google Analytics 4
 */
export const loadGoogleAnalytics = () => {
  if (analyticsLoaded || !siteConfig.googleAnalyticsId) return;
  if (window.gtag) return; // Already loaded

  try {
    // GA4 Script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAnalyticsId}`;
    document.head.appendChild(script1);

    // GA4 Config
    const script2 = document.createElement('script');
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${siteConfig.googleAnalyticsId}', {
        page_path: window.location.pathname,
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      });
    `;
    document.head.appendChild(script2);

    analyticsLoaded = true;
    console.log('[Analytics] Google Analytics loaded');
  } catch (error) {
    console.error('[Analytics] Error loading Google Analytics:', error);
  }
};

/**
 * Load Google Tag Manager
 */
export const loadGoogleTagManager = () => {
  if (gtmLoaded || !siteConfig.googleTagManagerId) return;
  if (window.google_tag_manager) return; // Already loaded

  try {
    // GTM Head Script
    const script = document.createElement('script');
    script.textContent = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${siteConfig.googleTagManagerId}');
    `;
    document.head.appendChild(script);

    // GTM noscript fallback
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${siteConfig.googleTagManagerId}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);

    gtmLoaded = true;
    console.log('[Analytics] Google Tag Manager loaded');
  } catch (error) {
    console.error('[Analytics] Error loading GTM:', error);
  }
};

/**
 * Load Facebook Pixel
 */
export const loadFacebookPixel = () => {
  if (fbPixelLoaded || !siteConfig.facebookPixelId) return;
  if (window.fbq) return; // Already loaded

  try {
    const script = document.createElement('script');
    script.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${siteConfig.facebookPixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Pixel noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = '1';
    img.width = '1';
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${siteConfig.facebookPixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    fbPixelLoaded = true;
    console.log('[Analytics] Facebook Pixel loaded');
  } catch (error) {
    console.error('[Analytics] Error loading Facebook Pixel:', error);
  }
};

/**
 * Track page view (call this on route change)
 */
export const trackPageView = (path) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('config', siteConfig.googleAnalyticsId, {
      page_path: path
    });
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }

  // GTM (if using virtual pageviews)
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'virtualPageview',
      page: path
    });
  }
};

/**
 * Track custom event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq('trackCustom', eventName, eventParams);
  }

  // GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
  }
};

/**
 * Initialize all analytics (call once in App.jsx)
 */
export const initAnalytics = () => {
  console.log('[Analytics] Initializing tracking scripts...');

  // Load in sequence to prevent blocking
  setTimeout(() => loadGoogleAnalytics(), 100);
  setTimeout(() => loadGoogleTagManager(), 200);
  setTimeout(() => loadFacebookPixel(), 300);
};

export default {
  initAnalytics,
  trackPageView,
  trackEvent,
  loadGoogleAnalytics,
  loadGoogleTagManager,
  loadFacebookPixel
};