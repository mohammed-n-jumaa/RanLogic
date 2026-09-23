import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  Info,
  Monitor,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import logoApi from '../../../api/logoApi';
import './LogoBranding.scss';

const LogoBranding = () => {
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVariation, setActiveVariation] = useState('light');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchActiveLogo();
  }, []);

  const fetchActiveLogo = async () => {
    setIsLoading(true);
    try {
      const response = await logoApi.getActiveLogo();
      if (response.success && response.data) {
        setLogoPreview(response.data.file_url);
        setLogo({
          name: response.data.file_name,
          size: response.data.file_size,
          type: response.data.file_type,
        });
      }
    } catch (error) {
      console.error('Error fetching active logo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    const validation = logoApi.validateFile(file);
    if (!validation.isValid) {
      setUploadStatus('error');
      setStatusMessage(validation.error);
      setTimeout(() => {
        setUploadStatus(null);
        setStatusMessage('');
      }, 4000);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
      setLogo(file);
      setUploadStatus(null);
      setStatusMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSaveLogo = async () => {
    if (!logo || !(logo instanceof File)) {
      setUploadStatus('error');
      setStatusMessage('الرجاء اختيار ملف جديد للرفع');
      setTimeout(() => {
        setUploadStatus(null);
        setStatusMessage('');
      }, 3000);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await logoApi.uploadLogo(logo, (progress) => {
        setUploadProgress(progress);
      });

      if (response.success) {
        setUploadStatus('success');
        setStatusMessage(response.message);

        if (response.data) {
          setLogoPreview(response.data.file_url);
          setLogo({
            name: response.data.file_name,
            size: response.data.file_size,
            type: response.data.file_type,
          });
        }

        setTimeout(() => {
          setUploadStatus(null);
          setStatusMessage('');
          setUploadProgress(0);
        }, 3000);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setUploadStatus('error');
      setStatusMessage(error.message || 'حدث خطأ أثناء رفع الشعار');

      setTimeout(() => {
        setUploadStatus(null);
        setStatusMessage('');
        setUploadProgress(0);
      }, 4000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    setUploadStatus(null);
    setStatusMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadLogo = () => {
    if (logoPreview) {
      const link = document.createElement('a');
      link.href = logoPreview;
      link.download = logo?.name || 'logo.png';
      link.click();
    }
  };

  const variations = [
    { id: 'light', label: 'فاتحة', icon: <Sun size={14} /> },
    { id: 'dark', label: 'داكنة', icon: <Moon size={14} /> },
    { id: 'pink', label: 'وردية', icon: <Sparkles size={14} /> },
  ];

  if (isLoading) {
    return (
      <div className="lb">
        <div className="lb__loader">
          <div className="lb__loader-spinner" />
          <span>جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lb">
      {/* ── Toast Notifications ── */}
      <AnimatePresence>
        {uploadStatus && (
          <motion.div
            className={`lb__toast lb__toast--${uploadStatus}`}
            initial={{ opacity: 0, y: -30, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -30, x: '-50%' }}
          >
            {uploadStatus === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>
              {statusMessage || (uploadStatus === 'success' ? 'تم حفظ الشعار بنجاح!' : 'خطأ: يرجى رفع صورة صالحة')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Upload Progress ── */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            className="lb__progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="lb__progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Layout ── */}
      <div className="lb__grid">
        {/* ──────── LEFT: Upload Area ──────── */}
        <motion.div
          className="lb__upload"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="lb__upload-head">
            <div>
              <h1 className="lb__title">الشعار والعلامة التجارية</h1>
              <p className="lb__desc">ارفع شعار موقعك ليظهر في الهيدر وجميع الصفحات</p>
            </div>
            {logo && logo instanceof File && (
              <motion.button
                className="lb__save"
                onClick={handleSaveLogo}
                disabled={isUploading}
                whileTap={{ scale: 0.97 }}
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={16} className="lb__spin" />
                    <span>جاري الحفظ {uploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>حفظ</span>
                  </>
                )}
              </motion.button>
            )}
          </div>

          {!logoPreview ? (
            /* ── Empty: Drop Zone ── */
            <div
              className={`lb__dropzone ${isDragging ? 'lb__dropzone--active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                onChange={handleFileSelect}
                hidden
              />
              <motion.div
                className="lb__dropzone-icon"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Upload size={32} />
              </motion.div>
              <p className="lb__dropzone-title">
                اسحب الشعار هنا أو <span>تصفح الملفات</span>
              </p>
              <div className="lb__dropzone-meta">
                <span>PNG, JPG, SVG, WEBP</span>
                <span className="lb__dropzone-dot" />
                <span>أقصى 5MB</span>
                <span className="lb__dropzone-dot" />
                <span>200×60 موصى</span>
              </div>
            </div>
          ) : (
            /* ── Has Logo: Preview + Info ── */
            <div className="lb__current">
              <div className="lb__current-preview">
                <img src={logoPreview} alt="Logo" className="lb__current-img" />
                <div className="lb__current-actions">
                  <button
                    className="lb__icon-btn"
                    onClick={handleDownloadLogo}
                    title="تحميل"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    className="lb__icon-btn lb__icon-btn--danger"
                    onClick={handleRemoveLogo}
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {logo && (
                <div className="lb__meta-row">
                  <div className="lb__meta-item">
                    <span className="lb__meta-label">الملف</span>
                    <span className="lb__meta-value">{logo.name}</span>
                  </div>
                  <div className="lb__meta-item">
                    <span className="lb__meta-label">الحجم</span>
                    <span className="lb__meta-value">
                      {(logo.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="lb__meta-item">
                    <span className="lb__meta-label">النوع</span>
                    <span className="lb__meta-value">{logo.type}</span>
                  </div>
                </div>
              )}

              <button
                className="lb__change"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={15} />
                تغيير الشعار
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                onChange={handleFileSelect}
                hidden
              />
            </div>
          )}

          {/* ── Guidelines ── */}
          <div className="lb__tips">
            <div className="lb__tips-head">
              <Info size={15} /> إرشادات
            </div>
            <div className="lb__tips-list">
              <span>خلفية شفافة PNG</span>
              <span>شعار أفقي 3:1</span>
              <span>واضح على الفاتح والداكن</span>
              <span>دقة 300 DPI</span>
            </div>
          </div>
        </motion.div>

        {/* ──────── RIGHT: Live Preview ──────── */}
        <motion.div
          className="lb__preview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="lb__preview-label">
            <Monitor size={16} />
            <span>معاينة مباشرة</span>
          </div>

          {/* Browser Mockup */}
          <div className="lb__browser">
            <div className="lb__browser-bar">
              <div className="lb__browser-dots">
                <i />
                <i />
                <i />
              </div>
              <div className="lb__browser-url">
                <span>randjarar.com</span>
              </div>
            </div>

            <div className="lb__browser-nav">
              <div className="lb__browser-logo">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" />
                ) : (
                  <div className="lb__browser-logo-ph">
                    <ImageIcon size={18} /> RAND JARAR
                  </div>
                )}
              </div>
              <div className="lb__browser-links">
                <span className="active">الرئيسية</span>
                <span>الأسئلة الشائعة</span>
                <span>عن المدربة</span>
                <span>آراء المتدربات</span>
              </div>
              <button className="lb__browser-cta">احجزي الآن</button>
            </div>

            <div className="lb__browser-hero">
              <h2>ابدأي رحلتك نحو جسم أقوى</h2>
              <p>برامج تدريبية مخصصة مع المدربة رند جرار</p>
            </div>
          </div>

          {/* Variation Tabs */}
          <div className="lb__var">
            <div className="lb__var-tabs">
              {variations.map((v) => (
                <button
                  key={v.id}
                  className={`lb__var-tab ${activeVariation === v.id ? 'lb__var-tab--active' : ''}`}
                  onClick={() => setActiveVariation(v.id)}
                >
                  {v.icon} {v.label}
                </button>
              ))}
            </div>

            <motion.div
              className={`lb__var-stage lb__var-stage--${activeVariation}`}
              key={activeVariation}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              {logoPreview ? (
                <img src={logoPreview} alt={`Logo on ${activeVariation}`} />
              ) : (
                <div className="lb__var-ph">
                  <ImageIcon size={28} />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LogoBranding;