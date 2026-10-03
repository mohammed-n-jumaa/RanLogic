/**
 * prerender.mjs — RanLogic
 * Writes dist/<route>.html for each public route, with that route's own
 * title / description / canonical / og tags, so crawlers see correct
 * metadata before any JS runs.
 *
 * Flat files (faq.html, not faq/index.html) on purpose: a real folder makes
 * the server 301 /faq → /faq/, which Search Console reports as
 * "Page with redirect". public/.htaccess maps /faq → faq.html.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { siteConfig, pagesSEO } from '../utils/seoConfig.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../../dist');

const ROUTES = {
  '/faq':                'faq',
  '/calorie-calculator': 'calorieCalculator',
  '/meal-calculator':    'mealCalculator',
  '/contact':            'contact',
  '/privacy-policy':     'privacyPolicy',
  '/terms-of-service':   'termsOfService',
  '/refund-policy':      'refundPolicy',
};

const escapeAttr = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');

const setAttr = (html, selector, attr, value) => {
  const re = new RegExp(`(<${selector}[^>]*\\s${attr}=")[^"]*(")`, 'g');
  if (!re.test(html)) throw new Error(`tag not found in template: <${selector} ${attr}>`);
  return html.replace(re, `$1${escapeAttr(value)}$2`);
};

let success = 0;
let failed  = 0;

for (const [route, pageKey] of Object.entries(ROUTES)) {
  try {
    const seo = pagesSEO[pageKey]?.ar;
    if (!seo) throw new Error(`no pagesSEO.${pageKey}.ar in seoConfig.js`);

    const url = `${siteConfig.siteUrl}${route}`;
    let html = template;

    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(seo.title)}</title>`);
    html = setAttr(html, 'meta name="description"',         'content', seo.description);
    html = setAttr(html, 'link rel="canonical"',            'href',    url);
    html = setAttr(html, 'link rel="alternate"',            'href',    url);
    html = setAttr(html, 'meta property="og:url"',          'content', url);
    html = setAttr(html, 'meta property="og:title"',        'content', seo.title);
    html = setAttr(html, 'meta property="og:description"',  'content', seo.description);
    html = setAttr(html, 'meta name="twitter:title"',       'content', seo.title);
    html = setAttr(html, 'meta name="twitter:description"', 'content', seo.description);

    const file = path.join(DIST, `${route.slice(1)}.html`);
    fs.writeFileSync(file, html, 'utf-8');
    console.log(`✅  ${route} → ${path.basename(file)}`);
    success++;
  } catch (err) {
    console.error(`❌  ${route} — ${err.message}`);
    failed++;
  }
}

// ── 404.html — served by .htaccess (ErrorDocument) with a real 404 status;
//    the React app then renders NotFound for the unknown URL.
try {
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, '<title>الصفحة غير موجودة | RanLogic</title>');
  html = setAttr(html, 'meta name="robots"', 'content', 'noindex, follow');
  html = html.replace(/\s*<link rel="canonical"[^>]*>/, '');
  html = html.replace(/\s*<link rel="alternate" hreflang="[^"]*"[^>]*>/g, '');
  fs.writeFileSync(path.join(DIST, '404.html'), html, 'utf-8');
  console.log('✅  404.html');
  success++;
} catch (err) {
  console.error(`❌  404.html — ${err.message}`);
  failed++;
}

console.log(`\n🎉  Prerender انتهى: ${success} نجح، ${failed} فشل`);
if (failed) process.exit(1);
