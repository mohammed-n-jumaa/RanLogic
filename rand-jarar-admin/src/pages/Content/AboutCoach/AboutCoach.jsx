import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Upload,
  Save,
  Check,
  AlertCircle,
  Trash2,
  Plus,
  X,
  Languages,
  Globe,
  Edit2,
  ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';
import aboutCoachApi from '../../../api/aboutCoachApi';
import './AboutCoach.scss';

const AboutCoach = () => {
  const [activeTab, setActiveTab] = useState('ar');

  const [contentEn, setContentEn] = useState({
    badge: '',
    title: '',
    mainDescription: '',
    highlightText: '',
  });

  const [contentAr, setContentAr] = useState({
    badge: '',
    title: '',
    mainDescription: '',
    highlightText: '',
  });

  const [coachImage, setCoachImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const [features, setFeatures] = useState([]);
  const [editingFeature, setEditingFeature] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAboutCoach();
  }, []);

  const fetchAboutCoach = async () => {
    setIsLoading(true);
    try {
      const response = await aboutCoachApi.getAboutCoach();
      if (response.success && response.data) {
        const { data } = response;
        setContentEn({
          badge: data.badge_en || '',
          title: data.title_en || '',
          mainDescription: data.main_description_en || '',
          highlightText: data.highlight_text_en || '',
        });
        setContentAr({
          badge: data.badge_ar || '',
          title: data.title_ar || '',
          mainDescription: data.main_description_ar || '',
          highlightText: data.highlight_text_ar || '',
        });
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
        setFeatures(data.features || []);
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = async (file) => {
    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      Swal.fire({
        title: 'خطأ',
        text: 'يرجى اختيار ملف صورة صالح',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
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
        setCoachImage(null);
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 3000);
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
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
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
        setCoachImage(null);
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

  const handleAddFeature = () => {
    setFeatures([
      ...features,
      {
        id: null,
        icon: '✨',
        title_en: '',
        title_ar: '',
        description_en: '',
        description_ar: '',
      },
    ]);
    setEditingFeature(features.length);
  };

  const handleUpdateFeature = (index, field, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setFeatures(updatedFeatures);
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

    setFeatures(features.filter((_, i) => i !== index));
    Swal.fire({
      title: 'تم الحذف',
      text: 'تم حذف الميزة بنجاح',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleSaveFeature = (index) => {
    setEditingFeature(null);
  };

  const handleSaveChanges = async () => {
    if (!contentEn.title || !contentAr.title) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء العنوان بالعربية والإنجليزية',
        icon: 'warning',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    if (!contentEn.mainDescription || !contentAr.mainDescription) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء الوصف الرئيسي بالعربية والإنجليزية',
        icon: 'warning',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    const invalidFeature = features.find(
      (f) =>
        !f.icon ||
        !f.title_en ||
        !f.title_ar ||
        !f.description_en ||
        !f.description_ar
    );

    if (invalidFeature) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء جميع حقول المميزات (عربي وإنجليزي)',
        icon: 'warning',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        badge_en: contentEn.badge,
        badge_ar: contentAr.badge,
        title_en: contentEn.title,
        title_ar: contentAr.title,
        main_description_en: contentEn.mainDescription,
        main_description_ar: contentAr.mainDescription,
        highlight_text_en: contentEn.highlightText,
        highlight_text_ar: contentAr.highlightText,
        features: features.map((f) => ({
          id: f.id,
          icon: f.icon,
          title_en: f.title_en,
          title_ar: f.title_ar,
          description_en: f.description_en,
          description_ar: f.description_ar,
          is_active: true,
        })),
      };

      const response = await aboutCoachApi.updateAboutCoach(data);

      if (response.success) {
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 3000);

        Swal.fire({
          title: 'نجح',
          text: 'تم حفظ جميع التغييرات بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });

        await fetchAboutCoach();
        setEditingFeature(null);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);

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

  const isAr = activeTab === 'ar';
  const content = isAr ? contentAr : contentEn;
  const setContent = isAr ? setContentAr : setContentEn;

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
      {/* ── Top Bar ── */}
      <div className="ac__topbar">
        <div>
          <h1 className="ac__title">عن المدربة</h1>
          <p className="ac__desc">
            تحرير معلومات المدربة وصورتها الشخصية — عربي / English
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

      {/* ── Main Grid ── */}
      <div className="ac__grid">
        {/* ═══ COL 1: Form ═══ */}
        <motion.div
          className="ac__col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Language Tabs */}
          <div className="ac__lang">
            <button
              className={`ac__lang-tab ${activeTab === 'ar' ? 'ac__lang-tab--on' : ''}`}
              onClick={() => setActiveTab('ar')}
            >
              <Globe size={15} /> العربية
            </button>
            <button
              className={`ac__lang-tab ${activeTab === 'en' ? 'ac__lang-tab--on' : ''}`}
              onClick={() => setActiveTab('en')}
            >
              <Languages size={15} /> English
            </button>
          </div>

          {/* Content Form */}
          <AnimatePresence mode="wait">
            <motion.div
              className="ac__form"
              key={activeTab}
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
                  value={content.badge}
                  onChange={(e) =>
                    setContent({ ...content, badge: e.target.value })
                  }
                  placeholder={isAr ? 'من أنا' : 'Who Am I'}
                />
              </div>

              <div className="ac__field">
                <label className="ac__label">
                  {isAr ? 'العنوان الرئيسي *' : 'Main Title *'}
                </label>
                <input
                  type="text"
                  className="ac__input"
                  value={content.title}
                  onChange={(e) =>
                    setContent({ ...content, title: e.target.value })
                  }
                  placeholder={isAr ? 'عن المدربة' : 'About the Coach'}
                />
              </div>

              <div className="ac__field">
                <label className="ac__label">
                  {isAr ? 'الوصف الرئيسي *' : 'Main Description *'}
                </label>
                <textarea
                  className="ac__textarea"
                  value={content.mainDescription}
                  onChange={(e) =>
                    setContent({ ...content, mainDescription: e.target.value })
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
                  {isAr
                    ? 'النص المميز (وردي - اختياري)'
                    : 'Highlight Text (Pink - Optional)'}
                </label>
                <textarea
                  className="ac__textarea ac__textarea--accent"
                  value={content.highlightText}
                  onChange={(e) =>
                    setContent({ ...content, highlightText: e.target.value })
                  }
                  rows="3"
                  placeholder={
                    isAr
                      ? 'ساعدت أكثر من 500 متدربة...'
                      : 'I have helped over 500 trainees...'
                  }
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Features */}
          <div className="ac__features">
            <div className="ac__features-head">
              <span className="ac__features-title">المميزات / Features</span>
              <button className="ac__features-add" onClick={handleAddFeature}>
                <Plus size={15} /> إضافة
              </button>
            </div>

            <div className="ac__features-list">
              <AnimatePresence>
                {features.length === 0 ? (
                  <motion.div
                    className="ac__features-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Star size={32} />
                    <p>لا توجد مميزات حالياً</p>
                    <span>انقر على "إضافة" للبدء</span>
                  </motion.div>
                ) : (
                  features.map((feature, index) => (
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
                              onClick={() => handleSaveFeature(index)}
                            >
                              <Check size={16} />
                            </button>
                          </div>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeTab}
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
                              {isAr ? feature.title_ar : feature.title_en}
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

        {/* ═══ COL 2: Image ═══ */}
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