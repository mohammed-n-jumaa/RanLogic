import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Upload,
  Play,
  Pause,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Languages,
  Globe
} from 'lucide-react';
import Swal from 'sweetalert2';
import heroApi from '../../../api/heroApi';
import './HeroSection.scss';

const HeroSection = () => {
  // Video State
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Language Tab State
  const [activeTab, setActiveTab] = useState('ar'); // 'ar' or 'en'
  
  // English Content State
  const [contentEn, setContentEn] = useState({
    badge: '',
    mainTitle: '',
    subTitle: '',
    description: ''
  });
  
  // Arabic Content State
  const [contentAr, setContentAr] = useState({
    badge: '',
    mainTitle: '',
    subTitle: '',
    description: ''
  });
  
  // Stats State (with bilingual labels)
  const [stats, setStats] = useState([]);
  
  const [editingStat, setEditingStat] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data on mount
  useEffect(() => {
    fetchHeroSection();
  }, []);
  
  // Fetch hero section data
  const fetchHeroSection = async () => {
    setIsLoading(true);
    try {
      const response = await heroApi.getHeroSection();
      
      if (response.success) {
        const { data } = response;
        
        // Set video
        setVideoPreview(data.video_url);
        
        // Set English content
        setContentEn({
          badge: data.badge_en || '',
          mainTitle: data.main_title_en || '',
          subTitle: data.sub_title_en || '',
          description: data.description_en || ''
        });
        
        // Set Arabic content
        setContentAr({
          badge: data.badge_ar || '',
          mainTitle: data.main_title_ar || '',
          subTitle: data.sub_title_ar || '',
          description: data.description_ar || ''
        });
        
        // Set stats
        setStats(data.stats || []);
      }
    } catch (error) {
      console.error('Error fetching hero section:', error);
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
  
  // Handle Video Upload
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processVideo(file);
    }
  };
  
  const processVideo = async (file) => {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      Swal.fire({
        title: 'خطأ',
        text: 'يرجى اختيار ملف فيديو صالح',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      Swal.fire({
        title: 'خطأ',
        text: 'حجم الفيديو يجب أن لا يتجاوز 50MB',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoPreview(reader.result);
      setVideo(file);
    };
    reader.readAsDataURL(file);
    
    // Upload to server
    try {
      setUploadProgress(0);
      
      const response = await heroApi.uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });
      
      if (response.success) {
        setVideoPreview(response.data.video_url);
        
        Swal.fire({
          title: 'نجح',
          text: 'تم رفع الفيديو بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Swal.fire({
        title: 'خطأ',
        text: error.response?.data?.message || 'فشل رفع الفيديو',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    } finally {
      setUploadProgress(0);
    }
  };
  
  // Handle Drag and Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processVideo(file);
    }
  };
  
  // Video Controls
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  
  // Handle delete video
  const handleDeleteVideo = async () => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف الفيديو؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      const response = await heroApi.deleteVideo();
      
      if (response.success) {
        setVideo(null);
        setVideoPreview(null);
        setIsVideoPlaying(false);
        
        Swal.fire({
          title: 'تم الحذف',
          text: 'تم حذف الفيديو بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل حذف الفيديو',
        icon: 'error',
        confirmButtonColor: '#e91e63'
      });
    }
  };
  
  // Content handlers
  const handleContentChange = (field, value, lang) => {
    if (lang === 'en') {
      setContentEn(prev => ({ ...prev, [field]: value }));
    } else {
      setContentAr(prev => ({ ...prev, [field]: value }));
    }
  };
  
  // Stats Management
  const handleAddStat = () => {
    const newStat = {
      id: null,
      value: '',
      label_en: '',
      label_ar: ''
    };
    setStats([...stats, newStat]);
    setEditingStat(stats.length); // Edit the new stat
  };
  
  const handleEditStat = (index) => {
    setEditingStat(index);
  };
  
  const handleUpdateStat = (index, field, value) => {
    const updatedStats = [...stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    setStats(updatedStats);
  };
  
  const handleDeleteStat = (index) => {
    setStats(stats.filter((_, i) => i !== index));
  };
  
  const handleSaveChanges = async () => {
    // Validate required fields
    if (!contentAr.mainTitle && !contentEn.mainTitle) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى إدخال العنوان الرئيسي على الأقل بلغة واحدة',
        icon: 'warning',
        confirmButtonColor: '#e91e63'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const data = {
        // English content
        badge_en: contentEn.badge,
        main_title_en: contentEn.mainTitle,
        sub_title_en: contentEn.subTitle,
        description_en: contentEn.description,
        
        // Arabic content
        badge_ar: contentAr.badge,
        main_title_ar: contentAr.mainTitle,
        sub_title_ar: contentAr.subTitle,
        description_ar: contentAr.description,
        
        // Stats
        stats: stats.map((stat, index) => ({
          id: stat.id,
          value: stat.value,
          label_en: stat.label_en,
          label_ar: stat.label_ar,
          order: index
        }))
      };
      
      const response = await heroApi.updateHeroSection(data);
      
      if (response.success) {
        setUploadStatus('success');
        setTimeout(() => setUploadStatus(null), 3000);
        
        Swal.fire({
          title: 'نجح',
          text: 'تم حفظ التغييرات بنجاح',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Refresh data
        await fetchHeroSection();
        setEditingStat(null);
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
      <div className="hero-section">
        <div className="hero-section__loading">
          <div className="spinner-large"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="hero-section">
      {/* Page Header */}
      <motion.div
        className="hero-section__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hero-section__header-content">
          <div className="hero-section__title-section">
            <h1 className="hero-section__title">
              <Video size={32} />
              إدارة واجهة الموقع
            </h1>
            <p className="hero-section__subtitle">
              قم بتحرير محتوى القسم الرئيسي وفيديو الخلفية (عربي / English)
            </p>
          </div>
          
          <motion.button
            className="hero-section__save-btn"
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
            className="hero-section__alert hero-section__alert--success"
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
            className="hero-section__alert hero-section__alert--error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle size={20} />
            <span>خطأ: فشل حفظ التغييرات</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="hero-section__content">
        {/* Left Side - Video Upload */}
        <motion.div
          className="hero-section__video-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Video Upload */}
          <div className="video-upload-card">
            <h2 className="video-upload-card__title">
              <Video size={24} />
              فيديو الخلفية
            </h2>
            
            {!videoPreview ? (
              <div
                className="video-dropzone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="video-dropzone__input"
                />
                
                <div className="video-dropzone__content">
                  <motion.div
                    className="video-dropzone__icon"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Upload size={48} />
                  </motion.div>
                  
                  <h3 className="video-dropzone__title">
                    اسحب وأفلت الفيديو هنا
                  </h3>
                  <p className="video-dropzone__subtitle">أو</p>
                  <button className="video-dropzone__button">
                    تصفح الملفات
                  </button>
                  
                  <div className="video-dropzone__info">
                    <p>الصيغ المدعومة: MP4, WEBM, MOV</p>
                    <p>الحجم الأقصى: 50MB</p>
                    <p>الأبعاد الموصى بها: 1920x1080</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="video-preview">
                <div className="video-preview__container">
                  <video
                    ref={videoRef}
                    src={videoPreview}
                    className="video-preview__video"
                    loop
                    muted
                    playsInline
                  />
                  
                  <div className="video-preview__overlay">
                    <button
                      className="video-preview__play-btn"
                      onClick={toggleVideo}
                    >
                      {isVideoPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                  </div>
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="video-preview__progress">
                    <div className="video-preview__progress-bar">
                      <div 
                        className="video-preview__progress-fill"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="video-preview__progress-text">
                      {uploadProgress}%
                    </span>
                  </div>
                )}
                
                <div className="video-preview__actions">
                  <button
                    className="video-preview__action-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={18} />
                    تغيير الفيديو
                  </button>
                  
                  <button
                    className="video-preview__action-btn video-preview__action-btn--danger"
                    onClick={handleDeleteVideo}
                  >
                    <Trash2 size={18} />
                    حذف
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Right Side - Content Editor */}
        <motion.div
          className="hero-section__editor-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
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
          
          {/* Content Editor */}
          <div className="content-editor-card">
            <h2 className="content-editor-card__title">
              <Edit2 size={24} />
              {activeTab === 'ar' ? 'تحرير المحتوى - عربي' : 'Edit Content - English'}
            </h2>
            
            <AnimatePresence mode="wait">
              {activeTab === 'ar' ? (
                <motion.div
                  key="ar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="form-group">
                    <label className="form-label">الشارة العلوية</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contentAr.badge}
                      onChange={(e) => handleContentChange('badge', e.target.value, 'ar')}
                      placeholder="برنامج تدريبي مخصص لكِ"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">العنوان الرئيسي</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contentAr.mainTitle}
                      onChange={(e) => handleContentChange('mainTitle', e.target.value, 'ar')}
                      placeholder="درّبي جسمك بثقة"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">العنوان الفرعي</label>
                    <input
                      type="text"
                      className="form-input form-input--highlight"
                      value={contentAr.subTitle}
                      onChange={(e) => handleContentChange('subTitle', e.target.value, 'ar')}
                      placeholder="برنامج مصمم خصيصًا لك"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">الوصف</label>
                    <textarea
                      className="form-textarea"
                      value={contentAr.description}
                      onChange={(e) => handleContentChange('description', e.target.value, 'ar')}
                      placeholder="أدخل الوصف..."
                      rows="4"
                    />
                    <p className="form-hint">
                      استخدم Enter للانتقال إلى سطر جديد
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="en"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="form-group">
                    <label className="form-label">Top Badge</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contentEn.badge}
                      onChange={(e) => handleContentChange('badge', e.target.value, 'en')}
                      placeholder="Personalized Training Program"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Main Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contentEn.mainTitle}
                      onChange={(e) => handleContentChange('mainTitle', e.target.value, 'en')}
                      placeholder="Train Your Body with Confidence"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Sub Title</label>
                    <input
                      type="text"
                      className="form-input form-input--highlight"
                      value={contentEn.subTitle}
                      onChange={(e) => handleContentChange('subTitle', e.target.value, 'en')}
                      placeholder="A program designed especially for you"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      value={contentEn.description}
                      onChange={(e) => handleContentChange('description', e.target.value, 'en')}
                      placeholder="Enter description..."
                      rows="4"
                    />
                    <p className="form-hint">
                      Press Enter to start a new line
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Stats Editor */}
          <div className="stats-editor-card">
            <div className="stats-editor-card__header">
              <h2 className="stats-editor-card__title">الإحصائيات / Statistics</h2>
              <button
                className="stats-editor-card__add-btn"
                onClick={handleAddStat}
              >
                <Plus size={18} />
                إضافة / Add
              </button>
            </div>
            
            <div className="stats-list">
              <AnimatePresence>
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className={`stat-item ${editingStat === index ? 'stat-item--editing' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {editingStat === index ? (
                      <div className="stat-item__form">
                        <div className="stat-item__inputs">
                          <input
                            type="text"
                            className="stat-item__input stat-item__input--value"
                            value={stat.value}
                            onChange={(e) => handleUpdateStat(index, 'value', e.target.value)}
                            placeholder="500+"
                          />
                          <div className="stat-item__lang-inputs">
                            <input
                              type="text"
                              className="stat-item__input"
                              value={stat.label_ar}
                              onChange={(e) => handleUpdateStat(index, 'label_ar', e.target.value)}
                              placeholder="عربي: متدربة سعيدة"
                            />
                            <input
                              type="text"
                              className="stat-item__input"
                              value={stat.label_en}
                              onChange={(e) => handleUpdateStat(index, 'label_en', e.target.value)}
                              placeholder="EN: Happy Trainees"
                            />
                          </div>
                        </div>
                        <button
                          className="stat-item__save-btn"
                          onClick={() => setEditingStat(null)}
                        >
                          <Check size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="stat-item__display">
                        <div className="stat-item__content">
                          <div className="stat-item__value">{stat.value}</div>
                          <div className="stat-item__labels">
                            <div className="stat-item__label stat-item__label--ar">
                              {stat.label_ar}
                            </div>
                            <div className="stat-item__label stat-item__label--en">
                              {stat.label_en}
                            </div>
                          </div>
                        </div>
                        <div className="stat-item__actions">
                          <button
                            className="stat-item__action-btn"
                            onClick={() => handleEditStat(index)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="stat-item__action-btn stat-item__action-btn--danger"
                            onClick={() => handleDeleteStat(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {stats.length === 0 && (
              <div className="stats-list__empty">
                <p>لا توجد إحصائيات. انقر على "إضافة" للبدء.</p>
                <p className="stats-list__empty-en">No statistics. Click "Add" to start.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;