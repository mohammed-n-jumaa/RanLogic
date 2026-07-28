import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, Copy, CheckCircle, Calendar, Dumbbell, User, Youtube } from 'lucide-react';
import './ExerciseDetailModal.scss';

const TABLET = 768;

const ExerciseDetailModal = ({ exercise, isOpen, onClose, onEdit, onDelete, apiStorage }) => {
  const [copied, setCopied] = useState(false);
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= TABLET;

  const handleCopy = async () => {
    if (!exercise?.youtube_url) return;
    await navigator.clipboard.writeText(exercise.youtube_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;
  };

  const formatDate = (d) => (d ? String(d).split('T')[0] : '');
  const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const getDayName = (d) => {
    const clean = formatDate(d);
    if (!clean) return '';
    return DAY_NAMES[new Date(clean + 'T12:00:00').getDay()];
  };

  if (!exercise) return null;

  const embedUrl = getYoutubeEmbed(exercise.youtube_url);
  const videoSrc = exercise.video_file ? `${apiStorage}/storage/${exercise.video_file}` : null;

  // Mobile: slide up. Desktop: fade+scale (no y transform to avoid conflict)
  const mobileAnim = {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit:    { y: '100%', opacity: 0 },
  };
  const desktopAnim = {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 0.94 },
  };

  const modalContent = (
    <motion.div
      className="detail-modal"
      {...(isDesktop ? desktopAnim : mobileAnim)}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      dir="rtl"
    >
      <div className="detail-modal__handle" />

      {/* Header */}
      <div className="detail-modal__header">
        <h2 className="detail-modal__title">{exercise.name}</h2>
        <button className="detail-modal__close" onClick={onClose}><X size={17} /></button>
      </div>

      {/* Body */}
      <div className="detail-modal__body">
        {(embedUrl || videoSrc) && (
          <div className="detail-modal__video-wrap">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={exercise.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="detail-modal__iframe"
              />
            ) : (
              <video src={videoSrc} controls className="detail-modal__video" />
            )}
          </div>
        )}

        <div className="detail-modal__info-grid">
          <div className="detail-modal__info-item">
            <Calendar size={15} />
            <div>
              <span className="detail-modal__info-label">التاريخ</span>
              <span className="detail-modal__info-value">
                {getDayName(exercise.exercise_date)} {formatDate(exercise.exercise_date)}
              </span>
            </div>
          </div>
          <div className="detail-modal__info-item">
            <Dumbbell size={15} />
            <div>
              <span className="detail-modal__info-label">المجموعات والتكرارات</span>
              <span className="detail-modal__info-value detail-modal__info-value--highlight">
                {exercise.sets} مجموعات × {exercise.reps} تكرار
              </span>
            </div>
          </div>
          {exercise.workout_plan?.user && (
            <div className="detail-modal__info-item">
              <User size={15} />
              <div>
                <span className="detail-modal__info-label">المتدربة</span>
                <span className="detail-modal__info-value">{exercise.workout_plan.user.name}</span>
              </div>
            </div>
          )}
        </div>

        {exercise.notes && (
          <div className="detail-modal__notes">
            <p className="detail-modal__notes-label">📝 ملاحظات</p>
            <p className="detail-modal__notes-text">{exercise.notes}</p>
          </div>
        )}

        {exercise.youtube_url && (
          <div className="detail-modal__url-row">
            <Youtube size={15} className="detail-modal__url-icon" />
            <span className="detail-modal__url-text">{exercise.youtube_url}</span>
            <button className={`detail-modal__copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="detail-modal__footer">
        <button className="detail-modal__action-btn detail-modal__action-btn--delete" onClick={() => onDelete(exercise)}>
          <Trash2 size={15} /> حذف
        </button>
        <button className="detail-modal__action-btn detail-modal__action-btn--edit" onClick={() => onEdit(exercise)}>
          <Edit2 size={15} /> تعديل
        </button>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — always fixed fullscreen */}
          <motion.div
            className="detail-modal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Desktop: render inside a flex centering wrapper */}
          {isDesktop ? (
            <div className="detail-modal-wrapper">
              {modalContent}
            </div>
          ) : (
            modalContent
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default ExerciseDetailModal;