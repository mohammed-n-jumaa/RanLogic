/**
 * SEO.jsx — RanLogic  (Bilingual: Arabic + English)
 *
 * Usage:
 *   <SEO page="home" />                          ← uses currentLang from context
 *   <SEO page="faq"  faqItems={faqData} />
 *   <SEO page="plans" plansData={plans} />
 *   <SEO page="calorieCalculator" isCalcPage />
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { siteConfig, pagesSEO, structuredData } from '../../utils/seoConfig';

const SEO = ({
  page            = null,
  title           = null,
  description     = null,
  keywords        = null,
  image           = null,
  noindex         = false,
  canonicalUrl    = null,
  breadcrumbItems = null,
  faqItems        = null,
  plansData       = null,
  isCalcPage      = false,
}) => {
  const location   = useLocation();
  const { currentLang } = useLanguage();
  const lang = currentLang || 'ar';
  const currentUrl = `${siteConfig.siteUrl}${location.pathname}`;

  useEffect(() => {
    // ── Resolve content ──────────────────────────────────────────
    const pageSEO   = page && pagesSEO[page]?.[lang];
    const resolvedTitle       = title       || pageSEO?.title       || (lang === 'ar' ? 'RanLogic | فريق مدربين ومختصي تغذية أونلاين' : 'RanLogic | Online Trainers & Nutrition Specialists');
    const resolvedDescription = description || pageSEO?.description || '';
    const resolvedKeywords    = keywords    || pageSEO?.keywords    || '';
    const resolvedImage       = `${siteConfig.siteUrl}${image || pageSEO?.ogImage || siteConfig.defaultOgImage}`;
    const resolvedCanonical   = canonicalUrl || currentUrl;
    const isRTL = lang === 'ar';

    // ── document lang & dir ──────────────────────────────────────
    document.documentElement.lang = lang;
    document.documentElement.dir  = isRTL ? 'rtl' : 'ltr';

    // ── Basic meta ───────────────────────────────────────────────
    document.title = resolvedTitle;
    setMeta('description', resolvedDescription);
    setMeta('keywords',    resolvedKeywords);
    setMeta('author',      'RanLogic Team');
    setMeta('robots',      noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1');

    // ── Canonical ────────────────────────────────────────────────
    setLink('canonical', resolvedCanonical);

    // ── hreflang (same URL, both languages) ──────────────────────
    // Remove stale hreflang links first
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    ['ar', 'en', 'x-default'].forEach(hl => {
      const el = document.createElement('link');
      el.rel      = 'alternate';
      el.hreflang = hl;
      el.href     = resolvedCanonical;
      document.head.appendChild(el);
    });

    // ── Open Graph ───────────────────────────────────────────────
    setMeta('og:type',           'website',          'property');
    setMeta('og:site_name',      'RanLogic',         'property');
    setMeta('og:url',            currentUrl,         'property');
    setMeta('og:title',          resolvedTitle,      'property');
    setMeta('og:description',    resolvedDescription,'property');
    setMeta('og:image',          resolvedImage,      'property');
    setMeta('og:image:width',    '1200',             'property');
    setMeta('og:image:height',   '630',              'property');
    setMeta('og:image:alt',      resolvedTitle,      'property');
    setMeta('og:locale',         isRTL ? 'ar_AR' : 'en_US', 'property');
    setMeta('og:locale:alternate', isRTL ? 'en_US' : 'ar_AR', 'property');

    // ── Twitter Card ─────────────────────────────────────────────
    setMeta('twitter:card',        'summary_large_image');
    setMeta('twitter:site',        '@RanLogic');
    setMeta('twitter:title',       resolvedTitle);
    setMeta('twitter:description', resolvedDescription);
    setMeta('twitter:image',       resolvedImage);
    setMeta('twitter:image:alt',   resolvedTitle);

    // ── Always-present schemas ────────────────────────────────────
    injectJSON('sd-organization', structuredData.organization);
    injectJSON('sd-website',      structuredData.website);
    injectJSON('sd-sitelinks',    structuredData.sitelinks);

    // ── Breadcrumb ───────────────────────────────────────────────
    const autoBreadcrumb = page && structuredData.breadcrumbFor?.(page, lang);
    const crumbs = breadcrumbItems || autoBreadcrumb;
    if (crumbs?.length) {
      injectJSON('sd-breadcrumb', structuredData.generateBreadcrumb(crumbs));
    }

    // ── FAQ schema ───────────────────────────────────────────────
    if (faqItems?.length) {
      injectJSON('sd-faq', structuredData.generateFAQSchema(faqItems));
    }

    // ── Plans / Offers schema ─────────────────────────────────────
    if (plansData?.length) {
      injectJSON('sd-offers', structuredData.generateOffersSchema(plansData, lang));
    }

    // ── Calorie Calculator tool ───────────────────────────────────
    if (isCalcPage) {
      injectJSON('sd-calctool', structuredData.calorieCalculatorTool(lang));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, lang, title, description, keywords, image, location.pathname, noindex, canonicalUrl, faqItems, plansData, isCalcPage]);

  return null;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function setMeta(nameOrProp, content, attrType = 'name') {
  if (content == null) return;
  let el = document.querySelector(`meta[${attrType}="${nameOrProp}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrType, nameOrProp);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJSON(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id   = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data, null, 0);
}

export default SEO;
