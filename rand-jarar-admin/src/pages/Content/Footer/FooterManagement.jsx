import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Share2, Plus, Trash2, ChevronLeft, ExternalLink,
  CheckCircle, AlertCircle, Loader, Globe, Mail, Phone,
  MapPin, FileText, Eye, ChevronDown,
} from 'lucide-react';
import footerApi from '../../../api/footerApi';
import './FooterManagement.scss';

// ── Font Awesome ──────────────────────────────────────────────────────────────
const loadFA = () => {
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
    document.head.appendChild(l);
  }
};

// ── helpers ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'social',  label: 'السوشيال ميديا', Icon: Share2   },
  { id: 'text',    label: 'النصوص',          Icon: FileText  },
  { id: 'contact', label: 'الاتصال',         Icon: Mail      },
  { id: 'preview', label: 'المعاينة',        Icon: Eye       },
];

const EMPTY = {
  description_en: '', description_ar: '',
  copyright_en: '', copyright_ar: '',
  quick_links_title_en: 'Quick Links', quick_links_title_ar: 'روابط سريعة',
  email: '', phone: '', address_en: '', address_ar: '',
  social_links: [],
};

// ── PlatformCard ──────────────────────────────────────────────────────────────
const PlatformCard = ({ platform, isAdded, onAdd }) => (
  <motion.button
    className={`platform-card ${isAdded ? 'added' : ''}`}
    onClick={() => !isAdded && onAdd(platform.value)}
    whileHover={!isAdded ? { scale: 1.05, y: -2 } : {}}
    whileTap={!isAdded ? { scale: 0.95 } : {}}
    title={isAdded ? 'مضاف' : `إضافة ${platform.label}`}
  >
    <div className="pc-icon" style={{ background: platform.bg }}>
      <i className={platform.icon} style={{ color: platform.iconColor || '#fff' }} />
    </div>
    <span className="pc-label">{platform.label}</span>
    {isAdded && <CheckCircle size={13} className="pc-check" />}
  </motion.button>
);

// ── SocialRow ─────────────────────────────────────────────────────────────────
const SocialRow = ({ social, index, onChange, onRemove }) => {
  const p = footerApi.getPlatform(social.platform);
  return (
    <motion.div
      className="social-row"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="sr-icon" style={{ background: p.bg }}>
        <i className={p.icon} style={{ color: p.iconColor || '#fff' }} />
      </div>
      <div className="sr-body">
        <span className="sr-name">{p.label}</span>
        <input
          type="url"
          className="sr-input"
          placeholder="https://..."
          value={social.url}
          onChange={(e) => onChange(index, e.target.value)}
        />
      </div>
      {social.url && (
        <a href={social.url} target="_blank" rel="noopener noreferrer" className="sr-btn preview-btn" title="فتح">
          <ExternalLink size={14} />
        </a>
      )}
      <button className="sr-btn delete-btn" onClick={() => onRemove(index)} title="حذف">
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
};

// ── LangField ─────────────────────────────────────────────────────────────────
const LangField = ({ label, hint, valueAr, valueEn, onChangeAr, onChangeEn, multiline = false }) => (
  <div className="lang-field">
    <div className="lf-label">{label}</div>
    {hint && <div className="lf-hint">{hint}</div>}
    <div className="lf-inputs">
      <div className="lf-input-wrap">
        <span className="lf-lang ar">AR</span>
        {multiline
          ? <textarea className="lf-input" rows={3} value={valueAr} onChange={e => onChangeAr(e.target.value)} placeholder="النص بالعربية..." />
          : <input    className="lf-input" type="text" value={valueAr} onChange={e => onChangeAr(e.target.value)} placeholder="النص بالعربية..." />
        }
      </div>
      <div className="lf-input-wrap">
        <span className="lf-lang en">EN</span>
        {multiline
          ? <textarea className="lf-input" rows={3} value={valueEn} onChange={e => onChangeEn(e.target.value)} placeholder="Text in English..." dir="ltr" />
          : <input    className="lf-input" type="text" value={valueEn} onChange={e => onChangeEn(e.target.value)} placeholder="Text in English..." dir="ltr" />
        }
      </div>
    </div>
  </div>
);

// ── SocialTab — منفصل لإدارة الـ state الخاص به ─────────────────────────────
const SocialTab = ({ socialLinks, addedSet, addPlatform, updateUrl, removeSocial }) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="social-tab-layout">

      {/* الروابط المضافة */}
      <div className="section-card">
        <div className="sc-hd">
          <Share2 size={15} />الروابط المضافة
          <span className="sc-count">{socialLinks.length}</span>
          {/* زر إضافة على الموبايل */}
          <button
            className="sc-add-btn"
            onClick={() => setPickerOpen(v => !v)}
            title="إضافة منصة"
          >
            <Plus size={15} />
            <span>إضافة</span>
            <ChevronDown size={13} className={pickerOpen ? 'rotated' : ''} />
          </button>
        </div>

        {/* Picker — يظهر مضمّناً على الموبايل بعد الهيدر مباشرة */}
        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              className="inline-picker"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="platforms-grid inline">
                {footerApi.socialPlatforms.map(p => (
                  <PlatformCard
                    key={p.value}
                    platform={p}
                    isAdded={addedSet.has(p.value)}
                    onAdd={(val) => { addPlatform(val); }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {socialLinks.length === 0 ? (
          <div className="empty-state">
            <Share2 size={38} />
            <p>لا توجد منصات مضافة بعد</p>
            <span>اضغط "إضافة" لاختيار المنصات</span>
          </div>
        ) : (
          <div className="social-list">
            <AnimatePresence>
              {socialLinks.map((s, i) => (
                <SocialRow key={`${s.platform}-${i}`} social={s} index={i} onChange={updateUrl} onRemove={removeSocial} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Picker الديسكتوب — جانبي دائماً ظاهر */}
      <div className="section-card desktop-picker">
        <div className="sc-hd"><Plus size={15} />اختر منصة لإضافتها</div>
        <div className="platforms-grid">
          {footerApi.socialPlatforms.map(p => (
            <PlatformCard key={p.value} platform={p} isAdded={addedSet.has(p.value)} onAdd={addPlatform} />
          ))}
        </div>
      </div>

    </div>
  );
};
const FooterManagement = () => {
  const [data, setData]         = useState(EMPTY);
  const [tab, setTab]           = useState('social');
  const [lang, setLang]         = useState('ar');
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving]   = useState(false);
  const [toast, setToast]       = useState(null);

  useEffect(() => { loadFA(); fetchData(); }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await footerApi.getFooterForAdmin();
    if (res.success && res.data) setData({ ...EMPTY, ...res.data });
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await footerApi.updateFooter(data);
    showToast(res.success ? 'success' : 'error', res.success ? 'تم حفظ التغييرات بنجاح ✓' : (res.message || 'حدث خطأ'));
    setSaving(false);
  };

  const set = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  // social helpers
  const addPlatform  = (val) => setData(prev => ({ ...prev, social_links: [...prev.social_links, { platform: val, url: '' }] }));
  const updateUrl    = (i, url) => setData(prev => ({ ...prev, social_links: prev.social_links.map((s, idx) => idx === i ? { ...s, url } : s) }));
  const removeSocial = (i) => setData(prev => ({ ...prev, social_links: prev.social_links.filter((_, idx) => idx !== i) }));

  const addedSet = new Set(data.social_links.map(s => s.platform));

  if (isLoading) {
    return (
      <div className="footer-mgmt">
        <div className="footer-mgmt__loading"><Loader size={32} className="spin" /><p>جاري التحميل...</p></div>
      </div>
    );
  }

  return (
    <div className="footer-mgmt">

      {/* ── Header ── */}
      <div className="footer-mgmt__header">
        <div>
          <div className="breadcrumb">
            <ChevronLeft size={14} /><span>المحتوى</span>
            <span className="sep">/</span><span className="crumb-active">إدارة الفوتر</span>
          </div>
          <h1 className="fmh-title"><Globe size={24} />إدارة الفوتر</h1>
          <p className="fmh-sub">نصوص الفوتر، معلومات الاتصال، ومنصات التواصل الاجتماعي</p>
        </div>
        <div className="fmh-actions">
          {/* تبديل اللغة — مرئي فقط في تبويبات النصوص والاتصال */}
          {(tab === 'text' || tab === 'contact') && (
            <div className="lang-toggle">
              <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>🇸🇦 AR</button>
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>🇬🇧 EN</button>
            </div>
          )}
          <motion.button
            className={`btn-save ${isSaving ? 'saving' : ''}`}
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSaving ? <Loader size={15} className="spin" /> : <Save size={15} />}
            {isSaving ? 'جاري الحفظ...' : 'حفظ'}
          </motion.button>
        </div>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div className={`fm-toast fm-toast--${toast.type}`}
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {toast.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tabs ── */}
      <div className="footer-mgmt__tabs">
        {TABS.map(t => (
          <button key={t.id} className={`fm-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <t.Icon size={16} /><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="footer-mgmt__body">
        <AnimatePresence mode="wait">

          {/* ── Social ── */}
          {tab === 'social' && (
            <motion.div key="social" className="tab-pane"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <SocialTab
                socialLinks={data.social_links}
                addedSet={addedSet}
                addPlatform={addPlatform}
                updateUrl={updateUrl}
                removeSocial={removeSocial}
              />
            </motion.div>
          )}

          {/* ── Text ── */}
          {tab === 'text' && (
            <motion.div key="text" className="tab-pane"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="section-card full">
                <div className="sc-hd"><FileText size={15} />نصوص الفوتر</div>
                <div className="fields-stack">

                  <LangField
                    label="وصف الفوتر"
                    hint="يظهر تحت الشعار في الفوتر"
                    valueAr={data.description_ar}
                    valueEn={data.description_en}
                    onChangeAr={v => set('description_ar', v)}
                    onChangeEn={v => set('description_en', v)}
                    multiline
                  />

                  <LangField
                    label="نص حقوق النشر"
                    hint="يظهر في أسفل الفوتر"
                    valueAr={data.copyright_ar}
                    valueEn={data.copyright_en}
                    onChangeAr={v => set('copyright_ar', v)}
                    onChangeEn={v => set('copyright_en', v)}
                  />

                  <LangField
                    label="عنوان قسم الروابط السريعة"
                    valueAr={data.quick_links_title_ar}
                    valueEn={data.quick_links_title_en}
                    onChangeAr={v => set('quick_links_title_ar', v)}
                    onChangeEn={v => set('quick_links_title_en', v)}
                  />

                </div>
              </div>
            </motion.div>
          )}

          {/* ── Contact ── */}
          {tab === 'contact' && (
            <motion.div key="contact" className="tab-pane"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="section-card full">
                <div className="sc-hd"><Mail size={15} />معلومات الاتصال</div>
                <div className="fields-stack">

                  <div className="simple-field">
                    <label><Mail size={14} />البريد الإلكتروني</label>
                    <input type="email" value={data.email} onChange={e => set('email', e.target.value)} placeholder="info@ranlogic.com" />
                  </div>

                  <div className="simple-field">
                    <label><Phone size={14} />رقم الهاتف</label>
                    <input type="text" value={data.phone} onChange={e => set('phone', e.target.value)} placeholder="+966 55 123 4567" dir="ltr" />
                  </div>

                  <LangField
                    label="العنوان"
                    valueAr={data.address_ar}
                    valueEn={data.address_en}
                    onChangeAr={v => set('address_ar', v)}
                    onChangeEn={v => set('address_en', v)}
                    multiline
                  />

                </div>
              </div>
            </motion.div>
          )}

          {/* ── Preview ── */}
          {tab === 'preview' && (
            <motion.div key="preview" className="tab-pane"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="preview-wrapper">
                <div className="preview-lang-toggle">
                  <button className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>🇸🇦 العربية</button>
                  <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>🇬🇧 English</button>
                </div>

                <div className="footer-preview" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  {/* Logo placeholder */}
                  <div className="fp-logo">
                    <Globe size={28} /><span>RanLogic</span>
                  </div>

                  {/* Description */}
                  {(lang === 'ar' ? data.description_ar : data.description_en) && (
                    <p className="fp-desc">
                      {lang === 'ar' ? data.description_ar : data.description_en}
                    </p>
                  )}

                  {/* Social Icons */}
                  {data.social_links.length > 0 && (
                    <div className="fp-socials">
                      {data.social_links.map((s, i) => {
                        const p = footerApi.getPlatform(s.platform);
                        return (
                          <a key={i} href={s.url || '#'} target="_blank" rel="noopener noreferrer"
                            className="fp-social-icon" style={{ background: p.bg }} title={p.label}>
                            <i className={p.icon} style={{ color: p.iconColor || '#fff' }} />
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Contact */}
                  {(data.email || data.phone) && (
                    <div className="fp-contact">
                      {data.email && <span><Mail size={13} />{data.email}</span>}
                      {data.phone && <span><Phone size={13} />{data.phone}</span>}
                    </div>
                  )}

                  {/* Address */}
                  {(lang === 'ar' ? data.address_ar : data.address_en) && (
                    <div className="fp-address">
                      <MapPin size={13} />
                      {lang === 'ar' ? data.address_ar : data.address_en}
                    </div>
                  )}

                  {/* Copyright */}
                  <div className="fp-copy">
                    {(lang === 'ar' ? data.copyright_ar : data.copyright_en) || '© 2026 RanLogic'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};

export default FooterManagement;