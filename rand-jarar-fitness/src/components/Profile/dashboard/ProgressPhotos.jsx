import { Fragment, useRef, useState } from 'react';
import { FaCamera, FaArrowLeft, FaShieldAlt, FaCloudUploadAlt } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';
import dashboardApi from '../../../api/dashboardApi';

const ProgressPhotos = ({ photos, onRefresh, hasConsent }) => {
  const { t, currentLang } = useProfileLanguage();
  const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [consent, setConsent] = useState(hasConsent);
  const [pendingFile, setPendingFile] = useState(null);
  const [savingConsent, setSavingConsent] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingFile(file);
    e.target.value = '';
  };

  const handleUpload = async () => {
    if (!pendingFile || uploading) return;
    setUploading(true);
    try {
      await dashboardApi.uploadProgressPhoto(pendingFile, '', consent);
      setPendingFile(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleConsentToggle = async (checked) => {
    setConsent(checked);
    setSavingConsent(true);
    try {
      await dashboardApi.updateConsent(checked);
    } catch (err) {
      setConsent(!checked);
      console.error(err);
    } finally {
      setSavingConsent(false);
    }
  };

  return (
    <div className="dash-card">
      <div className="dash-card-title" dir={dir}>
        <FaCamera />
        <span>{t('صور التقدم', 'Progress photos')}</span>
      </div>

      <div className="photos-row">
        {photos.length === 0 ? (
          <div className="photos-empty">
            <FaCamera style={{ fontSize: 28, opacity: 0.3 }} />
            <p>{t('لا توجد صور بعد', 'No photos yet')}</p>
          </div>
        ) : (
          photos.map((photo, i) => (
            <Fragment key={photo.id || i}>
              {i > 0 && <div className="photo-arrow"><FaArrowLeft /></div>}
              <div className="photo-item">
                <img src={photo.photo_url} alt="" loading="lazy" />
                <div className="photo-label">
                  {t(`أسبوع ${i + 1}`, `Week ${i + 1}`)}
                  {photo.weight_at_photo && ` — ${photo.weight_at_photo} ${t('كغ', 'kg')}`}
                </div>
              </div>
            </Fragment>
          ))
        )}
      </div>

      <div className="photo-upload-strip" dir={dir}>
        <div className="upload-left">
          {!pendingFile ? (
            <button className="upload-pick-btn" onClick={() => fileRef.current?.click()}>
              <FaCloudUploadAlt />
              <span>{t('اختر صورة جديدة', 'Choose new photo')}</span>
            </button>
          ) : (
            <div className="upload-preview-row">
              <img src={URL.createObjectURL(pendingFile)} alt="" className="upload-thumb" />
              <div className="upload-preview-actions">
                <button className="upload-change" onClick={() => fileRef.current?.click()}>
                  {t('تغيير', 'Change')}
                </button>
                <button className="upload-submit" onClick={handleUpload} disabled={uploading}>
                  {uploading ? '...' : t('رفع', 'Upload')}
                </button>
                <button className="upload-cancel" onClick={() => setPendingFile(null)}>
                  {t('إلغاء', 'Cancel')}
                </button>
              </div>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileSelect} />
        </div>

        <div className={`consent-strip ${consent ? 'agreed' : ''}`} dir={dir}>
          <label className="consent-label-row">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => handleConsentToggle(e.target.checked)}
              disabled={savingConsent}
            />
            <span className="consent-check" />
            <FaShieldAlt className="consent-shield" />
            <span className="consent-msg">
              {t(
                'أوافق على استخدام صوري لأغراض تسويقية مع الحفاظ على خصوصيتي.',
                'I agree to let my photos be used for marketing while keeping my privacy.'
              )}
            </span>
          </label>
          <span className="consent-optional">
            {t('* يمكنك تغيير رأيك بأي وقت', '* You can change your mind anytime')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressPhotos;