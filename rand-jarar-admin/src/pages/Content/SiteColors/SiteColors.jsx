import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Save, RotateCcw, RefreshCw, Copy, Check,
  ExternalLink, Info, Pipette, Sparkles, Eye, Star, Globe,
  ChevronLeft, MessageSquare, ArrowUp, Play,
} from 'lucide-react';
import Swal from 'sweetalert2';
import siteColorsApi from '../../../api/siteColorsApi';
import './SiteColors.scss';

// ─── Color definitions (site only) ───────────────────────────────────────────

const COLOR_ITEMS = [
  { key: 'site_primary',    label: 'اللون الرئيسي',     hint: 'الأزرار، الروابط، العناصر المميزة' },
  { key: 'site_secondary',  label: 'اللون الثانوي',      hint: 'النصوص الداكنة، النافبار' },
  { key: 'site_accent',     label: 'لون التمييز',        hint: 'خلفيات خفيفة، تظليل الأقسام' },
  { key: 'site_background', label: 'خلفية الموقع',       hint: 'لون الخلفية الرئيسية' },
  { key: 'site_text',       label: 'لون النص الأساسي',   hint: 'العناوين والنصوص الرئيسية' },
  { key: 'site_text_light', label: 'لون النص الفاتح',    hint: 'النصوص الثانوية والتوضيحية' },
];

const SUGGESTED_SITES = [
  { name: 'Coolors', url: 'https://coolors.co/generate', desc: 'مولد باليتات عشوائي — اضغط Space لباليت جديدة', emoji: '🎲' },
  { name: 'Realtime Colors', url: 'https://www.realtimecolors.com', desc: 'شوفي الألوان على موقع حقيقي مباشرة', emoji: '👁️' },
  { name: 'Color Hunt', url: 'https://colorhunt.co', desc: 'آلاف الباليتات الجاهزة من مصممين حول العالم', emoji: '🎯' },
  { name: 'Happy Hues', url: 'https://www.happyhues.co', desc: 'باليتات مع أمثلة تطبيقية على مواقع حقيقية', emoji: '😊' },
  { name: 'Adobe Color', url: 'https://color.adobe.com/create', desc: 'أداة أدوبي المتقدمة — عجلة الألوان والتناسق', emoji: '🎨' },
  { name: 'Muzli Colors', url: 'https://colors.muz.li', desc: 'ابحثي بلون وبيعطيكِ باليت كاملة منه', emoji: '🔍' },
  { name: 'Gradient Hunt', url: 'https://gradienthunt.com', desc: 'تدرجات لونية جاهزة للأزرار والخلفيات', emoji: '🌈' },
  { name: 'Khroma AI', url: 'https://www.khroma.co', desc: 'ذكاء اصطناعي يقترح ألوان بناءً على ذوقك', emoji: '🤖' },
];

// ─── Color Card ──────────────────────────────────────────────────────────────

const ColorCard = ({ colorKey, label, hint, value, onChange, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const [inputVal, setInputVal] = useState(value);

  useEffect(() => { setInputVal(value); }, [value]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    onCopy?.(value);
  };

  const handleInput = (e) => {
    let v = e.target.value.toUpperCase();
    if (!v.startsWith('#')) v = '#' + v;
    setInputVal(v);
    if (/^#[A-Fa-f0-9]{3,8}$/.test(v)) onChange(colorKey, v);
  };

  const handlePicker = (e) => {
    const v = e.target.value.toUpperCase();
    setInputVal(v);
    onChange(colorKey, v);
  };

  return (
    <motion.div className="cc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}>
      <div className="cc__preview" style={{ background: value }}>
        <input type="color" value={value} onChange={handlePicker} className="cc__native" title="اختر لون" />
        <Pipette size={16} className="cc__pip" />
      </div>
      <div className="cc__info">
        <div className="cc__label">{label}</div>
        <div className="cc__hint">{hint}</div>
        <div className="cc__row">
          <input type="text" value={inputVal} onChange={handleInput} className="cc__hex" maxLength={9} spellCheck={false} />
          <button className={`cc__copy ${copied ? 'cc__copy--ok' : ''}`} onClick={handleCopy}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Website Preview ─────────────────────────────────────────────────────────

const SitePreview = ({ c }) => {
  const p = c.site_primary || '#FDB813';
  const s = c.site_secondary || '#1C1C1C';
  const a = c.site_accent || '#FFF8E1';
  const bg = c.site_background || '#FFFFFF';
  const t = c.site_text || '#1C1C1C';
  const tl = c.site_text_light || '#757575';

  return (
    <div className="sp" style={{ background: bg }}>
      <div className="sp__label"><Eye size={14} /> معاينة مباشرة للموقع</div>

      {/* Navbar */}
      <div className="sp__nav" style={{ background: bg, borderBottom: `1px solid ${a}` }}>
        <div className="sp__nav-logo" style={{ color: t }}>
          <span style={{ color: p }}>Ran</span>Logic
        </div>
        <div className="sp__nav-links">
          <span style={{ color: tl }}>الأسئلة</span>
          <span style={{ color: tl }}>حاسبة</span>
          <span style={{ color: tl }}>عن الفريق</span>
          <span style={{ color: tl }}>آراء العملاء</span>
        </div>
        <div className="sp__nav-btns">
          <span className="sp__btn-outline" style={{ color: t, borderColor: tl }}>تسجيل دخول</span>
          <span className="sp__btn-fill" style={{ background: p, color: bg }}>احجز الآن</span>
        </div>
      </div>

      {/* Hero */}
      <div className="sp__hero" style={{ background: `linear-gradient(135deg, ${s}dd, ${s}aa)` }}>
        <div className="sp__hero-badge" style={{ background: `${tl}33`, color: '#fff' }}>
          <span style={{ background: p, width: 6, height: 6, borderRadius: '50%', display: 'inline-block' }}></span>
          برنامج تدريب شخصي
        </div>
        <h2 style={{ color: '#fff' }}>استثمر في نفسك، واصنع النسخة الأفضل</h2>
        <p style={{ color: p }}>رحلتك نحو جسم قوي وثقة لا تهتز</p>
        <div className="sp__hero-btns">
          <span className="sp__btn-fill" style={{ background: p, color: s }}>← ابدأ الآن</span>
          <span className="sp__btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>▷ استكشف</span>
        </div>
        <div className="sp__hero-stats">
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 16px' }}>
            <strong style={{ color: p }}>+200</strong>
            <span style={{ color: '#ddd', fontSize: 9 }}>متدرب</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 16px' }}>
            <strong style={{ color: p }}>4+</strong>
            <span style={{ color: '#ddd', fontSize: 9 }}>سنوات</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 16px' }}>
            <strong style={{ color: p }}>98%</strong>
            <span style={{ color: '#ddd', fontSize: 9 }}>نجاح</span>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="sp__about" style={{ background: bg }}>
        <span className="sp__tag" style={{ color: tl, borderColor: `${tl}33` }}>من نحن</span>
        <h3 style={{ color: t }}>فريق RanLogic <span style={{ color: p }}>مدربون معتمدون</span></h3>
        <p style={{ color: tl }}>نصمم برامج تدريبية وغذائية مخصصة تناسب أهدافك وأسلوب حياتك</p>
        <div className="sp__features">
          <div style={{ background: a, borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ color: p, fontSize: 16 }}>🏋️</div>
            <span style={{ color: t, fontSize: 9 }}>تدريب شخصي</span>
          </div>
          <div style={{ background: a, borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ color: p, fontSize: 16 }}>🥗</div>
            <span style={{ color: t, fontSize: 9 }}>أنظمة غذائية</span>
          </div>
          <div style={{ background: a, borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ color: p, fontSize: 16 }}>📊</div>
            <span style={{ color: t, fontSize: 9 }}>متابعة مستمرة</span>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="sp__testi" style={{ background: s }}>
        <span className="sp__tag" style={{ color: '#ccc', borderColor: '#444' }}>
          <span style={{ background: p, width: 5, height: 5, borderRadius: '50%', display: 'inline-block' }}></span>
          آراء المتدربين
        </span>
        <h3 style={{ color: '#fff' }}>قصص نجاح ملهمة</h3>
        <div className="sp__testi-cards">
          <div style={{ background: bg, borderRadius: 8, padding: 10 }}>
            <div style={{ color: p, fontSize: 10 }}>★★★★★</div>
            <p style={{ color: t, fontSize: 9, margin: '4px 0' }}>تجربتي كانت ممتازة جداً، النتائج بدأت تظهر بشكل ملحوظ</p>
            <span style={{ color: tl, fontSize: 8 }}>— سارة</span>
          </div>
          <div style={{ background: bg, borderRadius: 8, padding: 10 }}>
            <div style={{ color: p, fontSize: 10 }}>★★★★★</div>
            <p style={{ color: t, fontSize: 9, margin: '4px 0' }}>الكوتش غيرت حياتي كلياً، خسرت 12 كيلو بـ 3 شهور</p>
            <span style={{ color: tl, fontSize: 8 }}>— ليلى</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="sp__cta" style={{ background: a }}>
        <h3 style={{ color: t }}>مستعد <span style={{ color: p }}>لتبدأ تحولك</span>؟</h3>
        <p style={{ color: tl }}>انضم إلى أكثر من 200 متدرب حققوا أهدافهم</p>
        <span className="sp__btn-fill sp__btn-lg" style={{ background: p, color: s }}>→ احجز الآن</span>
        <div className="sp__cta-icons">
          <span style={{ color: p, opacity: 0.5 }}>💪</span>
          <span style={{ color: p, opacity: 0.3 }}>⭐</span>
          <span style={{ color: p, opacity: 0.4 }}>🔥</span>
        </div>
      </div>

      {/* Footer */}
      <div className="sp__footer" style={{ background: s }}>
        <div className="sp__footer-top">
          <div>
            <div style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}><span style={{ color: p }}>Ran</span>Logic</div>
            <p style={{ color: '#999', fontSize: 8, marginTop: 4 }}>خبراء في اللياقة والتغذية</p>
          </div>
          <div className="sp__footer-links">
            <span style={{ color: '#999', fontSize: 8 }}>الرئيسية</span>
            <span style={{ color: '#999', fontSize: 8 }}>سياسة الخصوصية</span>
            <span style={{ color: '#999', fontSize: 8 }}>شروط الاستخدام</span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: 6, textAlign: 'center' }}>
          <span style={{ color: '#555', fontSize: 7 }}>© 2026 RanLogic. جميع الحقوق محفوظة</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const SiteColors = () => {
  const [colors, setColors] = useState({});
  const [original, setOriginal] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const loadColors = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await siteColorsApi.getAll();
      if (res.success) { setColors(res.data); setOriginal(res.data); setHasChanges(false); }
    } catch {
      Swal.fire({ title: 'خطأ', text: 'فشل تحميل الألوان', icon: 'error', confirmButtonColor: '#e91e63' });
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadColors(); }, [loadColors]);

  const handleChange = (key, value) => {
    setColors(prev => {
      const next = { ...prev, [key]: value };
      setHasChanges(JSON.stringify(next) !== JSON.stringify(original));
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await siteColorsApi.update(colors);
      if (res.success) {
        setOriginal(res.data); setHasChanges(false);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: res.message, showConfirmButton: false, timer: 2500, timerProgressBar: true });
      }
    } catch (err) {
      Swal.fire({ title: 'خطأ', icon: 'error', confirmButtonColor: '#e91e63', text: err.response?.data?.message || 'فشل حفظ الألوان' });
    } finally { setIsSaving(false); }
  };

  const handleReset = async () => {
    const r = await Swal.fire({ title: 'إعادة الألوان الافتراضية', text: 'سيتم إرجاع جميع الألوان للقيم الافتراضية', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e91e63', cancelButtonColor: '#607d8b', confirmButtonText: 'نعم', cancelButtonText: 'إلغاء', reverseButtons: true });
    if (!r.isConfirmed) return;
    try {
      const res = await siteColorsApi.reset();
      if (res.success) { setColors(res.data); setOriginal(res.data); setHasChanges(false); Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'تم إعادة الألوان', showConfirmButton: false, timer: 2000 }); }
    } catch { Swal.fire({ title: 'خطأ', text: 'فشل', icon: 'error', confirmButtonColor: '#e91e63' }); }
  };

  const handleCopy = (val) => Swal.fire({ toast: true, position: 'top-end', icon: 'info', title: `تم نسخ ${val}`, showConfirmButton: false, timer: 1200 });
  const handleDiscard = () => { setColors(original); setHasChanges(false); };

  if (isLoading) return <div className="sc sc--loading"><RefreshCw size={28} className="sc-spin" /><p>جاري تحميل الألوان...</p></div>;

  return (
    <div className="sc">

      {/* Header */}
      <div className="sc__header">
        <div className="sc__header-right">
          <div className="sc__header-icon"><Palette size={22} /></div>
          <div><h1 className="sc__title">ألوان الموقع</h1><p className="sc__sub">تخصيص مظهر الموقع بالكامل</p></div>
        </div>
        <div className="sc__actions">
          <button className="sc-btn sc-btn--ghost" onClick={handleReset}><RotateCcw size={15} /> الافتراضي</button>
          {hasChanges && <button className="sc-btn sc-btn--ghost" onClick={handleDiscard}>تراجع</button>}
          <button className="sc-btn sc-btn--primary" onClick={handleSave} disabled={isSaving || !hasChanges}>
            {isSaving ? <RefreshCw size={15} className="sc-spin" /> : <Save size={15} />}
            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

          {/* Banner */}
      <motion.div className="sc__banner" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="sc__banner-top">
          <div className="sc__banner-badge"><Sparkles size={16} /> حصري</div>
          <h3>هذه الصفحة صُممت خصيصاً وحصرياً لكِ 🎨</h3>
          <p className="sc__banner-desc">تحكّمي بمظهر موقعك بالكامل من مكان واحد — الألوان، الأزرار، الخلفيات، النصوص. كل تغيير بيظهر فوراً بالمعاينة، وبيتطبّق على الموقع الحقيقي بعد الحفظ.</p>
        </div>

        <div className="sc__banner-divider" />

        <div className="sc__banner-section">
          <h4><Palette size={14} /> كيف تغيّري الألوان؟</h4>
          <div className="sc__steps">
            <div className="sc__step"><span>1</span><div><strong>اختاري اللون</strong><small>اضغطي على المربع الملون لفتح منتقي الألوان</small></div></div>
            <div className="sc__step"><span>2</span><div><strong>أو الصقي كود</strong><small>انسخي كود HEX من أي موقع والصقيه بالحقل</small></div></div>
            <div className="sc__step"><span>3</span><div><strong>شوفي النتيجة</strong><small>المعاينة بتتحدث فوراً — شوفي الشكل قبل الحفظ</small></div></div>
            <div className="sc__step"><span>4</span><div><strong>احفظي التغييرات</strong><small>اضغطي "حفظ" وبيتطبق على الموقع مباشرة</small></div></div>
          </div>
        </div>

        <div className="sc__banner-divider" />

        <div className="sc__banner-section">
          <h4><Info size={14} /> نصائح مهمة</h4>
          <div className="sc__tips">
            <div className="sc__tip"><span className="sc__tip-dot sc__tip-dot--green" />الألوان بتتغير على كل صفحات الموقع تلقائياً</div>
            <div className="sc__tip"><span className="sc__tip-dot sc__tip-dot--blue" />جرّبي ألوان متناسقة — المواقع المقترحة تحت بتساعدك</div>
            <div className="sc__tip"><span className="sc__tip-dot sc__tip-dot--orange" />إذا مش عاجبك النتيجة، اضغطي "الافتراضي" لإرجاع كل شي</div>
            <div className="sc__tip"><span className="sc__tip-dot sc__tip-dot--pink" />اللون الرئيسي هو الأهم — بيأثر على الأزرار والعناوين المميزة</div>
          </div>
        </div>
        <div className="sc__banner-divider" />

        <div className="sc__banner-section">
          <h4><Globe size={14} /> مواقع مقترحة لاختيار الألوان</h4>
          <p className="sc__banner-sites-hint">انسخي أي لون عجبك من هالمواقع والصقيه بالحقل مباشرة</p>
          <div className="sc__sites-grid">
            {SUGGESTED_SITES.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="sc__site-chip">
                <span className="sc__site-emoji">{s.emoji}</span>
                <div>
                  <div className="sc__site-name">{s.name} <ExternalLink size={10} /></div>
                  <div className="sc__site-desc">{s.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Two columns: colors + preview */}
      <div className="sc__main">

        {/* Colors */}
        <motion.div className="sc__colors" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="sc__section-head"><Palette size={16} /><span>اختيار الألوان</span></div>
          <div className="sc__colors-grid">
            {COLOR_ITEMS.map(ci => (
              <ColorCard key={ci.key} colorKey={ci.key} label={ci.label} hint={ci.hint} value={colors[ci.key] || '#000'} onChange={handleChange} onCopy={handleCopy} />
            ))}
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div className="sc__preview-wrap" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="sc__section-head"><Eye size={16} /><span>المعاينة المباشرة</span></div>
          <SitePreview c={colors} />
        </motion.div>
      </div>


      {/* Floating save */}
      {hasChanges && (
        <motion.div className="sc__float" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <span>لديك تغييرات غير محفوظة</span>
          <div className="sc__float-btns">
            <button className="sc-btn sc-btn--ghost" onClick={handleDiscard}>تراجع</button>
            <button className="sc-btn sc-btn--primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <RefreshCw size={14} className="sc-spin" /> : <Save size={14} />} حفظ
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SiteColors;
