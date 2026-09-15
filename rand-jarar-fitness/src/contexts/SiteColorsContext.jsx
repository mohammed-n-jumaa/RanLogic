import React, { createContext, useContext, useEffect, useState } from 'react';
import siteColorsApi from '../api/siteColorsApi';

const DEFAULTS = {
  site_primary:    'var(--site-primary)',
  site_secondary:  'var(--site-secondary)',
  site_accent:     'var(--site-accent)',
  site_background: '#FFFFFF',
  site_text:       'var(--site-secondary)',
  site_text_light: '#757575',
};

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
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
};

export const SiteColorsProvider = ({ children }) => {
  const [colors, setColors] = useState(DEFAULTS);

  useEffect(() => {
    // Apply defaults immediately
    applyColorsToDOM(DEFAULTS);

    // Then fetch from API and override
    const load = async () => {
      const fetched = await siteColorsApi.getColors();
      if (fetched) {
        const merged = { ...DEFAULTS, ...fetched };
        setColors(merged);
        applyColorsToDOM(merged);
      }
    };

    load();
  }, []);

  return (
    <SiteColorsContext.Provider value={colors}>
      {children}
    </SiteColorsContext.Provider>
  );
};

export const useSiteColors = () => useContext(SiteColorsContext);

export default SiteColorsContext;
