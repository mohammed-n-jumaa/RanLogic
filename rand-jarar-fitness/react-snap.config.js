/**
 * Prerendering Configuration for RanLogic
 * Uses react-snap for static HTML generation
 * 
 * INSTALLATION:
 * npm install --save-dev react-snap
 * 
 * Add to package.json:
 * {
 *   "scripts": {
 *     "build": "vite build",
 *     "postbuild": "react-snap && node scripts/generate-sitemap.js"
 *   },
 *   "reactSnap": {
 *     // Config loaded from this file
 *   }
 * }
 */

module.exports = {
  // Pages to prerender
  include: [
    '/',
    '/faq',
    '/plans',
    '/en',
    '/en/faq',
    '/en/plans'
  ],

  // Pages to exclude
  skipThirdPartyRequests: true,
  
  // Viewport
  viewport: {
    width: 1920,
    height: 1080
  },

  // Wait for content
  waitFor:5000, // Wait 5 seconds for dynamic content
  
  // Crawl
  crawl: true,
  
  // Remove inline styles (optional - improves performance)
  removeStyleTags: false,
  
  // Remove script tags (optional - for pure static)
  removeScriptTags: false,
  
  // Minify HTML
  minifyHtml: {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,
    keepClosingSlash: true,
    sortAttributes: true,
    sortClassName: true
  },

  // User agent
  userAgent: 'ReactSnap',

  // Headers
  headless: true,

  // Cache
  cacheAjaxRequests: false,

  // Ignore resources
  skipThirdPartyRequests: true,

  // Remove blobs
  removeBlobs: true,

  // Async script tags
  asyncScriptTags: true,

  // Inline CSS
  inlineCss: true,

  // Fix web worker
  fixWebpackChunksIssue: 'CRA2',

  // External server (if needed)
  // externalServer: 'http://localhost:3000',

  // Concurrency
  concurrency: 4,

  // Public path
  publicPath: '/',

  // Source directory
  source: 'dist'
};