import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ImageOff, Download } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

/**
 * Full-screen viewer for progress photos.
 * ← / → (or swipe) to move, Esc or the backdrop to close.
 */
const PhotoLightbox = ({ photos, index, onIndexChange, onClose, captionOf }) => {
  const { t, isArabic } = useProfileLanguage();
  const [broken, setBroken] = useState(false);
  const touchX = useRef(null);
  const closeRef = useRef(null);
  const count = photos.length;
  const photo = photos[index];

  // In RTL the "next" arrow points left
  const go = (step) => {
    setBroken(false);
    onIndexChange((index + step + count) % count);
  };

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (count < 2) return;
      if (e.key === 'ArrowRight') go(isArabic ? -1 : 1);
      if (e.key === 'ArrowLeft') go(isArabic ? 1 : -1);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  });

  const onTouchStart = e => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 50) return;
    // swipe left = next (LTR), swipe right = next (RTL)
    go((dx < 0) !== isArabic ? 1 : -1);
  };

  if (!photo) return null;

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={t('عرض صورة التقدّم', 'Progress photo')}>
      <div className="lb__scrim" onClick={onClose} />

      <div className="lb__top">
        <span className="lb__counter pf-num">{index + 1} / {count}</span>
        <div className="lb__top-actions">
          {!broken && (
            <a className="lb__icon" href={photo.photo_url} target="_blank" rel="noopener noreferrer" download aria-label={t('تحميل', 'Download')}>
              <Download />
            </a>
          )}
          <button ref={closeRef} type="button" className="lb__icon" onClick={onClose} aria-label={t('إغلاق', 'Close')}><X /></button>
        </div>
      </div>

      <figure className="lb__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {broken ? (
          <div className="lb__missing"><ImageOff /><span>{t('الصورة غير متوفرة', 'Image not available')}</span></div>
        ) : (
          <img key={photo.photo_url} src={photo.photo_url} alt={captionOf(index)} onError={() => setBroken(true)} />
        )}
        <figcaption>{captionOf(index)}</figcaption>
      </figure>

      {count > 1 && (
        <>
          <button type="button" className="lb__nav lb__nav--prev" onClick={() => go(-1)} aria-label={t('الصورة السابقة', 'Previous photo')}>
            {isArabic ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <button type="button" className="lb__nav lb__nav--next" onClick={() => go(1)} aria-label={t('الصورة التالية', 'Next photo')}>
            {isArabic ? <ChevronLeft /> : <ChevronRight />}
          </button>

          <div className="lb__thumbs">
            {photos.map((p, i) => (
              <button
                key={p.id || i}
                type="button"
                className={`lb__thumb ${i === index ? 'is-active' : ''}`}
                onClick={() => { setBroken(false); onIndexChange(i); }}
                aria-label={captionOf(i)}
                aria-current={i === index}
              >
                <img src={p.photo_url} alt="" loading="lazy" onError={e => { e.currentTarget.style.visibility = 'hidden'; }} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoLightbox;
