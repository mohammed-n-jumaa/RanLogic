import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle,
  User,
  Image as ImageIcon,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Trash2
} from 'lucide-react';
import './ProfilePhotoUpload.scss';
import { t } from '../../../i18n';
import notify from '../../../lib/notify';

const ProfilePhotoUpload = ({ currentPhoto, onUpload, isLoading }) => {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(currentPhoto);
  const [croppedPhoto, setCroppedPhoto] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (!file.type.match('image.*')) {
      notify.warning(t('الرجاء اختيار صورة فقط'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify.warning(t('حجم الصورة يجب أن يكون أقل من 5 ميجابايت'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhoto(file);
      setPreview(e.target.result);
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleCrop = () => {
    if (!preview) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    image.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      
      // تطبيق التحويلات
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // نقل إلى مركز الصورة
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // تطبيق التكبير والدوران
      ctx.scale(zoom, zoom);
      ctx.rotate((rotation * Math.PI) / 180);
      
      // رسم الصورة
      ctx.drawImage(
        image,
        -image.width / 2,
        -image.height / 2,
        image.width,
        image.height
      );
      
      ctx.restore();
      
      const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
      setCroppedPhoto(croppedImage);
    };
    
    image.src = preview;
  };

  const handleSave = () => {
    if (croppedPhoto) {
      onUpload(croppedPhoto);
      setPhoto(null);
      setPreview(croppedPhoto);
      setCroppedPhoto(null);
      setIsEditing(false);
      setZoom(1);
      setRotation(0);
    } else if (preview) {
      onUpload(preview);
      setPhoto(null);
      setIsEditing(false);
    }
  };

  const handleReset = () => {
    setPhoto(null);
    setPreview(currentPhoto);
    setCroppedPhoto(null);
    setIsEditing(false);
    setZoom(1);
    setRotation(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPhoto(null);
    setPreview(null);
    setCroppedPhoto(null);
    setIsEditing(false);
    setZoom(1);
    setRotation(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="profile-photo-upload">
      <div className="upload-header">
        <Camera size={28} />
        <div className="header-content">
          <h2>{t('الصورة الشخصية')}</h2>
          <p>{t('قم بتحديث صورتك الشخصية لجعل حسابك أكثر تميزاً')}</p>
        </div>
      </div>

      <div className="upload-container">
        {/* المنطقة الرئيسية للتحميل والمعاينة */}
        <div className="main-area">
          {/* معاينة الصورة */}
          <div className="preview-section">
            <h3>{t('معاينة الصورة')}</h3>
            <div className="preview-container">
              {preview ? (
                <div className="photo-preview">
                  <img 
                    src={croppedPhoto || preview} 
                    alt="Profile Preview" 
                    className="preview-image"
                  />
                  <div className="preview-overlay">
                    <div className="preview-info">
                      {photo && (
                        <div className="file-info">
                          <span className="file-name">{photo.name}</span>
                          <span className="file-size">{formatFileSize(photo.size)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-photo">
                  <User size={64} />
                  <p>{t('لا توجد صورة شخصية')}</p>
                  <span>{t('قم بتحميل صورة لعرضها هنا')}</span>
                </div>
              )}
            </div>

            {/* أدوات التعديل */}
            {isEditing && (
              <div className="edit-tools">
                <div className="tool-group">
                  <button 
                    type="button" 
                    className="tool-btn"
                    onClick={handleZoomOut}
                    title={t('تصغير')}
                  >
                    <ZoomOut size={18} />
                  </button>
                  <span className="zoom-level">{zoom.toFixed(1)}x</span>
                  <button 
                    type="button" 
                    className="tool-btn"
                    onClick={handleZoomIn}
                    title={t('تكبير')}
                  >
                    <ZoomIn size={18} />
                  </button>
                </div>

                <div className="tool-group">
                  <button 
                    type="button" 
                    className="tool-btn"
                    onClick={handleRotate}
                    title={t('تدوير 90 درجة')}
                  >
                    <RotateCw size={18} />
                  </button>
                  <span className="rotation-angle">{rotation}°</span>
                </div>

                <button 
                  type="button" 
                  className="crop-btn"
                  onClick={handleCrop}
                >
                  <CheckCircle size={18} />
                  <span>{t('قص الصورة')}</span>
                </button>
              </div>
            )}
          </div>

          {/* منطقة التحميل */}
          <div className="upload-section">
            <h3>{t('رفع صورة جديدة')}</h3>
            <div 
              className={`upload-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="file-input"
                id="profile-photo"
              />
              
              <div className="upload-content">
                <Upload size={48} />
                <div className="upload-text">
                  <p className="upload-title">{t('اسحب وأفلت الصورة هنا')}</p>
                  <p className="upload-subtitle">{t('أو انقر للاختيار من الجهاز')}</p>
                </div>
                <div className="upload-requirements">
                  <span>{t('JPG, PNG, GIF بحد أقصى 5MB')}</span>
                </div>
              </div>
            </div>

            {/* نصائح الصورة */}
            <div className="photo-tips">
              <h4>{t('نصائح للصورة المثالية:')}</h4>
              <ul className="tips-list">
                <li>{t('وجه واضح وضوح كامل')}</li>
                <li>{t('خلفية محايدة وبسيطة')}</li>
                <li>{t('إضاءة جيدة بدون ظلال')}</li>
                <li>{t('تعبير وجه ودود وابتسامة لطيفة')}</li>
                <li>{t('تجنب الصور الجماعية أو المرشحات')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* أزرار الإجراء */}
        <div className="action-buttons">
          {preview && (
            <button 
              type="button" 
              className="remove-btn"
              onClick={handleRemove}
            >
              <Trash2 size={20} />
              <span>{t('حذف الصورة')}</span>
            </button>
          )}
          
          <div className="right-actions">
            <button 
              type="button" 
              className="reset-btn"
              onClick={handleReset}
              disabled={!photo && preview === currentPhoto}
            >
              <X size={20} />
              <span>{t('إلغاء')}</span>
            </button>
            
            <button 
              type="button" 
              className="save-btn"
              onClick={handleSave}
              disabled={!photo && preview === currentPhoto}
            >
              {isLoading ? (
                <>
                  <div className="spinner-small"></div>
                  <span>{t('جاري الحفظ...')}</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>{t('حفظ الصورة')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* معلومات الصورة */}
        <div className="photo-info">
          <div className="info-card">
            <ImageIcon size={20} />
            <div className="info-content">
              <h5>{t('أبعاد الصورة الموصى بها')}</h5>
              <p>{t('300 × 300 بيكسل (1:1)')}</p>
            </div>
          </div>
          
          <div className="info-card">
            <CheckCircle size={20} />
            <div className="info-content">
              <h5>{t('تنسيقات مدعومة')}</h5>
              <p>JPG, PNG, GIF, WebP</p>
            </div>
          </div>
          
          <div className="info-card">
            <Upload size={20} />
            <div className="info-content">
              <h5>{t('الحجم الأقصى')}</h5>
              <p>{t('5 ميجابايت')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas مخفي للقص */}
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ProfilePhotoUpload;