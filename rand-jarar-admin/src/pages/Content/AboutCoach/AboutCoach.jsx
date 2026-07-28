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
  Globe
} from 'lucide-react';
import Swal from 'sweetalert2';
import aboutCoachApi from '../../../api/aboutCoachApi';
import './AboutCoach.scss';

const AboutCoach = () => {
  // Language State
  const [activeTab, setActiveTab] = useState('ar'); // 'ar' or 'en'
  
  // English Content State
  const [contentEn, setContentEn] = useState({
    badge: '',
    title: '',
    mainDescription: '',
    highlightText: ''
  });
  
  // Arabic Content State
  const [contentAr, setContentAr] = useState({
    badge: '',
    title: '',
    mainDescription: '',
    highlightText: ''
  });
  
  // Image State
  const [coachImage, setCoachImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  // Features State (Bilingual)
  const [features, setFeatures] = useState([]);
  const [editingFeature, setEditingFeature] = useState(null);
  
  // UI State
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data on mount
  useEffect(() => {
    fetchAboutCoach();
  }, []);
  
  // Fetch about coach data
  const fetchAboutCoach = async () => {
    setIsLoading(true);
    try {
      const response = await aboutCoachApi.getAboutCoach();
      
      if (response.success && response.data) {
        const { data } = response;
        
        // Set English content
        setContentEn({
          badge: data.badge_en || '',
          title: data.title_en || '',
          mainDescription: data.main_description_en || '',
          highlightText: data.highlight_text_en || ''
        });
        
        // Set Arabic content
        setContentAr({
          badge: data.badge_ar || '',
          title: data.title_ar || '',
          mainDescription: data.main_description_ar || '',
          highlightText: data.highlight_text_ar || ''
        });
        
        // Set image
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
        
        // Set features
        setFeatures(data.features || []);
      }
    } catch (error) {
      console.error('Error fetching about coach:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل تحميل البيانات',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Image Select
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };
  
  // Process and Upload Image
  const processImage = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      Swal.fire({
        title: 'خطأ',
        text: 'يرجى اختيار ملف صورة صالح',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      Swal.fire({
        title: 'خطأ',
        text: 'حجم الصورة يجب أن لا يتجاوز 5MB',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Upload to server
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
          showConfirmButton: false
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
        confirmButtonColor: '#e91e63'
      });
    } finally {
      setUploadProgress(0);
    }
  };
  
  // Handle Delete Image
  const handleDeleteImage = async () => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف الصورة؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
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
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل حذف الصورة',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    }
  };
  
  // Features Management
  const handleAddFeature = () => {
    const newFeature = {
      id: null, // null for new features
      icon: '✨',
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: ''
    };
    setFeatures([...features, newFeature]);
    setEditingFeature(features.length); // Edit the new one
  };
  
  const handleUpdateFeature = (index, field, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
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
      cancelButtonText: 'إلغاء'
    });
    
    if (!result.isConfirmed) return;
    
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    
    Swal.fire({
      title: 'تم الحذف',
      text: 'تم حذف الميزة بنجاح',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };
  
  const handleSaveFeature = (index) => {
    setEditingFeature(null);
  };
  
  // Save All Changes
  const handleSaveChanges = async () => {
    // Validate required fields
    if (!contentEn.title || !contentAr.title) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء العنوان بالعربية والإنجليزية',
        icon: 'warning',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    if (!contentEn.mainDescription || !contentAr.mainDescription) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء الوصف الرئيسي بالعربية والإنجليزية',
        icon: 'warning',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    // Validate features
    const invalidFeature = features.find(f => 
      !f.icon || !f.title_en || !f.title_ar || !f.description_en || !f.description_ar
    );
    
    if (invalidFeature) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء جميع حقول المميزات (عربي وإنجليزي)',
        icon: 'warning',
        confirmButtonColor: '#e91e63'
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
        features: features.map((feature, index) => ({
          id: feature.id,
          icon: feature.icon,
          title_en: feature.title_en,
          title_ar: feature.title_ar,
          description_en: feature.description_en,
          description_ar: feature.description_ar,
          is_active: true
        }))
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
          showConfirmButton: false
        });
        
        // Refresh data
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
        confirmButtonColor: '#e91e63'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="about-coach">
        <div className="about-coach__loading">
          <div className="spinner-large"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="about-coach">
      {/* Page Header */}
      <motion.div
        className="about-coach__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="about-coach__header-content">
          <div className="about-coach__title-section">
            <h1 className="about-coach__title">
              <Star size={32} />
              عن المدربة
            </h1>
            <p className="about-coach__subtitle">
              قم بتحرير معلومات المدربة وصورتها الشخصية (عربي / English)
            </p>
          </div>
          
          <motion.button
            className="about-coach__save-btn"
            onClick={handleSaveChanges}
            disabled={isSaving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSaving ? (
              <>
                <div className="spinner"></div>
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>حفظ التغييرات</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
      
      {/* Status Messages */}
      <AnimatePresence>
        {uploadStatus === 'success' && (
          <motion.div
            className="about-coach__alert about-coach__alert--success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Check size={20} />
            <span>تم حفظ التغييرات بنجاح!</span>
          </motion.div>
        )}
        
        {uploadStatus === 'error' && (
          <motion.div
            className="about-coach__alert about-coach__alert--error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle size={20} />
            <span>خطأ: فشل حفظ التغييرات</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Language Tabs */}
      <div className="language-tabs">
        <button
          className={`language-tab ${activeTab === 'ar' ? 'active' : ''}`}
          onClick={() => setActiveTab('ar')}
        >
          <Globe size={18} />
          العربية
        </button>
        <button
          className={`language-tab ${activeTab === 'en' ? 'active' : ''}`}
          onClick={() => setActiveTab('en')}
        >
          <Languages size={18} />
          English
        </button>
      </div>
      
      {/* Main Content - Single Column */}
      <div className="about-coach__content">
        <motion.div
          className="about-coach__editor-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Image Upload */}
          <div className="image-upload-card">
            <h2 className="image-upload-card__title">صورة المدربة</h2>
            
            {!imagePreview ? (
              <div
                className="image-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="image-dropzone__input"
                />
                
                <div className="image-dropzone__content">
                  <div className="image-dropzone__icon">
                    <Upload size={40} />
                  </div>
                  <p className="image-dropzone__text">انقر لرفع صورة</p>
                  <p className="image-dropzone__hint">PNG, JPG, WEBP (max 5MB)</p>
                </div>
              </div>
            ) : (
              <div className="image-preview">
                <img src={imagePreview} alt="Coach" className="image-preview__img" />
                
                {uploadProgress > 0 && (
                  <div className="upload-progress">
                    <div className="upload-progress__bar" style={{ width: `${uploadProgress}%` }}></div>
                    <span className="upload-progress__text">{uploadProgress}%</span>
                  </div>
                )}
                
                <div className="image-preview__actions">
                  <button
                    className="image-preview__btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} />
                    تغيير
                  </button>
                  <button
                    className="image-preview__btn image-preview__btn--danger"
                    onClick={handleDeleteImage}
                  >
                    <Trash2 size={16} />
                    حذف
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>
          
          {/* Content Editor */}
          <div className="content-editor-card">
            <h2 className="content-editor-card__title">المحتوى</h2>
            
            <AnimatePresence mode="wait">
              {activeTab === 'ar' ? (
                <motion.div
                  key="ar-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="form-group">
                    <label className="form-label">الشارة (اختياري)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contentAr.badge}
                      onChange={(e) => setContentAr({ ...contentAr, badge: e.target.value })}
                      placeholder="من أنا"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">العنوان الرئيسي *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contentAr.title}
                      onChange={(e) => setContentAr({ ...contentAr, title: e.target.value })}
                      placeholder="عن المدربة"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">الوصف الرئيسي *</label>
                    <textarea
                      className="form-textarea"
                      value={contentAr.mainDescription}
                      onChange={(e) => setContentAr({ ...contentAr, mainDescription: e.target.value })}
                      rows="4"
                      placeholder="مدربة لياقة بدنية معتمدة دولياً..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">النص المميز (وردي - اختياري)</label>
                    <textarea
                      className="form-textarea form-textarea--highlight"
                      value={contentAr.highlightText}
                      onChange={(e) => setContentAr({ ...contentAr, highlightText: e.target.value })}
                      rows="3"
                      placeholder="ساعدت أكثر من 500 متدربة..."
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="en-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="form-group">
                    <label className="form-label">Badge (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contentEn.badge}
                      onChange={(e) => setContentEn({ ...contentEn, badge: e.target.value })}
                      placeholder="Who Am I"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Main Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contentEn.title}
                      onChange={(e) => setContentEn({ ...contentEn, title: e.target.value })}
                      placeholder="About the Coach"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Main Description *</label>
                    <textarea
                      className="form-textarea"
                      value={contentEn.mainDescription}
                      onChange={(e) => setContentEn({ ...contentEn, mainDescription: e.target.value })}
                      rows="4"
                      placeholder="An internationally certified fitness coach..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Highlight Text (Pink - Optional)</label>
                    <textarea
                      className="form-textarea form-textarea--highlight"
                      value={contentEn.highlightText}
                      onChange={(e) => setContentEn({ ...contentEn, highlightText: e.target.value })}
                      rows="3"
                      placeholder="I have helped over 500 trainees..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Features Editor */}
          <div className="features-editor-card">
            <div className="features-editor-card__header">
              <h2 className="features-editor-card__title">المميزات</h2>
              <button
                className="features-editor-card__add-btn"
                onClick={handleAddFeature}
              >
                <Plus size={18} />
                إضافة ميزة
              </button>
            </div>
            
            <div className="features-list">
              <AnimatePresence>
                {features.length === 0 ? (
                  <motion.div
                    className="features-list__empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Star size={48} />
                    <p>لا توجد مميزات حالياً</p>
                    <p className="features-list__empty-hint">انقر على "إضافة ميزة" لإضافة ميزة جديدة</p>
                  </motion.div>
                ) : (
                  features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`feature-item ${editingFeature === index ? 'feature-item--editing' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {editingFeature === index ? (
                        <div className="feature-item__form">
                          <div className="feature-item__form-header">
                            <input
                              type="text"
                              className="feature-item__icon-input"
                              value={feature.icon}
                              onChange={(e) => handleUpdateFeature(index, 'icon', e.target.value)}
                              maxLength="10"
                              placeholder="✨"
                            />
                            <button
                              className="feature-item__save-btn"
                              onClick={() => handleSaveFeature(index)}
                            >
                              <Check size={18} />
                            </button>
                          </div>
                          
                          <AnimatePresence mode="wait">
                            {activeTab === 'ar' ? (
                              <motion.div
                                key="ar-feature"
                                className="feature-item__lang-fields"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                              >
                                <label className="feature-item__label">العربية</label>
                                <input
                                  type="text"
                                  className="feature-item__input"
                                  value={feature.title_ar}
                                  onChange={(e) => handleUpdateFeature(index, 'title_ar', e.target.value)}
                                  placeholder="أنظمة غذائية مخصصة"
                                />
                                <input
                                  type="text"
                                  className="feature-item__input"
                                  value={feature.description_ar}
                                  onChange={(e) => handleUpdateFeature(index, 'description_ar', e.target.value)}
                                  placeholder="خطط تغذية مصممة خصيصاً لك"
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="en-feature"
                                className="feature-item__lang-fields"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                              >
                                <label className="feature-item__label">English</label>
                                <input
                                  type="text"
                                  className="feature-item__input"
                                  value={feature.title_en}
                                  onChange={(e) => handleUpdateFeature(index, 'title_en', e.target.value)}
                                  placeholder="Personalized Nutrition Plans"
                                />
                                <input
                                  type="text"
                                  className="feature-item__input"
                                  value={feature.description_en}
                                  onChange={(e) => handleUpdateFeature(index, 'description_en', e.target.value)}
                                  placeholder="Nutrition plans designed for you"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="feature-item__display">
                          <div className="feature-item__icon">{feature.icon}</div>
                          <div className="feature-item__content">
                            <div className="feature-item__title">
                              {activeTab === 'ar' ? feature.title_ar : feature.title_en}
                            </div>
                            <div className="feature-item__description">
                              {activeTab === 'ar' ? feature.description_ar : feature.description_en}
                            </div>
                          </div>
                          <div className="feature-item__actions">
                            <button
                              className="feature-item__action-btn"
                              onClick={() => setEditingFeature(index)}
                            >
                              <Star size={16} />
                            </button>
                            <button
                              className="feature-item__action-btn feature-item__action-btn--danger"
                              onClick={() => handleDeleteFeature(index)}
                            >
                              <Trash2 size={16} />
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
      </div>
    </div>
  );
};

export default AboutCoach;