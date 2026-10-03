import React, { createContext, useContext, useEffect, useState } from 'react';
import siteColorsApi from '../api/siteColorsApi';

// Must stay in sync with :root in styles/variables.scss and the inline script in index.html
const DEFAULTS = {
  site_primary:    '#FDB813',
  site_secondary:  '#1C1C1C',
  site_accent:     '#FFF8E1',
  site_background: '#FFFFFF',
  site_text:       '#1C1C1C',
  site_text_light: '#757575',
};

const STORAGE_KEY = 'site_colors';

const SiteColorsContext = createContext(DEFAULTS);

/**
 * Applies color values as CSS custom properties on :root
 */
const applyColorsToDOM = (colors) => {
  const root = document.documentElement;
  root.style.setProperty('--site-primary', colors.site_primary);
  root.style.setProperty('--site-secondary', colors.site_secondary);
  root.style.setProperty('--site-accent', colors.site_accent);
  root.style.setProperty('--site-background', colors.site_background);
  root.style.setProperty('--site-text', colors.site_text);
  root.style.setProperty('--site-text-light', colors.site_text_light);

  // Generate lighter/darker variants automatically
  root.style.setProperty('--site-primary-rgb', hexToRgb(colors.site_primary));
  root.style.setProperty('--site-secondary-rgb', hexToRgb(colors.site_secondary));
};

/**
 * Convert hex to RGB string for rgba() usage
 */
const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h.slice(0, 6), 16);
  return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
};

/**
 * Last colors fetched from the API, so repeat visits paint the right colors instantly
 */
const readCachedColors = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
};

const writeCachedColors = (colors) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  } catch {
    // Storage unavailable (private mode, quota) — colors still apply for this visit
  }
};

export const SiteColorsProvider = ({ children }) => {
  const [colors, setColors] = useState(() => readCachedColors() || DEFAULTS);

  useEffect(() => {
    // Apply cached (or default) colors immediately
    applyColorsToDOM(colors);

    // Then fetch from API and override
    const load = async () => {
      const fetched = await siteColorsApi.getColors();
      if (fetched) {
        const merged = { ...DEFAULTS, ...fetched };
        setColors(merged);
        applyColorsToDOM(merged);
        writeCachedColors(merged);
      }
    };

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SiteColorsContext.Provider value={colors}>
      {children}
    </SiteColorsContext.Provider>
  );
};

export const useSiteColors = () => useContext(SiteColorsContext);

export default SiteColorsContext;
