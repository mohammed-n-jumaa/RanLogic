
import { siteConfig } from './seo.config';

/**
 * Generate sitemap.xml content
 * @returns {string} XML sitemap content
 */
export const generateSitemap = () => {
  const baseUrl = siteConfig.siteUrl;
  const currentDate = new Date().toISOString().split('T')[0];

  const pages = [

    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0',
      languages: ['ar', 'en']
    },
    {
      url: '/faq',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
      languages: ['ar', 'en']
    },
    {
      url: '/plans',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9',
      languages: ['ar', 'en']
    }

  ];

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  pages.forEach(page => {
    page.languages.forEach(lang => {
      const url = lang === 'ar' ? page.url : `/en${page.url}`;
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${url}</loc>\n`;
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      
      // Add alternate language links
      page.languages.forEach(alternateLang => {
        const alternateUrl = alternateLang === 'ar' ? page.url : `/en${page.url}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${alternateLang}" href="${baseUrl}${alternateUrl}"/>\n`;
      });
      
      xml += '  </url>\n';
    });
  });

  xml += '</urlset>';

  return xml;
};

/**
 * Save sitemap to public folder
 * This function should be called during build process
 */
export const saveSitemap = () => {
  const sitemap = generateSitemap();
  
  // In a build script, you would write this to public/sitemap.xml
  // For client-side, you can log it or download it
  console.log('Generated Sitemap:');
  console.log(sitemap);
  
  return sitemap;
};

/**
 * Generate robots.txt content
 * @returns {string} robots.txt content
 */
export const generateRobotsTxt = () => {
  const baseUrl = siteConfig.siteUrl;
  
  let robotsTxt = '# RanLogic - Robots.txt\n\n';
  
  // Allow all good bots
  robotsTxt += 'User-agent: *\n';
  robotsTxt += 'Allow: /\n\n';
  
  // Disallow private pages
  robotsTxt += '# Disallow private pages\n';
  robotsTxt += 'Disallow: /profile\n';
  robotsTxt += 'Disallow: /auth\n';
  robotsTxt += 'Disallow: /payment/\n';
  robotsTxt += 'Disallow: /api/\n\n';
  
  // Sitemap location
  robotsTxt += '# Sitemap\n';
  robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n\n`;
  
  // Crawl delay (optional - adjust based on server capacity)
  robotsTxt += '# Crawl delay\n';
  robotsTxt += 'Crawl-delay: 1\n';
  
  return robotsTxt;
};

/**
 * Download sitemap as file (for development)
 */
export const downloadSitemap = () => {
  const sitemap = generateSitemap();
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Download robots.txt as file (for development)
 */
export const downloadRobotsTxt = () => {
  const robotsTxt = generateRobotsTxt();
  const blob = new Blob([robotsTxt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'robots.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  generateSitemap,
  saveSitemap,
  generateRobotsTxt,
  downloadSitemap,
  downloadRobotsTxt
};