/**
 * Build-time Sitemap Generator
 * Run this during build process: node scripts/generate-sitemap.js
 * 
 * Usage in package.json:
 * "scripts": {
 *   "build": "vite build && node scripts/generate-sitemap.js"
 * }
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://ranlogic.com'; // Replace with actual domain
const OUTPUT_DIR = path.join(__dirname, '../public');
const SITEMAP_PATH = path.join(OUTPUT_DIR, 'sitemap.xml');
const ROBOTS_PATH = path.join(OUTPUT_DIR, 'robots.txt');

// Define all pages with their priorities and change frequencies
const pages = [
  // Arabic pages (default language)
  {
    path: '/',
    priority: '1.0',
    changefreq: 'daily',
    languages: ['ar', 'en']
  },
  {
    path: '/faq',
    priority: '0.8',
    changefreq: 'weekly',
    languages: ['ar', 'en']
  },
  {
    path: '/plans',
    priority: '0.9',
    changefreq: 'weekly',
    languages: ['ar', 'en']
  }
];

/**
 * Generate sitemap.xml
 */
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  pages.forEach(page => {
    page.languages.forEach(lang => {
      const url = lang === 'ar' ? page.path : `/en${page.path}`;
      
      xml += '  <url>\n';
      xml += `    <loc>${SITE_URL}${url}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      
      // Add alternate language links
      page.languages.forEach(alternateLang => {
        const alternateUrl = alternateLang === 'ar' ? page.path : `/en${page.path}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${alternateLang}" href="${SITE_URL}${alternateUrl}"/>\n`;
      });
      
      xml += '  </url>\n';
    });
  });

  xml += '</urlset>';

  return xml;
}

/**
 * Generate robots.txt
 */
function generateRobotsTxt() {
  let robotsTxt = '# RanLogic - Robots.txt\n\n';
  
  robotsTxt += 'User-agent: *\n';
  robotsTxt += 'Allow: /\n\n';
  
  robotsTxt += '# Disallow private pages\n';
  robotsTxt += 'Disallow: /profile\n';
  robotsTxt += 'Disallow: /auth\n';
  robotsTxt += 'Disallow: /payment/\n';
  robotsTxt += 'Disallow: /api/\n\n';
  
  robotsTxt += '# Sitemap\n';
  robotsTxt += `Sitemap: ${SITE_URL}/sitemap.xml\n\n`;
  
  robotsTxt += '# Crawl delay\n';
  robotsTxt += 'Crawl-delay: 1\n';
  
  return robotsTxt;
}

/**
 * Write files
 */
function writeFiles() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate and write sitemap
    const sitemap = generateSitemap();
    fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');
    console.log('✅ Sitemap generated:', SITEMAP_PATH);

    // Generate and write robots.txt
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(ROBOTS_PATH, robotsTxt, 'utf8');
    console.log('✅ Robots.txt generated:', ROBOTS_PATH);

    console.log('\n🎉 SEO files generated successfully!');
  } catch (error) {
    console.error('❌ Error generating SEO files:', error);
    process.exit(1);
  }
}

// Run
writeFiles();