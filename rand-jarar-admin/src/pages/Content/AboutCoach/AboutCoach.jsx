import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Upload,
  Save,
  Check,
  Trash2,
  Plus,
  Languages,
  Globe,
  Edit2,
  Monitor,
  Sparkles,
  Columns,
  Layout,
} from 'lucide-react';
import Swal from 'sweetalert2';
import aboutCoachApi from '../../../api/aboutCoachApi';
import './AboutCoach.scss';

const DESIGN_TABS = [
  { key: 'classic',   label: 'الكلاسيكي', labelEn: 'Classic',   icon: Monitor,  desc: 'التصميم الأصلي' },
  { key: 'editorial', label: 'المجلة',    labelEn: 'Editorial', icon: Sparkles, desc: 'تصميم المجلة' },
  { key: 'bento',     label: 'البينتو',   labelEn: 'Bento',     icon: Columns,  desc: 'شبكة البينتو' },
  { key: 'spotlight', label: 'الأضواء',   labelEn: 'Spotlight', icon: Layout,   desc: 'تصميم الأضواء' },
];

const emptyContent = () => ({
  badge_en: '',
  badge_ar: '',
  title_en: '',
  title_ar: '',
  main_description_en: '',
  main_description_ar: '',
  highlight_text_en: '',
  highlight_text_ar: '',
});

const AboutCoach = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [activeDesignTab, setActiveDesignTab] = useState('classic');
  const [activeDesignType, setActiveDesignType] = useState('classic');
  const [langTab, setLangTab] = useState('ar');

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [editingFeature, setEditingFeature] = useState(null);

  const [designs, setDesigns] = useState({
    classic:   { content: emptyContent(), features: [] },
    editorial: { content: emptyContent(), features: [] },
    bento:     { content: emptyContent(), features: [] },
    spotlight: { content: emptyContent(), features: [] },
  });
  const [bgStyle, setBgStyle] = useState('dark');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await aboutCoachApi.getAboutCoach();
      if (response.success && response.data) {
        const d = response.data;
        setActiveDesignType(d.design_type || 'classic');
        setBgStyle(d.bg_style || 'dark');
        setImagePreview(d.image_url);
        setDesigns({
          classic:   d.designs?.classic   || { content: emptyContent(), features: [] },
          editorial: d.designs?.editorial || { content: emptyContent(), features: [] },
          bento:     d.designs?.bento     || { content: emptyContent(), features: [] },
          spotlight: d.designs?.spotlight || { content: emptyContent(), features: [] },
        });
      }
    } catch (error) {
      console.error('Error fetching about coach:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل تحميل البيانات',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const curDesign = designs[activeDesignTab];

  const setCurDesign = (updater) => {
    setDesigns((prev) => ({
      ...prev,
      [activeDesignTab]:
        typeof updater === 'function'
          ? updater(prev[activeDesignTab])
          : updater,
    }));
  };

  const updateContent = (field, value) => {
    setCurDesign((d) => ({
      ...d,
      content: { ...d.content, [field]: value },
    }));
  };

  const handleUpdateFeature = (index, field, value) => {
    const updatedFeatures = [...(curDesign.features || [])];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setCurDesign((d) => ({ ...d, features: updatedFeatures }));
  };

  const handleAddFeature = () => {
    setCurDesign((d) => ({
      ...d,
      features: [
        ...(d.features || []),
        {
          id: null,
          icon: '✨',
          title_en: '',
          title_ar: '',
          description_en: '',
          description_ar: '',
        },
      ],
    }));
    setEditingFeature((curDesign.features || []).length);
  };

  const handleDeleteFeature = async (index) => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف هذه الميزة؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
    });

    if (!result.isConfirmed) return;

    setCurDesign((d) => ({
      ...d,
      features: d.features.filter((_, i) => i !== index),
    }));

    Swal.fire({
      title: 'تم الحذف',
      text: 'تم حذف الميزة بنجاح',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processImage(file);
  };

  const processImage = async (file) => {
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'خطأ',
        text: 'يرجى اختيار ملف صورة صالح',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'خطأ',
        text: 'حجم الصورة يجب أن لا يتجاوز 5MB',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      setUploadProgress(0);
      const response = await aboutCoachApi.uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success) {
        setImagePreview(response.data.image_url);
        Swal.fire({
          title: 'نجح',
          text: 'تم رفع الصورة بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        title: 'خطأ',
        text: error.response?.data?.message || 'فشل رفع الصورة',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDeleteImage = async () => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف الصورة؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await aboutCoachApi.deleteImage();
      if (response.success) {
        setImagePreview(null);
        Swal.fire({
          title: 'تم الحذف',
          text: 'تم حذف الصورة بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل حذف الصورة',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      const payload = {
        design_key: activeDesignTab,
        design_type: activeDesignType,
        bg_style: bgStyle,
        content: curDesign.content,
        features: (curDesign.features || []).map((f, i) => ({
          id: f.id,
          icon: f.icon,
          title_en: f.title_en,
          title_ar: f.title_ar,
          description_en: f.description_en,
          description_ar: f.description_ar,
          order: i,
          is_active: true,
      
        })),
      };

      const response = await aboutCoachApi.updateAboutCoach(payload);

      if (response.success) {
        Swal.fire({
          title: 'نجح',
          text: 'تم حفظ جميع التغييرات بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });

        await fetchData();
        setEditingFeature(null);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      Swal.fire({
        title: 'خطأ',
        text: error.response?.data?.message || 'فشل حفظ التغييرات',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isAr = langTab === 'ar';

  if (isLoading) {
    return (
      <div className="ac">
        <div className="ac__loader">
          <div className="ac__loader-spin" />
          <span>جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ac">

      <div className="ac__topbar">
        <div>
          <h1 className="ac__title">إدارة قسم عن المدربة</h1>
          <p className="ac__desc">
            إدارة 4 تصاميم مختلفة — التصميم النشط هو الظاهر بالموقع
          </p>
        </div>
        <motion.button
          className="ac__save"
          onClick={handleSaveChanges}
          disabled={isSaving}
          whileTap={{ scale: 0.97 }}
        >
          {isSaving ? (
            <>
              <div className="ac__spinner" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>حفظ التغييرات</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="ac__design-tabs">
        {DESIGN_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDesignTab === tab.key;
          const isLive = activeDesignType === tab.key;
          return (
            <button
              key={tab.key}
              className={`ac__design-tab ${isActive ? 'ac__design-tab--active' : ''}`}
              onClick={() => {
                setActiveDesignTab(tab.key);
                setEditingFeature(null);
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span className="ac__design-tab-en">{tab.labelEn}</span>
              {isLive && <span className="ac__design-tab-live">ACTIVE</span>}
            </button>
          );
        })}
      </div>

      {activeDesignType !== activeDesignTab && (
        <motion.button
          className="ac__activate-btn"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setActiveDesignType(activeDesignTab)}
        >
          <Sparkles size={14} />
          تفعيل هذا التصميم كالتصميم الرئيسي
        </motion.button>
      )}

      <div className="ac__bg-toggle">
        <span className="ac__bg-label">خلفية السيكشن:</span>
        <div className="ac__bg-options">
          <button
            className={`ac__bg-opt ${bgStyle === 'dark' ? 'ac__bg-opt--on' : ''}`}
            onClick={() => setBgStyle('dark')}
          >
            داكنة
          </button>
          <button
            className={`ac__bg-opt ${bgStyle === 'transparent' ? 'ac__bg-opt--on' : ''}`}
            onClick={() => setBgStyle('transparent')}
          >
            شفافة (نفس الأصلي)
          </button>
        </div>
      </div>

      <div className="ac__grid">

        <motion.div
          className="ac__col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeDesignTab}
        >
          <div className="ac__lang">
            <button
              className={`ac__lang-tab ${langTab === 'ar' ? 'ac__lang-tab--on' : ''}`}
              onClick={() => setLangTab('ar')}
            >
              <Globe size={15} /> العربية
            </button>
            <button
              className={`ac__lang-tab ${langTab === 'en' ? 'ac__lang-tab--on' : ''}`}
              onClick={() => setLangTab('en')}
            >
              <Languages size={15} /> English
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              className="ac__form"
              key={`${activeDesignTab}-${langTab}`}
              initial={{ opacity: 0, x: isAr ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <div className="ac__field">
                <label className="ac__label">
                  {isAr ? 'الشارة (اختياري)' : 'Badge (Optional)'}
                </label>
                <input
                  type="text"
                  className="ac__input"
                  value={curDesign.content[`badge_${langTab}`] || ''}
                  onChange={(e) => updateContent(`badge_${langTab}`, e.target.value)}
                  placeholder={isAr ? 'من أنا' : 'Who Am I'}
                />
              </div>

              <div className="ac__field">
                <label className="ac__label">
                  {isAr ? 'العنوان الرئيسي' : 'Main Title'}
                </label>
                <input
                  type="text"
                  className="ac__input"
                  value={curDesign.content[`title_${langTab}`] || ''}
                  onChange={(e) => updateContent(`title_${langTab}`, e.target.value)}
                  placeholder={isAr ? 'عن المدربة' : 'About the Coach'}
                />
              </div>

              <div className="ac__field">
                <label className="ac__label">
                  {isAr ? 'الوصف الرئيسي' : 'Main Description'}
                </label>
                <textarea
                  className="ac__textarea"
                  value={curDesign.content[`main_description_${langTab}`] || ''}
                  onChange={(e) =>
                    updateContent(`main_description_${langTab}`, e.target.value)
                  }
                  rows="4"
                  placeholder={
                    isAr
                      ? 'مدربة لياقة بدنية معتمدة دولياً...'
                      : 'An internationally certified fitness coach...'
                  }
                />
              </div>

              <div className="ac__field">
                <label className="ac__label">
                  {isAr ? 'الاقتباس / النص المميز' : 'Quote / Highlight Text'}
                </label>
                <textarea
                  className="ac__textarea ac__textarea--accent"
                  value={curDesign.content[`highlight_text_${langTab}`] || ''}
                  onChange={(e) =>
                    updateContent(`highlight_text_${langTab}`, e.target.value)
                  }
                  rows="3"
                  placeholder={
                    isAr
                      ? 'ساعدت أكثر من 200 متدربة...'
                      : 'I have helped over 200 trainees...'
                  }
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="ac__features">
            <div className="ac__features-head">
              <span className="ac__features-title">
                المميزات / Features
              </span>
              <button className="ac__features-add" onClick={handleAddFeature}>
                <Plus size={15} /> إضافة
              </button>
            </div>

            <div className="ac__features-list">
              <AnimatePresence>
                {(curDesign.features || []).length === 0 ? (
                  <motion.div
                    className="ac__features-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Star size={32} />
                    <p>لا توجد مميزات حالياً</p>
                    <span>انقر على "إضافة" للبدء — أو سيتم استخدام الافتراضية</span>
                  </motion.div>
                ) : (
                  (curDesign.features || []).map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`ac__feat ${editingFeature === index ? 'ac__feat--edit' : ''}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {editingFeature === index ? (
                        <div className="ac__feat-form">
                          <div className="ac__feat-form-top">
                            <input
                              className="ac__feat-icon-input"
                              value={feature.icon}
                              onChange={(e) =>
                                handleUpdateFeature(index, 'icon', e.target.value)
                              }
                              maxLength="10"
                              placeholder="✨"
                            />
                            <button
                              className="ac__feat-ok"
                              onClick={() => setEditingFeature(null)}
                            >
                              <Check size={16} />
                            </button>
                          </div>

                          <AnimatePresence mode="wait">
                            <motion.div
                              key={langTab}
                              className="ac__feat-fields"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              dir={isAr ? 'rtl' : 'ltr'}
                            >
                              <span className="ac__feat-lang-label">
                                {isAr ? 'العربية' : 'English'}
                              </span>
                              <input
                                className="ac__feat-input"
                                value={
                                  isAr ? feature.title_ar : feature.title_en
                                }
                                onChange={(e) =>
                                  handleUpdateFeature(
                                    index,
                                    isAr ? 'title_ar' : 'title_en',
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  isAr ? 'عنوان الميزة' : 'Feature title'
                                }
                              />
                              <input
                                className="ac__feat-input"
                                value={
                                  isAr
                                    ? feature.description_ar
                                    : feature.description_en
                                }
                                onChange={(e) =>
                                  handleUpdateFeature(
                                    index,
                                    isAr
                                      ? 'description_ar'
                                      : 'description_en',
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  isAr ? 'وصف الميزة' : 'Feature description'
                                }
                              />
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="ac__feat-row">
                          <span className="ac__feat-icon">{feature.icon}</span>
                          <div className="ac__feat-text">
                            <span className="ac__feat-title">
                              {isAr
                                ? feature.title_ar || '—'
                                : feature.title_en || '—'}
                            </span>
                            <span className="ac__feat-desc">
                              {isAr
                                ? feature.description_ar
                                : feature.description_en}
                            </span>
                          </div>
                          <div className="ac__feat-acts">
                            <button
                              className="ac__feat-btn"
                              onClick={() => setEditingFeature(index)}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="ac__feat-btn ac__feat-btn--del"
                              onClick={() => handleDeleteFeature(index)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="ac__col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="ac__img-label">صورة المدربة</div>

          {!imagePreview ? (
            <div
              className="ac__dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                hidden
              />
              <div className="ac__dropzone-icon">
                <Upload size={28} />
              </div>
              <p className="ac__dropzone-txt">
                انقر لرفع صورة أو <span>تصفح الملفات</span>
              </p>
              <div className="ac__dropzone-meta">
                <span>PNG, JPG, WEBP</span>
                <span className="ac__dot" />
                <span>أقصى 5MB</span>
              </div>
            </div>
          ) : (
            <div className="ac__photo">
              <div className="ac__photo-wrap">
                <img
                  src={imagePreview}
                  alt="Coach"
                  className="ac__photo-img"
                  onError={(e) => {
                    e.target.src = '/coach.png';
                  }}
                />
                {uploadProgress > 0 && (
                  <div className="ac__photo-progress">
                    <div
                      className="ac__photo-progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="ac__photo-bar">
                <button
                  className="ac__photo-act"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={15} /> تغيير
                </button>
                <button
                  className="ac__photo-act ac__photo-act--del"
                  onClick={handleDeleteImage}
                >
                  <Trash2 size={15} /> حذف
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  hidden
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutCoach;
