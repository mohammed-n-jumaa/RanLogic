import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Upload,
  Save,
  Check,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Star,
  X,
  Languages,
  Globe,
  Image as ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';
import testimonialsApi from '../../../api/testimonialsApi';
import './Testimonials.scss';

const Testimonials = () => {
  // Language State
  const [activeTab, setActiveTab] = useState('ar'); // 'ar' or 'en'
  
  // Section State (Bilingual)
  const [sectionEn, setSectionEn] = useState({
    badge: '',
    title: '',
    description: ''
  });
  
  const [sectionAr, setSectionAr] = useState({
    badge: '',
    title: '',
    description: ''
  });
  
  // Testimonials State (Bilingual with images)
  const [testimonials, setTestimonials] = useState([]);
  
  // UI State
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRefs = useRef({});
  
  // Load data on mount
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  // Fetch testimonials
  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response = await testimonialsApi.getAll();
      
      if (response.success && response.data) {
        const { section, testimonials: items } = response.data;
        
        // Set section
        if (section) {
          setSectionEn({
            badge: section.badge_en || '',
            title: section.title_en || '',
            description: section.description_en || ''
          });
          
          setSectionAr({
            badge: section.badge_ar || '',
            title: section.title_ar || '',
            description: section.description_ar || ''
          });
        }
        
        // Set testimonials
        setTestimonials(items || []);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
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
  
  // Add new testimonial
  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: null,
      name_en: '',
      name_ar: '',
      title_en: '',
      title_ar: '',
      text_en: '',
      text_ar: '',
      rating: 5,
      image: null
    };
    setTestimonials([...testimonials, newTestimonial]);
    setEditingTestimonial(testimonials.length);
  };
  
  // Update testimonial field
  const handleUpdateTestimonial = (index, field, value) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value
    };
    setTestimonials(updatedTestimonials);
  };
  
  // Delete testimonial
  const handleDeleteTestimonial = async (index) => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف هذا الرأي؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    });
    
    if (!result.isConfirmed) return;
    
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    setTestimonials(updatedTestimonials);
    
    Swal.fire({
      title: 'تم الحذف',
      text: 'تم حذف الرأي بنجاح',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };
  
  // Handle Image Select
  const handleImageSelect = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate
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
    
    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      handleUpdateTestimonial(index, 'image', reader.result);
    };
    reader.readAsDataURL(file);
    
    // If testimonial exists, upload to server
    const testimonial = testimonials[index];
    if (testimonial.id) {
      try {
        const response = await testimonialsApi.uploadImage(testimonial.id, file);
        
        if (response.success) {
          handleUpdateTestimonial(index, 'image', response.data.image_url);
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
        Swal.fire({
          title: 'خطأ',
          text: 'فشل رفع الصورة',
          icon: 'error',
          confirmButtonColor: '#e91e63'
        });
      }
    }
  };
  
  // Delete Image
  const handleDeleteImage = async (index) => {
    const testimonial = testimonials[index];
    
    if (testimonial.id) {
      try {
        await testimonialsApi.deleteImage(testimonial.id);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    handleUpdateTestimonial(index, 'image', null);
  };
  
  // Save all changes
  const handleSaveChanges = async () => {
    // Validate section
    if (!sectionEn.title || !sectionAr.title) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء عنوان القسم بالعربية والإنجليزية',
        icon: 'warning',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    // Validate testimonials
    const invalidTestimonial = testimonials.find(t => 
      !t.name_en || !t.name_ar || 
      !t.title_en || !t.title_ar || 
      !t.text_en || !t.text_ar
    );
    
    if (invalidTestimonial) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى ملء جميع حقول الآراء (عربي وإنجليزي)',
        icon: 'warning',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const data = {
        section: {
          badge_en: sectionEn.badge,
          badge_ar: sectionAr.badge,
          title_en: sectionEn.title,
          title_ar: sectionAr.title,
          description_en: sectionEn.description,
          description_ar: sectionAr.description
        },
        testimonials: testimonials.map((t, index) => ({
          id: t.id,
          name_en: t.name_en,
          name_ar: t.name_ar,
          title_en: t.title_en,
          title_ar: t.title_ar,
          text_en: t.text_en,
          text_ar: t.text_ar,
          rating: t.rating,
          order: index,
          is_active: true
        }))
      };
      
      const response = await testimonialsApi.updateAll(data);
      
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
        await fetchTestimonials();
        setEditingTestimonial(null);
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
      <div className="testimonials">
        <div className="testimonials__loading">
          <div className="spinner-large"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="testimonials">
      {/* Page Header */}
      <motion.div
        className="testimonials__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="testimonials__header-content">
          <div className="testimonials__title-section">
            <h1 className="testimonials__title">
              <MessageSquare size={32} />
              آراء العملاء
            </h1>
            <p className="testimonials__subtitle">
              قم بإدارة تقييمات وآراء العملاء (عربي / English)
            </p>
          </div>
          
          <motion.button
            className="testimonials__save-btn"
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
            className="testimonials__alert testimonials__alert--success"
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
            className="testimonials__alert testimonials__alert--error"
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
      <div className="testimonials__content">
        <motion.div
          className="testimonials__editor-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Section Settings */}
          <div className="section-settings-card">
            <h2 className="section-settings-card__title">إعدادات القسم</h2>
            
            <AnimatePresence mode="wait">
              {activeTab === 'ar' ? (
                <motion.div
                  key="ar-section"
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
                      value={sectionAr.badge}
                      onChange={(e) => setSectionAr({ ...sectionAr, badge: e.target.value })}
                      placeholder="آراء المتدربات"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">العنوان *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={sectionAr.title}
                      onChange={(e) => setSectionAr({ ...sectionAr, title: e.target.value })}
                      placeholder="قصص نجاح ملهمة"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">الوصف (اختياري)</label>
                    <textarea
                      className="form-textarea"
                      value={sectionAr.description}
                      onChange={(e) => setSectionAr({ ...sectionAr, description: e.target.value })}
                      rows="2"
                      placeholder="استمعي لتجارب متدرباتنا..."
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="en-section"
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
                      value={sectionEn.badge}
                      onChange={(e) => setSectionEn({ ...sectionEn, badge: e.target.value })}
                      placeholder="Client Testimonials"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={sectionEn.title}
                      onChange={(e) => setSectionEn({ ...sectionEn, title: e.target.value })}
                      placeholder="Inspiring Success Stories"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Description (Optional)</label>
                    <textarea
                      className="form-textarea"
                      value={sectionEn.description}
                      onChange={(e) => setSectionEn({ ...sectionEn, description: e.target.value })}
                      rows="2"
                      placeholder="Listen to our clients' experiences..."
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Testimonials List */}
          <div className="testimonials-list-card">
            <div className="testimonials-list-card__header">
              <h2 className="testimonials-list-card__title">قائمة الآراء</h2>
              <button
                className="testimonials-list-card__add-btn"
                onClick={handleAddTestimonial}
              >
                <Plus size={18} />
                إضافة رأي
              </button>
            </div>
            
            <div className="testimonials-list">
              <AnimatePresence>
                {testimonials.length === 0 ? (
                  <motion.div
                    className="testimonials-list__empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <MessageSquare size={48} />
                    <p>لا توجد آراء حالياً</p>
                    <p className="testimonials-list__empty-hint">
                      انقر على "إضافة رأي" لإضافة رأي جديد
                    </p>
                  </motion.div>
                ) : (
                  testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      className={`testimonial-item ${editingTestimonial === index ? 'testimonial-item--editing' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {editingTestimonial === index ? (
                        <div className="testimonial-item__form">
                          <div className="testimonial-item__form-header">
                            <div className="testimonial-item__image-upload">
                              <input
                                ref={el => fileInputRefs.current[index] = el}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageSelect(index, e)}
                                className="testimonial-item__image-input"
                              />
                              
                              {testimonial.image ? (
                                <div className="testimonial-item__image-preview">
                                  <img src={testimonial.image} alt="" />
                                  <button
                                    className="testimonial-item__image-remove"
                                    onClick={() => handleDeleteImage(index)}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  className="testimonial-item__image-placeholder"
                                  onClick={() => fileInputRefs.current[index]?.click()}
                                >
                                  <Upload size={20} />
                                  <span>صورة</span>
                                </div>
                              )}
                            </div>
                            
                            <button
                              className="testimonial-item__save-btn"
                              onClick={() => setEditingTestimonial(null)}
                            >
                              <Check size={18} />
                            </button>
                          </div>
                          
                          <AnimatePresence mode="wait">
                            {activeTab === 'ar' ? (
                              <motion.div
                                key="ar-testimonial"
                                className="testimonial-item__lang-fields"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                              >
                                <label className="testimonial-item__label">العربية</label>
                                <input
                                  type="text"
                                  className="testimonial-item__input"
                                  value={testimonial.name_ar}
                                  onChange={(e) => handleUpdateTestimonial(index, 'name_ar', e.target.value)}
                                  placeholder="الاسم"
                                />
                                
                                <input
                                  type="text"
                                  className="testimonial-item__input"
                                  value={testimonial.title_ar}
                                  onChange={(e) => handleUpdateTestimonial(index, 'title_ar', e.target.value)}
                                  placeholder="المهنة"
                                />
                                
                                <textarea
                                  className="testimonial-item__textarea"
                                  value={testimonial.text_ar}
                                  onChange={(e) => handleUpdateTestimonial(index, 'text_ar', e.target.value)}
                                  placeholder="نص الرأي..."
                                  rows="3"
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="en-testimonial"
                                className="testimonial-item__lang-fields"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                              >
                                <label className="testimonial-item__label">English</label>
                                <input
                                  type="text"
                                  className="testimonial-item__input"
                                  value={testimonial.name_en}
                                  onChange={(e) => handleUpdateTestimonial(index, 'name_en', e.target.value)}
                                  placeholder="Name"
                                />
                                
                                <input
                                  type="text"
                                  className="testimonial-item__input"
                                  value={testimonial.title_en}
                                  onChange={(e) => handleUpdateTestimonial(index, 'title_en', e.target.value)}
                                  placeholder="Job Title"
                                />
                                
                                <textarea
                                  className="testimonial-item__textarea"
                                  value={testimonial.text_en}
                                  onChange={(e) => handleUpdateTestimonial(index, 'text_en', e.target.value)}
                                  placeholder="Testimonial text..."
                                  rows="3"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <div className="testimonial-item__rating-input">
                            <label>التقييم / Rating:</label>
                            <div className="rating-stars">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  className={`rating-star ${star <= testimonial.rating ? 'rating-star--active' : ''}`}
                                  onClick={() => handleUpdateTestimonial(index, 'rating', star)}
                                >
                                  <Star size={20} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="testimonial-item__display">
                          <div className="testimonial-item__avatar">
                            {testimonial.image ? (
                              <img src={testimonial.image} alt={testimonial.name_ar} />
                            ) : (
                              <div className="testimonial-item__avatar-placeholder">
                                {(activeTab === 'ar' ? testimonial.name_ar : testimonial.name_en).charAt(0) || '?'}
                              </div>
                            )}
                          </div>
                          
                          <div className="testimonial-item__content">
                            <div className="testimonial-item__name">
                              {activeTab === 'ar' ? testimonial.name_ar : testimonial.name_en}
                            </div>
                            <div className="testimonial-item__title">
                              {activeTab === 'ar' ? testimonial.title_ar : testimonial.title_en}
                            </div>
                            <div className="testimonial-item__stars">
                              {Array.from({ length: testimonial.rating }).map((_, i) => (
                                <Star key={i} size={14} fill="#ffc107" color="#ffc107" />
                              ))}
                            </div>
                            <p className="testimonial-item__text">
                              {activeTab === 'ar' ? testimonial.text_ar : testimonial.text_en}
                            </p>
                          </div>
                          
                          <div className="testimonial-item__actions">
                            <button
                              className="testimonial-item__action-btn"
                              onClick={() => setEditingTestimonial(index)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="testimonial-item__action-btn testimonial-item__action-btn--danger"
                              onClick={() => handleDeleteTestimonial(index)}
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

export default Testimonials;