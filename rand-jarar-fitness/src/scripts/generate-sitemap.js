/**
 * generate-sitemap.js — RanLogic
 * Auto-generates sitemap.xml and robots.txt at build time.
 *
 * Add to package.json:
 *   "build": "vite build && node src/scripts/generate-sitemap.js"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL   = 'http://127.0.0.1:8000';
const PUBLIC_DIR = path.join(__dirname, '../../public');

const today = new Date().toISOString().split('T')[0];

// ── Pages config ─────────────────────────────────────────────────────────────
const pages = [
  { path: '/',                    priority: '1.0', changefreq: 'weekly',  public: true  },
  { path: '/plans',               priority: '0.9', changefreq: 'weekly',  public: true  },
  { path: '/calorie-calculator',  priority: '0.9', changefreq: 'monthly', public: true  },
  { path: '/faq',                 priority: '0.8', changefreq: 'weekly',  public: true  },
  { path: '/contact',             priority: '0.7', changefreq: 'monthly', public: true  },
  { path: '/auth',                priority: '0.6', changefreq: 'monthly', public: true  },
  { path: '/privacy-policy',      priority: '0.3', changefreq: 'yearly',  public: true  },
  { path: '/terms-of-service',    priority: '0.3', changefreq: 'yearly',  public: true  },
  { path: '/refund-policy',       priority: '0.3', changefreq: 'yearly',  public: true  },
  // Private — excluded
  { path: '/profile',             public: false },
  { path: '/payment',             public: false },
];

// ── Generate sitemap.xml ─────────────────────────────────────────────────────
function generateSitemap() {
  const publicPages = pages.filter(p => p.public);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n`;

  publicPages.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    if (page.path === '/' || page.path === '/plans' || page.path === '/faq' || page.path === '/calorie-calculator') {
      xml += `    <xhtml:link rel="alternate" hreflang="ar" href="${SITE_URL}${page.path}"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${page.path}"/>\n`;
    }
    xml += `  </url>\n\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');
  console.log(`✅ sitemap.xml generated (${publicPages.length} pages) — ${today}`);
}

// ── Generate robots.txt ──────────────────────────────────────────────────────
function generateRobots() {
  const privatePages = pages.filter(p => !p.public).map(p => `Disallow: ${p.path}`).join('\n');

  const content = `# robots.txt — RanLogic (auto-generated ${today})
User-agent: *
Allow: /
${privatePages}

Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), content, 'utf8');
  console.log('✅ robots.txt generated');
}

generateSitemap();
generateRobots();
