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
  Globe,
  GripVertical
} from 'lucide-react';
import Swal from 'sweetalert2';
import heroApi from '../../../api/heroApi';
import './HeroSection.scss';

const HeroSection = () => {
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('ar');
  const [contentEn, setContentEn] = useState({
    badge: '',
    mainTitle: '',
    subTitle: '',
    description: '',
  });
  const [contentAr, setContentAr] = useState({
    badge: '',
    mainTitle: '',
    subTitle: '',
    description: '',
  });
  const [stats, setStats] = useState([]);
  const [editingStat, setEditingStat] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeroSection();
  }, []);

  const fetchHeroSection = async () => {
    setIsLoading(true);
    try {
      const response = await heroApi.getHeroSection();
      if (response.success) {
        const { data } = response;
        setVideoPreview(data.video_url);
        setContentEn({
          badge: data.badge_en || '',
          mainTitle: data.main_title_en || '',
          subTitle: data.sub_title_en || '',
          description: data.description_en || '',
        });
        setContentAr({
          badge: data.badge_ar || '',
          mainTitle: data.main_title_ar || '',
          subTitle: data.sub_title_ar || '',
          description: data.description_ar || '',
        });
        setStats(data.stats || []);
      }
    } catch (error) {
      console.error('Error fetching hero section:', error);
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

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processVideo(file);
    }
  };

  const processVideo = async (file) => {
    if (!file.type.startsWith('video/')) {
      Swal.fire({
        title: 'خطأ',
        text: 'يرجى اختيار ملف فيديو صالح',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      Swal.fire({
        title: 'خطأ',
        text: 'حجم الفيديو يجب أن لا يتجاوز 50MB',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoPreview(reader.result);
      setVideo(file);
    };
    reader.readAsDataURL(file);

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
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Swal.fire({
        title: 'خطأ',
        text: error.response?.data?.message || 'فشل رفع الفيديو',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      processVideo(file);
    }
  };

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

  const handleDeleteVideo = async () => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف الفيديو؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#607d8b',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
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
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      Swal.fire({
        title: 'خطأ',
        text: 'فشل حذف الفيديو',
        icon: 'error',
        confirmButtonColor: '#e91e63',
      });
    }
  };

  const handleContentChange = (field, value, lang) => {
    if (lang === 'en') {
      setContentEn((prev) => ({ ...prev, [field]: value }));
    } else {
      setContentAr((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddStat = () => {
    setStats([...stats, { id: null, value: '', label_en: '', label_ar: '' }]);
    setEditingStat(stats.length);
  };

  const handleEditStat = (index) => {
    setEditingStat(index);
  };

  const handleUpdateStat = (index, field, value) => {
    const updatedStats = [...stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    setStats(updatedStats);
  };

  const handleDeleteStat = (index) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    if (!contentAr.mainTitle && !contentEn.mainTitle) {
      Swal.fire({
        title: 'تنبيه',
        text: 'يرجى إدخال العنوان الرئيسي على الأقل بلغة واحدة',
        icon: 'warning',
        confirmButtonColor: '#e91e63',
      });
      return;
    }

    setIsSaving(true);

    try {
      const data = {
        badge_en: contentEn.badge,
        main_title_en: contentEn.mainTitle,
        sub_title_en: contentEn.subTitle,
        description_en: contentEn.description,
        badge_ar: contentAr.badge,
        main_title_ar: contentAr.mainTitle,
        sub_title_ar: contentAr.subTitle,
        description_ar: contentAr.description,
        stats: stats.map((s, i) => ({
          id: s.id,
          value: s.value,
          label_en: s.label_en,
          label_ar: s.label_ar,
          order: i,
        })),
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
          showConfirmButton: false,
        });

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
        confirmButtonColor: '#e91e63',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const content = activeTab === 'ar' ? contentAr : contentEn;
  const isAr = activeTab === 'ar';

  const fields = [
    {
      key: 'badge',
      label: isAr ? 'الشارة العلوية' : 'Top Badge',
      ph: isAr ? 'برنامج تدريبي مخصص لكِ' : 'Personalized Training Program',
    },
    {
      key: 'mainTitle',
      label: isAr ? 'العنوان الرئيسي' : 'Main Title',
      ph: isAr ? 'درّبي جسمك بثقة' : 'Train Your Body with Confidence',
      highlight: false,
    },
    {
      key: 'subTitle',
      label: isAr ? 'العنوان الفرعي' : 'Sub Title',
      ph: isAr ? 'برنامج مصمم خصيصًا لك' : 'A program designed especially for you',
      highlight: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="hs">
        <div className="hs__loader">
          <div className="hs__loader-spin" />
          <span>جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="hs">
      {/* ── Top Bar ── */}
      <div className="hs__topbar">
        <div>
          <h1 className="hs__title">إدارة واجهة الموقع</h1>
          <p className="hs__desc">
            تحرير محتوى الواجهة الرئيسية وفيديو الخلفية — عربي / English
          </p>
        </div>
        <motion.button
          className="hs__save"
          onClick={handleSaveChanges}
          disabled={isSaving}
          whileTap={{ scale: 0.97 }}
        >
          {isSaving ? (
            <>
              <div className="hs__spinner" />
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

      {/* ── Progress ── */}
      <AnimatePresence>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <motion.div
            className="hs__progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="hs__progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
            <span className="hs__progress-pct">{uploadProgress}%</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Grid ── */}
      <div className="hs__grid">
        {/* ═══ COL 1: Content Editor ═══ */}
        <motion.div
          className="hs__col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Language Tabs */}
          <div className="hs__lang">
            <button
              className={`hs__lang-tab ${activeTab === 'ar' ? 'hs__lang-tab--on' : ''}`}
              onClick={() => setActiveTab('ar')}
            >
              <Globe size={15} /> العربية
            </button>
            <button
              className={`hs__lang-tab ${activeTab === 'en' ? 'hs__lang-tab--on' : ''}`}
              onClick={() => setActiveTab('en')}
            >
              <Languages size={15} /> English
            </button>
          </div>

          {/* Form Fields */}
          <AnimatePresence mode="wait">
            <motion.div
              className="hs__form"
              key={activeTab}
              initial={{ opacity: 0, x: isAr ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              dir={isAr ? 'rtl' : 'ltr'}
            >
              {fields.map((f) => (
                <div className="hs__field" key={f.key}>
                  <label className="hs__label">{f.label}</label>
                  <input
                    type="text"
                    className={`hs__input ${f.highlight ? 'hs__input--accent' : ''}`}
                    value={content[f.key]}
                    onChange={(e) =>
                      handleContentChange(f.key, e.target.value, activeTab)
                    }
                    placeholder={f.ph}
                  />
                </div>
              ))}

              <div className="hs__field">
                <label className="hs__label">
                  {isAr ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  className="hs__textarea"
                  value={content.description}
                  onChange={(e) =>
                    handleContentChange('description', e.target.value, activeTab)
                  }
                  placeholder={isAr ? 'أدخل الوصف...' : 'Enter description...'}
                  rows="3"
                />
                <span className="hs__hint">
                  {isAr
                    ? 'استخدم Enter للانتقال إلى سطر جديد'
                    : 'Press Enter to start a new line'}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <div className="hs__stats">
            <div className="hs__stats-head">
              <span className="hs__stats-title">الإحصائيات / Statistics</span>
              <button className="hs__stats-add" onClick={handleAddStat}>
                <Plus size={15} /> إضافة
              </button>
            </div>

            <div className="hs__stats-list">
              <AnimatePresence>
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className={`hs__stat ${editingStat === index ? 'hs__stat--edit' : ''}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {editingStat === index ? (
                      <div className="hs__stat-form">
                        <input
                          className="hs__stat-val-input"
                          value={stat.value}
                          onChange={(e) =>
                            handleUpdateStat(index, 'value', e.target.value)
                          }
                          placeholder="500+"
                        />
                        <input
                          className="hs__stat-lbl-input"
                          value={stat.label_ar}
                          onChange={(e) =>
                            handleUpdateStat(index, 'label_ar', e.target.value)
                          }
                          placeholder="عربي: متدربة سعيدة"
                          dir="rtl"
                        />
                        <input
                          className="hs__stat-lbl-input"
                          value={stat.label_en}
                          onChange={(e) =>
                            handleUpdateStat(index, 'label_en', e.target.value)
                          }
                          placeholder="EN: Happy Trainees"
                          dir="ltr"
                        />
                        <button
                          className="hs__stat-ok"
                          onClick={() => setEditingStat(null)}
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="hs__stat-row">
                        <div className="hs__stat-num">{stat.value}</div>
                        <div className="hs__stat-labels">
                          <span className="hs__stat-ar">{stat.label_ar}</span>
                          <span className="hs__stat-en">{stat.label_en}</span>
                        </div>
                        <div className="hs__stat-acts">
                          <button
                            className="hs__stat-btn"
                            onClick={() => handleEditStat(index)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="hs__stat-btn hs__stat-btn--del"
                            onClick={() => handleDeleteStat(index)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {stats.length === 0 && (
                <div className="hs__stats-empty">
                  <p>لا توجد إحصائيات بعد</p>
                  <p>No statistics yet</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ═══ COL 2: Video ═══ */}
        <motion.div
          className="hs__col"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="hs__vid-label">
            <Video size={15} /> فيديو الخلفية
          </div>

          {!videoPreview ? (
            <div
              className="hs__dropzone"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                hidden
              />
              <motion.div
                className="hs__dropzone-icon"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Upload size={28} />
              </motion.div>
              <p className="hs__dropzone-txt">
                اسحب الفيديو هنا أو <span>تصفح الملفات</span>
              </p>
              <div className="hs__dropzone-meta">
                <span>MP4, WEBM, MOV</span>
                <span className="hs__dot" />
                <span>أقصى 50MB</span>
                <span className="hs__dot" />
                <span>1920×1080</span>
              </div>
            </div>
          ) : (
            <div className="hs__player">
              <div className="hs__player-wrap">
                <video
                  ref={videoRef}
                  src={videoPreview}
                  className="hs__player-video"
                  loop
                  muted
                  playsInline
                />
                <div className="hs__player-overlay" onClick={toggleVideo}>
                  <button className="hs__play-btn">
                    {isVideoPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                </div>
              </div>

              <div className="hs__player-bar">
                <button
                  className="hs__player-act"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={15} /> تغيير الفيديو
                </button>
                <button
                  className="hs__player-act hs__player-act--del"
                  onClick={handleDeleteVideo}
                >
                  <Trash2 size={15} /> حذف
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
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

export default HeroSection;