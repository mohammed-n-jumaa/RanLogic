import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Upload, Play, Pause, Save, Plus, Trash2, Edit2, Check,
  Languages, Globe, Layout, MousePointerClick, ExternalLink, Image,
  Monitor, Sparkles, Columns, ChevronDown, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import heroApi from '../../../api/heroApi';
import './HeroSection.scss';

const DESIGN_TABS = [
  { key: 'classic',   label: 'الكلاسيكي',   labelEn: 'Classic',   icon: Monitor,  desc: 'فيديو خلفية' },
  { key: 'cinematic', label: 'السينمائي',    labelEn: 'Cinematic', icon: Sparkles, desc: 'سلايدر صور' },
  { key: 'split',     label: 'Card Stack',   labelEn: 'Card Stack',icon: Columns,  desc: 'كاردات متراصة' },
  { key: 'mosaic',    label: 'الموزاييك',    labelEn: 'Mosaic',    icon: Sparkles, desc: 'صور متفتتة' },
  { key: 'cube',      label: 'المكعب',       labelEn: '3D Cube',   icon: Columns,  desc: 'مكعب ثلاثي الأبعاد' },
  { key: 'filmreel',  label: 'الشريط',       labelEn: 'Film Reel', icon: Monitor,  desc: 'شريط سينمائي' },
];

const TARGET_OPTIONS = [
  { type: 'page', value: '/auth',              label: 'تسجيل / Login' },
  { type: 'page', value: '/faq',               label: 'الأسئلة / FAQ' },
  { type: 'page', value: '/calorie-calculator', label: 'حاسبة السعرات' },
  { type: 'page', value: '/meal-calculator',    label: 'حاسبة الوجبات' },
  { type: 'page', value: '/contact',            label: 'اتصل بنا' },
  { type: 'section', value: 'about',            label: '⬇ عن المدرب' },
  { type: 'section', value: 'certifications',   label: '⬇ الشهادات' },
  { type: 'section', value: 'testimonials',     label: '⬇ آراء المتدربين' },
  { type: 'section', value: 'faq',              label: '⬇ الأسئلة' },
  { type: 'section', value: 'cta',              label: '⬇ ابدأ الآن' },
];

const emptyContent = () => ({
  badge_en: '', badge_ar: '', main_title_en: '', main_title_ar: '',
  sub_title_en: '', sub_title_ar: '', description_en: '', description_ar: '',
});

const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeDesignTab, setActiveDesignTab] = useState('classic');
  const [activeDesignType, setActiveDesignType] = useState('classic');
  const [langTab, setLangTab] = useState('ar');

  // Per-design data
const [designs, setDesigns] = useState({
    classic:   { content: emptyContent(), stats: [], cta_buttons: [], slides: null },
    cinematic: { content: emptyContent(), stats: [], cta_buttons: [], slides: [] },
    split:     { content: emptyContent(), stats: [], cta_buttons: [], slides: [] },
    mosaic:    { content: emptyContent(), stats: [], cta_buttons: [], slides: [] },
    cube:      { content: emptyContent(), stats: [], cta_buttons: [], slides: [] },
    filmreel:  { content: emptyContent(), stats: [], cta_buttons: [], slides: [] },
  });

  // Classic video
  const [videoPreview, setVideoPreview] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const slideInputRef = useRef(null);

  const [editingStat, setEditingStat] = useState(null);
  const [editingCta, setEditingCta] = useState(null);
  const [editingSlide, setEditingSlide] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await heroApi.getHeroSection();
      if (res.success) {
        const d = res.data;
        setActiveDesignType(d.design_type || 'classic');
        setVideoPreview(d.video_url);
        setDesigns({
          classic:   d.designs?.classic   || { content: emptyContent(), stats: [], cta_buttons: [], slides: null },
          cinematic: d.designs?.cinematic || { content: emptyContent(), stats: [], cta_buttons: [], slides: [] },
          split:     d.designs?.split     || { content: emptyContent(), stats: [], cta_buttons: [], slides: [] },
          mosaic:    d.designs?.mosaic    || { content: emptyContent(), stats: [], cta_buttons: [], slides: [] },
          cube:      d.designs?.cube      || { content: emptyContent(), stats: [], cta_buttons: [], slides: [] },
          filmreel:  d.designs?.filmreel  || { content: emptyContent(), stats: [], cta_buttons: [], slides: [] },
        });
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  // ── Helpers ──
  const curDesign = designs[activeDesignTab];
  const setCurDesign = (updater) => {
    setDesigns(prev => ({ ...prev, [activeDesignTab]: typeof updater === 'function' ? updater(prev[activeDesignTab]) : updater }));
  };
  const updateContent = (field, value) => {
    setCurDesign(d => ({ ...d, content: { ...d.content, [field]: value } }));
  };
  const isAr = langTab === 'ar';

  // ── Save ──
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        design_key: activeDesignTab,
        design_type: activeDesignType,
        content: curDesign.content,
        stats: (curDesign.stats || []).map((s, i) => ({ ...s, order: i })),
        cta_buttons: (curDesign.cta_buttons || []).map((b, i) => ({ ...b, order: i })),
      };
      const res = await heroApi.updateHeroSection(payload);
      if (res.success) {
        Swal.fire({ title: 'نجح', text: 'تم الحفظ بنجاح', icon: 'success', timer: 2000, showConfirmButton: false });
        await fetchData();
        setEditingStat(null);
        setEditingCta(null);
      }
    } catch (e) {
      Swal.fire({ title: 'خطأ', text: e.response?.data?.message || 'فشل الحفظ', icon: 'error', confirmButtonColor: '#e91e63' });
    } finally { setIsSaving(false); }
  };

  // ── Video ──
  const handleVideoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadProgress(0);
      const res = await heroApi.uploadVideo(file, (p) => setUploadProgress(p));
      if (res.success) {
        setVideoPreview(res.data.video_url);
        Swal.fire({ title: 'نجح', text: 'تم رفع الفيديو', icon: 'success', timer: 2000, showConfirmButton: false });
      }
    } catch (e) {
      Swal.fire({ title: 'خطأ', text: 'فشل رفع الفيديو', icon: 'error', confirmButtonColor: '#e91e63' });
    } finally { setUploadProgress(0); }
  };

  const handleDeleteVideo = async () => {
    const r = await Swal.fire({ title: 'تأكيد', text: 'حذف الفيديو؟', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e91e63', confirmButtonText: 'احذف', cancelButtonText: 'إلغاء' });
    if (!r.isConfirmed) return;
    try {
      await heroApi.deleteVideo();
      setVideoPreview(null);
      Swal.fire({ title: 'تم', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (e) { Swal.fire({ title: 'خطأ', icon: 'error' }); }
  };

  // ── Slides ──
  const handleSlideUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await heroApi.uploadSlide(activeDesignTab, file);
      if (res.success) {
        await fetchData();
        Swal.fire({ title: 'نجح', text: 'تم رفع الصورة', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    } catch (e) {
      Swal.fire({ title: 'خطأ', text: 'فشل رفع الصورة', icon: 'error' });
    }
    if (slideInputRef.current) slideInputRef.current.value = '';
  };

  const handleDeleteSlide = async (id) => {
    const r = await Swal.fire({ title: 'تأكيد', text: 'حذف السلايد؟', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e91e63', confirmButtonText: 'احذف', cancelButtonText: 'إلغاء' });
    if (!r.isConfirmed) return;
    try {
      await heroApi.deleteSlide(id);
      await fetchData();
    } catch (e) { console.error(e); }
  };

  const handleUpdateSlide = async (id) => {
    const slide = (curDesign.slides || []).find(s => s.id === id);
    if (!slide) return;
    try {
      await heroApi.updateSlide(id, {
        main_title_en: slide.main_title_en, main_title_ar: slide.main_title_ar,
        sub_title_en: slide.sub_title_en, sub_title_ar: slide.sub_title_ar,
        description_en: slide.description_en, description_ar: slide.description_ar,
      });
      setEditingSlide(null);
      Swal.fire({ title: 'نجح', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (e) { console.error(e); }
  };

  const updateSlideField = (slideId, field, value) => {
    setCurDesign(d => ({
      ...d,
      slides: (d.slides || []).map(s => s.id === slideId ? { ...s, [field]: value } : s),
    }));
  };

  // ── Content fields for current lang ──
  const contentFields = [
    { key: `badge_${langTab}`,      label: isAr ? 'الشارة العلوية'    : 'Top Badge',   ph: isAr ? 'برنامج تدريبي' : 'Training Program' },
    { key: `main_title_${langTab}`, label: isAr ? 'العنوان الرئيسي'   : 'Main Title',  ph: isAr ? 'درّب جسمك بثقة' : 'Train Your Body' },
    { key: `sub_title_${langTab}`,  label: isAr ? 'العنوان الفرعي'    : 'Sub Title',   ph: isAr ? 'برنامج مصمم لك'  : 'Designed for you', accent: true },
  ];

  if (isLoading) {
    return <div className="hs"><div className="hs__loader"><div className="hs__loader-spin" /><span>جاري التحميل...</span></div></div>;
  }

  return (
    <div className="hs">
      {/* ── Top Bar ── */}
      <div className="hs__topbar">
        <div>
          <h1 className="hs__title">إدارة الهيرو سيكشن</h1>
          <p className="hs__desc">إدارة 3 تصاميم مختلفة — التصميم النشط هو الظاهر بالموقع</p>
        </div>
        <motion.button className="hs__save" onClick={handleSave} disabled={isSaving} whileTap={{ scale: 0.97 }}>
          {isSaving ? <><div className="hs__spinner" /><span>جاري الحفظ...</span></> : <><Save size={16} /><span>حفظ التغييرات</span></>}
        </motion.button>
      </div>

      {/* ── Upload Progress ── */}
      <AnimatePresence>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <motion.div className="hs__progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="hs__progress-fill" style={{ width: `${uploadProgress}%` }} />
            <span className="hs__progress-pct">{uploadProgress}%</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ Design Tabs ══ */}
      <div className="hs__design-tabs">
        {DESIGN_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDesignTab === tab.key;
          const isLive = activeDesignType === tab.key;
          return (
            <button
              key={tab.key}
              className={`hs__design-tab ${isActive ? 'hs__design-tab--active' : ''}`}
              onClick={() => { setActiveDesignTab(tab.key); setEditingStat(null); setEditingCta(null); setEditingSlide(null); }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span className="hs__design-tab-en">{tab.labelEn}</span>
              {isLive && <span className="hs__design-tab-live">ACTIVE</span>}
            </button>
          );
        })}
      </div>

      {/* ── Activate button ── */}
      {activeDesignType !== activeDesignTab && (
        <motion.button
          className="hs__activate-btn"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setActiveDesignType(activeDesignTab)}
        >
          <Sparkles size={14} />
          تفعيل هذا التصميم كالتصميم الرئيسي
        </motion.button>
      )}

      {/* ══ Main Grid ══ */}
      <div className="hs__grid">
        {/* ═══ COL 1: Content + Stats + CTA ═══ */}
        <motion.div className="hs__col" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} key={activeDesignTab}>

          {/* Language Tabs */}
          <div className="hs__lang">
            <button className={`hs__lang-tab ${langTab === 'ar' ? 'hs__lang-tab--on' : ''}`} onClick={() => setLangTab('ar')}>
              <Globe size={15} /> العربية
            </button>
            <button className={`hs__lang-tab ${langTab === 'en' ? 'hs__lang-tab--on' : ''}`} onClick={() => setLangTab('en')}>
              <Languages size={15} /> English
            </button>
          </div>

          {/* Content Form */}
          <div className="hs__form" dir={isAr ? 'rtl' : 'ltr'}>
            {contentFields.map((f) => (
              <div className="hs__field" key={f.key}>
                <label className="hs__label">{f.label}</label>
                <input
                  type="text"
                  className={`hs__input ${f.accent ? 'hs__input--accent' : ''}`}
                  value={curDesign.content[f.key] || ''}
                  onChange={(e) => updateContent(f.key, e.target.value)}
                  placeholder={f.ph}
                />
              </div>
            ))}
            <div className="hs__field">
              <label className="hs__label">{isAr ? 'الوصف' : 'Description'}</label>
              <textarea
                className="hs__textarea"
                value={curDesign.content[`description_${langTab}`] || ''}
                onChange={(e) => updateContent(`description_${langTab}`, e.target.value)}
                placeholder={isAr ? 'أدخل الوصف...' : 'Enter description...'}
                rows="3"
              />
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="hs__stats">
            <div className="hs__stats-head">
              <span className="hs__stats-title">الإحصائيات</span>
              <button className="hs__stats-add" onClick={() => {
                setCurDesign(d => ({ ...d, stats: [...(d.stats || []), { id: null, value: '', label_en: '', label_ar: '' }] }));
                setEditingStat((curDesign.stats || []).length);
              }}>
                <Plus size={15} /> إضافة
              </button>
            </div>
            <div className="hs__stats-list">
              {(curDesign.stats || []).map((stat, i) => (
                <div key={i} className={`hs__stat ${editingStat === i ? 'hs__stat--edit' : ''}`}>
                  {editingStat === i ? (
                    <div className="hs__stat-form">
                      <input className="hs__stat-val-input" value={stat.value} onChange={(e) => { const u = [...curDesign.stats]; u[i] = { ...u[i], value: e.target.value }; setCurDesign(d => ({ ...d, stats: u })); }} placeholder="500+" />
                      <input className="hs__stat-lbl-input" value={stat.label_ar} onChange={(e) => { const u = [...curDesign.stats]; u[i] = { ...u[i], label_ar: e.target.value }; setCurDesign(d => ({ ...d, stats: u })); }} placeholder="عربي" dir="rtl" />
                      <input className="hs__stat-lbl-input" value={stat.label_en} onChange={(e) => { const u = [...curDesign.stats]; u[i] = { ...u[i], label_en: e.target.value }; setCurDesign(d => ({ ...d, stats: u })); }} placeholder="English" dir="ltr" />
                      <button className="hs__stat-ok" onClick={() => setEditingStat(null)}><Check size={16} /></button>
                    </div>
                  ) : (
                    <div className="hs__stat-row">
                      <div className="hs__stat-num">{stat.value}</div>
                      <div className="hs__stat-labels"><span className="hs__stat-ar">{stat.label_ar}</span><span className="hs__stat-en">{stat.label_en}</span></div>
                      <div className="hs__stat-acts">
                        <button className="hs__stat-btn" onClick={() => setEditingStat(i)}><Edit2 size={14} /></button>
                        <button className="hs__stat-btn hs__stat-btn--del" onClick={() => setCurDesign(d => ({ ...d, stats: d.stats.filter((_, j) => j !== i) }))}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {(curDesign.stats || []).length === 0 && <div className="hs__stats-empty"><p>لا توجد إحصائيات</p></div>}
            </div>
          </div>

          {/* ── CTA Buttons ── */}
          <div className="hs__cta">
            <div className="hs__stats-head">
              <span className="hs__stats-title"><MousePointerClick size={14} /> أزرار CTA</span>
              <button className="hs__stats-add" onClick={() => {
                setCurDesign(d => ({ ...d, cta_buttons: [...(d.cta_buttons || []), { id: null, label_en: '', label_ar: '', style: 'primary', target_type: 'page', target_value: '/auth' }] }));
                setEditingCta((curDesign.cta_buttons || []).length);
              }}>
                <Plus size={15} /> إضافة
              </button>
            </div>
            <div className="hs__stats-list">
              {(curDesign.cta_buttons || []).map((btn, i) => (
                <div key={i} className={`hs__stat ${editingCta === i ? 'hs__stat--edit' : ''}`}>
                  {editingCta === i ? (
                    <div className="hs__cta-form">
                      <div className="hs__cta-row">
                        <input className="hs__stat-lbl-input" value={btn.label_ar} onChange={(e) => { const u = [...curDesign.cta_buttons]; u[i] = { ...u[i], label_ar: e.target.value }; setCurDesign(d => ({ ...d, cta_buttons: u })); }} placeholder="عربي: ابدأ الآن" dir="rtl" />
                        <input className="hs__stat-lbl-input" value={btn.label_en} onChange={(e) => { const u = [...curDesign.cta_buttons]; u[i] = { ...u[i], label_en: e.target.value }; setCurDesign(d => ({ ...d, cta_buttons: u })); }} placeholder="EN: Start Now" dir="ltr" />
                      </div>
                      <div className="hs__cta-row">
                        <select className="hs__cta-select" value={btn.style} onChange={(e) => { const u = [...curDesign.cta_buttons]; u[i] = { ...u[i], style: e.target.value }; setCurDesign(d => ({ ...d, cta_buttons: u })); }}>
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                        </select>
                        <select className="hs__cta-select" value={`${btn.target_type}::${btn.target_value}`} onChange={(e) => { const [t, v] = e.target.value.split('::'); const u = [...curDesign.cta_buttons]; u[i] = { ...u[i], target_type: t, target_value: v }; setCurDesign(d => ({ ...d, cta_buttons: u })); }}>
                          {TARGET_OPTIONS.map(t => <option key={`${t.type}::${t.value}`} value={`${t.type}::${t.value}`}>{t.label}</option>)}
                        </select>
                      </div>
                      <button className="hs__stat-ok" onClick={() => setEditingCta(null)}><Check size={16} /></button>
                    </div>
                  ) : (
                    <div className="hs__stat-row">
                      <div className="hs__stat-num" style={{ fontSize: '0.7rem' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: btn.style === 'primary' ? 'rgba(253,184,19,0.2)' : 'rgba(255,255,255,0.1)', color: btn.style === 'primary' ? '#FDB813' : '#aaa', fontSize: '0.6rem', fontWeight: 600 }}>{btn.style}</span>
                      </div>
                      <div className="hs__stat-labels">
                        <span className="hs__stat-ar">{btn.label_ar || '—'}</span>
                        <span className="hs__stat-en">{btn.label_en || '—'}</span>
                        <span style={{ fontSize: '0.55rem', color: '#888', display: 'flex', alignItems: 'center', gap: 3 }}><ExternalLink size={10} />{btn.target_type === 'section' ? `#${btn.target_value}` : btn.target_value}</span>
                      </div>
                      <div className="hs__stat-acts">
                        <button className="hs__stat-btn" onClick={() => setEditingCta(i)}><Edit2 size={14} /></button>
                        <button className="hs__stat-btn hs__stat-btn--del" onClick={() => setCurDesign(d => ({ ...d, cta_buttons: d.cta_buttons.filter((_, j) => j !== i) }))}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {(curDesign.cta_buttons || []).length === 0 && <div className="hs__stats-empty"><p>لا توجد أزرار — سيتم استخدام الافتراضية</p></div>}
            </div>
          </div>

        </motion.div>

        {/* ═══ COL 2: Media ═══ */}
        <motion.div className="hs__col" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} key={`media-${activeDesignTab}`}>

          {/* Classic → Video */}
          {activeDesignTab === 'classic' && (
            <>
              <div className="hs__vid-label"><Video size={15} /> فيديو الخلفية</div>
              {!videoPreview ? (
                <div className="hs__dropzone" onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept="video/*" onChange={handleVideoSelect} hidden />
                  <Upload size={28} />
                  <p className="hs__dropzone-txt">اسحب الفيديو أو <span>تصفح</span></p>
                  <div className="hs__dropzone-meta"><span>MP4, WEBM</span><span className="hs__dot" /><span>أقصى 50MB</span></div>
                </div>
              ) : (
                <div className="hs__player">
                  <div className="hs__player-wrap">
                    <video ref={videoRef} src={videoPreview} className="hs__player-video" loop muted playsInline />
                    <div className="hs__player-overlay" onClick={() => { videoRef.current?.[isVideoPlaying ? 'pause' : 'play'](); setIsVideoPlaying(!isVideoPlaying); }}>
                      <button className="hs__play-btn">{isVideoPlaying ? <Pause size={24} /> : <Play size={24} />}</button>
                    </div>
                  </div>
                  <div className="hs__player-bar">
                    <button className="hs__player-act" onClick={() => fileInputRef.current?.click()}><Upload size={15} /> تغيير</button>
                    <button className="hs__player-act hs__player-act--del" onClick={handleDeleteVideo}><Trash2 size={15} /> حذف</button>
                    <input ref={fileInputRef} type="file" accept="video/*" onChange={handleVideoSelect} hidden />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Cinematic / Split → Slide Manager */}
          {activeDesignTab !== 'classic' && (
            <>
              <div className="hs__vid-label"><Image size={15} /> سلايدر الصور</div>
              <div className="hs__slides">
                <button className="hs__slide-add" onClick={() => slideInputRef.current?.click()}>
                  <Plus size={18} />
                  <span>إضافة صورة</span>
                </button>
                <input ref={slideInputRef} type="file" accept="image/*" onChange={handleSlideUpload} hidden />

                {(curDesign.slides || []).map((slide) => (
                  <div key={slide.id} className="hs__slide-card">
                    <div className="hs__slide-img-wrap">
                      <img src={slide.image_url} alt={slide.image_name} className="hs__slide-img" />
                      <button className="hs__slide-del" onClick={() => handleDeleteSlide(slide.id)}><X size={14} /></button>
                    </div>

                    {editingSlide === slide.id ? (
                      <div className="hs__slide-edit">
                        <input className="hs__stat-lbl-input" value={slide.main_title_ar || ''} onChange={(e) => updateSlideField(slide.id, 'main_title_ar', e.target.value)} placeholder="العنوان بالعربي" dir="rtl" />
                        <input className="hs__stat-lbl-input" value={slide.main_title_en || ''} onChange={(e) => updateSlideField(slide.id, 'main_title_en', e.target.value)} placeholder="Title EN" dir="ltr" />
                        <input className="hs__stat-lbl-input" value={slide.sub_title_ar || ''} onChange={(e) => updateSlideField(slide.id, 'sub_title_ar', e.target.value)} placeholder="الفرعي بالعربي" dir="rtl" />
                        <input className="hs__stat-lbl-input" value={slide.sub_title_en || ''} onChange={(e) => updateSlideField(slide.id, 'sub_title_en', e.target.value)} placeholder="Subtitle EN" dir="ltr" />
                        <textarea className="hs__textarea" value={slide.description_ar || ''} onChange={(e) => updateSlideField(slide.id, 'description_ar', e.target.value)} placeholder="الوصف بالعربي" dir="rtl" rows="2" />
                        <textarea className="hs__textarea" value={slide.description_en || ''} onChange={(e) => updateSlideField(slide.id, 'description_en', e.target.value)} placeholder="Description EN" dir="ltr" rows="2" />
                        <div className="hs__slide-actions">
                          <button className="hs__stat-ok" onClick={() => handleUpdateSlide(slide.id)}><Check size={14} /> حفظ</button>
                          <button className="hs__stat-btn" onClick={() => setEditingSlide(null)}><X size={14} /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="hs__slide-info" onClick={() => setEditingSlide(slide.id)}>
                        <div className="hs__slide-title">{slide.main_title_ar || slide.main_title_en || 'بدون عنوان'}</div>
                        <div className="hs__slide-sub">{slide.sub_title_ar || slide.sub_title_en || ''}</div>
                        <span className="hs__slide-edit-hint"><Edit2 size={11} /> تعديل النصوص</span>
                      </div>
                    )}
                  </div>
                ))}

                {(curDesign.slides || []).length === 0 && (
                  <div className="hs__stats-empty"><p>لا توجد صور — أضف صور للسلايدر</p></div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
