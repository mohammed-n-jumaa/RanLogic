import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Upload, Save, Check, AlertCircle, Plus,
  Edit2, Trash2, Star, X, Languages, Globe, Image as ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';
import testimonialsApi from '../../../api/testimonialsApi';
import './Testimonials.scss';
import { t } from '../../../i18n';

const Testimonials = () => {
  const [activeTab, setActiveTab] = useState('ar');
  const [designType, setDesignType] = useState('classic');

  const [sectionEn, setSectionEn] = useState({ badge: '', title: '', description: '' });
  const [sectionAr, setSectionAr] = useState({ badge: '', title: '', description: '' });

  const [testimonials, setTestimonials] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRefs = useRef({});

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response = await testimonialsApi.getAll();
      if (response.success && response.data) {
        const { section, testimonials: items } = response.data;
        if (section) {
          setSectionEn({ badge: section.badge_en || '', title: section.title_en || '', description: section.description_en || '' });
          setSectionAr({ badge: section.badge_ar || '', title: section.title_ar || '', description: section.description_ar || '' });
        }
        setTestimonials(items || []);
        if (response.design_type) setDesignType(response.design_type);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      Swal.fire({ title: t('خطأ'), text: t('فشل تحميل البيانات'), icon: 'error', confirmButtonColor: '#e91e63' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesignChange = async (type) => {
    const prev = designType;
    setDesignType(type);
    try {
      await testimonialsApi.updateDesignType(type);
      Swal.fire({ title: t('نجح'), text: t('تم تحديث التصميم'), icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      setDesignType(prev);
      Swal.fire({ title: t('خطأ'), text: t('فشل تحديث التصميم'), icon: 'error', confirmButtonColor: '#e91e63' });
    }
  };

  const handleAddTestimonial = () => {
    setTestimonials([...testimonials, { id: null, name_en: '', name_ar: '', title_en: '', title_ar: '', text_en: '', text_ar: '', rating: 5, image: null }]);
    setEditingTestimonial(testimonials.length);
  };

  const handleUpdateTestimonial = (index, field, value) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  const handleDeleteTestimonial = async (index) => {
    const result = await Swal.fire({ title: t('تأكيد الحذف'), text: t('هل أنت متأكد من حذف هذا الرأي؟'), icon: 'warning', showCancelButton: true, confirmButtonColor: '#e91e63', cancelButtonColor: '#607d8b', confirmButtonText: t('نعم، احذف'), cancelButtonText: t('إلغاء') });
    if (!result.isConfirmed) return;
    setTestimonials(testimonials.filter((_, i) => i !== index));
    Swal.fire({ title: t('تم الحذف'), text: t('تم حذف الرأي بنجاح'), icon: 'success', timer: 2000, showConfirmButton: false });
  };

  const handleImageSelect = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { Swal.fire({ title: t('خطأ'), text: t('يرجى اختيار ملف صورة صالح'), icon: 'error', confirmButtonColor: '#e91e63' }); return; }
    if (file.size > 5 * 1024 * 1024) { Swal.fire({ title: t('خطأ'), text: t('حجم الصورة يجب أن لا يتجاوز 5MB'), icon: 'error', confirmButtonColor: '#e91e63' }); return; }

    const reader = new FileReader();
    reader.onloadend = () => { handleUpdateTestimonial(index, 'image', reader.result); };
    reader.readAsDataURL(file);

    const testimonial = testimonials[index];
    if (testimonial.id) {
      try {
        const response = await testimonialsApi.uploadImage(testimonial.id, file);
        if (response.success) {
          handleUpdateTestimonial(index, 'image', response.data.image_url);
          Swal.fire({ title: t('نجح'), text: t('تم رفع الصورة بنجاح'), icon: 'success', timer: 2000, showConfirmButton: false });
        }
      } catch (error) {
        Swal.fire({ title: t('خطأ'), text: t('فشل رفع الصورة'), icon: 'error', confirmButtonColor: '#e91e63' });
      }
    }
  };

  const handleDeleteImage = async (index) => {
    const testimonial = testimonials[index];
    if (testimonial.id) { try { await testimonialsApi.deleteImage(testimonial.id); } catch (e) { console.error(e); } }
    handleUpdateTestimonial(index, 'image', null);
  };

  const handleSaveChanges = async () => {
    if (!sectionEn.title || !sectionAr.title) { Swal.fire({ title: t('تنبيه'), text: t('يرجى ملء عنوان القسم بالعربية والإنجليزية'), icon: 'warning', confirmButtonColor: '#e91e63' }); return; }
    const invalidTestimonial = testimonials.find(tItem => !tItem.name_en || !tItem.name_ar || !tItem.title_en || !tItem.title_ar || !tItem.text_en || !tItem.text_ar);
    if (invalidTestimonial) { Swal.fire({ title: t('تنبيه'), text: t('يرجى ملء جميع حقول الآراء (عربي وإنجليزي)'), icon: 'warning', confirmButtonColor: '#e91e63' }); return; }

    setIsSaving(true);
    try {
      const data = {
        section: { badge_en: sectionEn.badge, badge_ar: sectionAr.badge, title_en: sectionEn.title, title_ar: sectionAr.title, description_en: sectionEn.description, description_ar: sectionAr.description },
        testimonials: testimonials.map((tItem, index) => ({ id: tItem.id, name_en: tItem.name_en, name_ar: tItem.name_ar, title_en: tItem.title_en, title_ar: tItem.title_ar, text_en: tItem.text_en, text_ar: tItem.text_ar, rating: tItem.rating, order: index, is_active: true })),
      };
      const response = await testimonialsApi.updateAll(data);
      if (response.success) {
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 3000);
        Swal.fire({ title: t('نجح'), text: t('تم حفظ جميع التغييرات بنجاح'), icon: 'success', timer: 2000, showConfirmButton: false });
        await fetchTestimonials();
        setEditingTestimonial(null);
      }
    } catch (error) {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      Swal.fire({ title: t('خطأ'), text: error.response?.data?.message || t('فشل حفظ التغييرات'), icon: 'error', confirmButtonColor: '#e91e63' });
    } finally {
      setIsSaving(false);
    }
  };

  const isAr = activeTab === 'ar';
  const section = isAr ? sectionAr : sectionEn;
  const setSection = isAr ? setSectionAr : setSectionEn;

  if (isLoading) {
    return (<div className="tm"><div className="tm__loader"><div className="tm__loader-spin" /><span>{t('جاري تحميل البيانات...')}</span></div></div>);
  }

  return (
    <div className="tm">
      {/* ── Top Bar ── */}
      <div className="tm__topbar">
        <div>
          <h1 className="tm__title">{t('آراء العملاء')}</h1>
          <p className="tm__desc">{t('إدارة تقييمات وآراء العملاء — عربي / English')}</p>
        </div>
        <motion.button className="tm__save" onClick={handleSaveChanges} disabled={isSaving} whileTap={{ scale: 0.97 }}>
          {isSaving ? (<><div className="tm__spinner" /><span>{t('جاري الحفظ...')}</span></>) : (<><Save size={16} /><span>{t('حفظ التغييرات')}</span></>)}
        </motion.button>
      </div>

      {/* ── Design Tabs ── */}
      <div className="tm__design-bar">
        <span className="tm__design-label">{t('تصميم الآراء:')}</span>
        <div className="tm__design-tabs">
          {[
            { key: 'classic', name: t('الكلاسيكي'), en: 'Classic' },
            { key: 'spotlight', name: t('سبوت لايت'), en: 'Spotlight' },
            { key: 'timeline', name: t('تايم لاين'), en: 'Timeline' },
            { key: 'carousel', name: t('كاروسيل'), en: 'Carousel' },
          ].map(d => (
            <button key={d.key} className={`tm__design-tab ${designType === d.key ? 'tm__design-tab--active' : ''}`} onClick={() => handleDesignChange(d.key)}>
              {d.name} <span className="tm__design-tab-en">{d.en}</span>
              {designType === d.key && <span className="tm__design-tab-live">ACTIVE</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Language Tabs ── */}
      <div className="tm__lang">
        <button className={`tm__lang-tab ${activeTab === 'ar' ? 'tm__lang-tab--on' : ''}`} onClick={() => setActiveTab('ar')}><Globe size={15} /> {t('العربية')}</button>
        <button className={`tm__lang-tab ${activeTab === 'en' ? 'tm__lang-tab--on' : ''}`} onClick={() => setActiveTab('en')}><Languages size={15} /> English</button>
      </div>

      {/* ── Section Settings ── */}
      <AnimatePresence mode="wait">
        <motion.div className="tm__section" key={activeTab} initial={{ opacity: 0, x: isAr ? 12 : -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} dir={isAr ? 'rtl' : 'ltr'}>
          <div className="tm__field"><label className="tm__label">{isAr ? t('الشارة (اختياري)') : 'Badge (Optional)'}</label><input type="text" className="tm__input" value={section.badge} onChange={(e) => setSection({ ...section, badge: e.target.value })} placeholder={isAr ? t('آراء المتدربات') : 'Client Testimonials'} /></div>
          <div className="tm__field"><label className="tm__label">{isAr ? t('العنوان *') : 'Title *'}</label><input type="text" className="tm__input" value={section.title} onChange={(e) => setSection({ ...section, title: e.target.value })} placeholder={isAr ? t('قصص نجاح ملهمة') : 'Inspiring Success Stories'} /></div>
          <div className="tm__field"><label className="tm__label">{isAr ? t('الوصف (اختياري)') : 'Description (Optional)'}</label><textarea className="tm__textarea" value={section.description} onChange={(e) => setSection({ ...section, description: e.target.value })} rows="2" placeholder={isAr ? t('استمعي لتجارب متدرباتنا...') : "Listen to our clients' experiences..."} /></div>
        </motion.div>
      </AnimatePresence>

      {/* ── Testimonials List ── */}
      <div className="tm__list-card">
        <div className="tm__list-head">
          <span className="tm__list-title">{t('قائمة الآراء')}</span>
          <button className="tm__list-add" onClick={handleAddTestimonial}><Plus size={15} /> {t('إضافة رأي')}</button>
        </div>

        <div className="tm__list">
          <AnimatePresence>
            {testimonials.length === 0 ? (
              <motion.div className="tm__empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MessageSquare size={32} /><p>{t('لا توجد آراء حالياً')}</p><span>{t('انقر على "إضافة رأي" للبدء')}</span>
              </motion.div>
            ) : (
              testimonials.map((tItem, index) => (
                <motion.div key={index} className={`tm__item ${editingTestimonial === index ? 'tm__item--edit' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ delay: index * 0.05 }}>
                  {editingTestimonial === index ? (
                    <div className="tm__item-form">
                      <div className="tm__item-form-top">
                        <div className="tm__item-img-wrap">
                          <input ref={(el) => (fileInputRefs.current[index] = el)} type="file" accept="image/*" onChange={(e) => handleImageSelect(index, e)} hidden />
                          {tItem.image ? (
                            <div className="tm__item-img-preview"><img src={tItem.image} alt="" /><button className="tm__item-img-remove" onClick={() => handleDeleteImage(index)}><X size={12} /></button></div>
                          ) : (
                            <div className="tm__item-img-ph" onClick={() => fileInputRefs.current[index]?.click()}><Upload size={16} /></div>
                          )}
                        </div>
                        <div className="tm__item-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} className={`tm__star ${star <= tItem.rating ? 'tm__star--on' : ''}`} onClick={() => handleUpdateTestimonial(index, 'rating', star)}><Star size={16} /></button>
                          ))}
                        </div>
                        <button className="tm__item-ok" onClick={() => setEditingTestimonial(null)}><Check size={16} /></button>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.div key={activeTab} className="tm__item-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} dir={isAr ? 'rtl' : 'ltr'}>
                          <span className="tm__item-lang">{isAr ? t('العربية') : 'English'}</span>
                          <input className="tm__item-input" value={isAr ? tItem.name_ar : tItem.name_en} onChange={(e) => handleUpdateTestimonial(index, isAr ? 'name_ar' : 'name_en', e.target.value)} placeholder={isAr ? t('الاسم') : 'Name'} />
                          <input className="tm__item-input" value={isAr ? tItem.title_ar : tItem.title_en} onChange={(e) => handleUpdateTestimonial(index, isAr ? 'title_ar' : 'title_en', e.target.value)} placeholder={isAr ? t('المهنة') : 'Job Title'} />
                          <textarea className="tm__item-text" value={isAr ? tItem.text_ar : tItem.text_en} onChange={(e) => handleUpdateTestimonial(index, isAr ? 'text_ar' : 'text_en', e.target.value)} placeholder={isAr ? t('نص الرأي...') : 'Testimonial text...'} rows="3" />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="tm__item-row">
                      <div className="tm__item-avatar">
                        {tItem.image ? <img src={tItem.image} alt={tItem.name_ar} /> : <span>{(isAr ? tItem.name_ar : tItem.name_en).charAt(0) || '?'}</span>}
                      </div>
                      <div className="tm__item-info">
                        <span className="tm__item-name">{isAr ? tItem.name_ar : tItem.name_en}</span>
                        <span className="tm__item-job">{isAr ? tItem.title_ar : tItem.title_en}</span>
                        <div className="tm__item-stars">{Array.from({ length: tItem.rating }).map((_, i) => (<Star key={i} size={12} fill="#ffc107" color="#ffc107" />))}</div>
                        <p className="tm__item-quote">{isAr ? tItem.text_ar : tItem.text_en}</p>
                      </div>
                      <div className="tm__item-acts">
                        <button className="tm__item-btn" onClick={() => setEditingTestimonial(index)}><Edit2 size={14} /></button>
                        <button className="tm__item-btn tm__item-btn--del" onClick={() => handleDeleteTestimonial(index)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
