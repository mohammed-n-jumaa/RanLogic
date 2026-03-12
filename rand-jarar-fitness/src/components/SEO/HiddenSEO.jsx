import React from 'react';
import './HiddenSEO.scss';

/**
 * Hidden SEO Content Component
 * Provides semantic weight for search engines without affecting UI
 * Uses sr-only (screen reader only) class
 * 
 * Not cloaking because:
 * 1. Content is related to page
 * 2. Available to screen readers
 * 3. Provides semantic structure
 */

const HiddenSEO = ({ children, as = 'div' }) => {
  const Component = as;
  return <Component className="sr-only">{children}</Component>;
};

export default HiddenSEO;