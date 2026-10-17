import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Camera, CloudUpload, Shield, Loader2, X, RefreshCw, ImageOff, Maximize2 } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { useProfileFeedback } from '../profile/shell/feedbackContext';
import dashboardApi from '../../api/dashboardApi';
import PhotoLightbox from './PhotoLightbox';

const ProgressPhotos = ({ photos = [], onRefresh, hasConsent }) => {
  const { t } = useProfileLanguage();
  const { toast } = useProfileFeedback();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [consent, setConsent] = useState(hasConsent);
  const [pendingFile, setPendingFile] = useState(null);
  const [savingConsent, setSavingConsent] = useState(false);
  const [viewIndex, setViewIndex] = useState(null);           // open photo in the lightbox
  const [brokenIds, setBrokenIds] = useState(() => new Set()); // thumbnails whose file failed to load

  const captionOf = (i) => {
    const w = photos[i]?.weight_at_photo;
    return t(`أسبوع ${i + 1}`, `Week ${i + 1}`) + (w ? ` · ${parseFloat(w)} ${t('كغ', 'kg')}` : '');
  };

  const previewUrl = useMemo(() => (pendingFile ? URL.createObjectURL(pendingFile) : null), [pendingFile]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast(t('اختر صورة فقط', 'Please choose an image'), 'error');
      return;
    }
    setPendingFile(file);
  };

  const handleUpload = async () => {
    if (!pendingFile || uploading) return;
    setUploading(true);
    try {
      await dashboardApi.uploadProgressPhoto(pendingFile, '', consent);
      setPendingFile(null);
      toast(t('تم رفع الصورة 📸', 'Photo uploaded 📸'));
      onRefresh?.();
    } catch (err) {
      console.error(err);
      toast(t('ما قدرنا نرفع الصورة، جرّب كمان مرة', "Couldn't upload — please try again"), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleConsentToggle = async (checked) => {
    setConsent(checked);
    setSavingConsent(true);
    try {
      await dashboardApi.updateConsent(checked);
      toast(t('تم حفظ اختيارك', 'Preference saved'), 'info');
    } catch (err) {
      console.error(err);
      setConsent(!checked);
      toast(t('ما قدرنا نحفظ اختيارك', "Couldn't save your preference"), 'error');
    } finally {
      setSavingConsent(false);
    }
  };

  return (
    <section className="pf-card">
      <div className="pf-card__head">
        <h3 className="pf-card__title"><span className="pf-card__icon"><Camera /></span>{t('صور التقدّم', 'Progress photos')}</h3>
      </div>

      <div className="db-photos">
        {photos.map((photo, i) => (
          <button
            key={photo.id || i}
            type="button"
            className={`db-photo db-photo--btn ${brokenIds.has(i) ? 'is-broken' : ''}`}
            onClick={() => setViewIndex(i)}
            aria-label={t(`عرض ${captionOf(i)}`, `View ${captionOf(i)}`)}
          >
            {brokenIds.has(i)
              ? <span className="db-photo__missing"><ImageOff /></span>
              : <img src={photo.photo_url} alt="" loading="lazy" onError={() => setBrokenIds(prev => new Set(prev).add(i))} />}
            <span className="db-photo__zoom" aria-hidden="true"><Maximize2 /></span>
            <span className="db-photo__caption">{captionOf(i)}</span>
          </button>
        ))}

        {pendingFile ? (
          <figure className="db-photo db-photo--pending">
            <img src={previewUrl} alt="" />
            <div className="db-photo__actions">
              <button type="button" className="pf-btn pf-btn--primary pf-btn--sm" onClick={handleUpload} disabled={uploading}>
                {uploading ? <Loader2 className="pf-spin" /> : <CloudUpload />} {t('رفع', 'Upload')}
              </button>
              <button type="button" className="pf-icon-btn" onClick={() => fileRef.current?.click()} aria-label={t('تغيير', 'Change')}><RefreshCw /></button>
              <button type="button" className="pf-icon-btn" onClick={() => setPendingFile(null)} aria-label={t('إلغاء', 'Cancel')}><X /></button>
            </div>
          </figure>
        ) : (
          <button type="button" className="db-photo db-photo--add" onClick={() => fileRef.current?.click()}>
            <CloudUpload />
            <span>{t('أضف صورة', 'Add photo')}</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileSelect} />
      </div>

      {viewIndex !== null && (
        <PhotoLightbox
          photos={photos}
          index={viewIndex}
          onIndexChange={setViewIndex}
          onClose={() => setViewIndex(null)}
          captionOf={captionOf}
        />
      )}

      <label className={`db-consent ${consent ? 'is-on' : ''}`}>
        <input type="checkbox" checked={!!consent} onChange={e => handleConsentToggle(e.target.checked)} disabled={savingConsent} />
        <Shield />
        <span>
          {t('أوافق على استخدام صوري لأغراض تسويقية مع الحفاظ على خصوصيتي.', 'I agree to let my photos be used for marketing while keeping my privacy.')}
          <small>{t('تقدر تغيّر رأيك بأي وقت', 'You can change this anytime')}</small>
        </span>
      </label>
    </section>
  );
};

export default memo(ProgressPhotos);
