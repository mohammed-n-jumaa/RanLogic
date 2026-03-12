import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig, structuredData } from '../../utils/seoConfig';

/**
 * SEO Component - Lightweight Version
 * Handles only meta tags and structured data
 * Analytics loaded separately in App.jsx
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  article = false,
  lang = 'ar',
  structuredDataOverride = null,
  breadcrumbItems = null,
  noindex = false,
  nofollow = false,
  canonicalUrl = null
}) => {
  const location = useLocation();
  const currentUrl = `${siteConfig.siteUrl}${location.pathname}`;

  useEffect(() => {
    // Set document language and direction
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Basic Meta Tags
    document.title = title || `${siteConfig.trainerName} | ${siteConfig.siteName}`;

    // Update or create meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', siteConfig.trainerName);
    updateMetaTag('robots', noindex || nofollow ? 
      `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}` : 
      'index,follow');

    // Canonical URL
    const canonical = canonicalUrl || currentUrl;
    updateLinkTag('canonical', canonical);

    // Alternate Language Links
    siteConfig.supportedLanguages.forEach(supportedLang => {
      const alternatePath = location.pathname.replace(`/${lang}`, supportedLang === 'ar' ? '' : `/${supportedLang}`);
      updateLinkTag('alternate', `${siteConfig.siteUrl}${alternatePath}`, {
        hreflang: supportedLang
      });
    });

    // Open Graph Meta Tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', article ? 'article' : 'website', 'property');
    updateMetaTag('og:image', image || siteConfig.defaultOgImage, 'property');
    updateMetaTag('og:image:width', '1200', 'property');
    updateMetaTag('og:image:height', '630', 'property');
    updateMetaTag('og:site_name', siteConfig.siteName, 'property');
    updateMetaTag('og:locale', lang === 'ar' ? 'ar_AR' : 'en_US', 'property');

    // Twitter Card Meta Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image || siteConfig.defaultOgImage);
    updateMetaTag('twitter:url', currentUrl);

    // Mobile Meta Tags
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
    updateMetaTag('theme-color', '#FDB813');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');

    // Structured Data
    const structuredDataToInsert = structuredDataOverride || getDefaultStructuredData();
    updateStructuredData('structured-data-main', structuredDataToInsert);

    // Breadcrumb Structured Data
    if (breadcrumbItems) {
      const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
      updateStructuredData('structured-data-breadcrumb', breadcrumbSchema);
    }

  }, [title, description, keywords, image, article, lang, location.pathname, structuredDataOverride, breadcrumbItems, noindex, nofollow, canonicalUrl, currentUrl]);

  // Helper function to update or create meta tags
  const updateMetaTag = (name, content, attributeName = 'name') => {
    if (!content) return;

    let element = document.querySelector(`meta[${attributeName}="${name}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, name);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  };

  // Helper function to update or create link tags
  const updateLinkTag = (rel, href, additionalAttrs = {}) => {
    const selector = Object.keys(additionalAttrs).length > 0 
      ? `link[rel="${rel}"][${Object.keys(additionalAttrs)[0]}="${Object.values(additionalAttrs)[0]}"]`
      : `link[rel="${rel}"]`;
    
    let element = document.querySelector(selector);
    
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    
    element.setAttribute('href', href);
    
    Object.entries(additionalAttrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  };

  // Helper function to update structured data
  const updateStructuredData = (id, data) => {
    let script = document.getElementById(id);
    
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data);
  };

  // Get default structured data based on page
  const getDefaultStructuredData = () => {
    return [
      structuredData.organization,
      structuredData.person
    ];
  };

  // Generate breadcrumb structured data
  const generateBreadcrumbSchema = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.siteUrl}${item.url}`
    }))
  });

  return null;
};

export default SEO;