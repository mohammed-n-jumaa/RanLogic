import React, { useState } from 'react';
import { X, Pencil, Trash2, Copy, Check, CalendarDays, Youtube, Dumbbell } from 'lucide-react';
import ExSheet from './ExSheet';
import { youtubeEmbed, formatDate, dayName, initials, artFor } from './exerciseUtils';
import { t } from '../../../i18n';

const ExerciseDetailModal = ({ exercise, isOpen, onClose, onEdit, onDelete, apiStorage }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!exercise?.youtube_url) return;
    try {
      await navigator.clipboard.writeText(exercise.youtube_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: ignore */ }
  };

  const embedUrl = exercise ? youtubeEmbed(exercise.youtube_url) : null;
  const videoSrc = exercise?.video_file ? `${apiStorage}/storage/${exercise.video_file}` : null;
  const trainee = exercise?.workout_plan?.user?.name;

  return (
    <ExSheet isOpen={isOpen && !!exercise} onClose={onClose} size="lg" className="exs--detail" labelledBy="exd-title">
      {exercise && (
        <div className="exd">
          <div className="exd__media">
            <button type="button" className="exd__close" onClick={onClose} aria-label={t('إغلاق')}><X size={18} /></button>
            <div className="exd__video">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={exercise.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : videoSrc ? (
                <video src={videoSrc} controls preload="metadata" />
              ) : (
                <div className="exd__art" style={{ background: artFor(exercise.id) }}>
                  <Dumbbell size={64} />
                  <span>{t('ما في فيديو لهالتمرين — بتقدري تضيفي واحد من التعديل')}</span>
                </div>
              )}
            </div>
            {exercise.youtube_url && (
              <div className="exd__link" dir="ltr">
                <Youtube size={16} />
                <span>{exercise.youtube_url}</span>
                <button type="button" className={copied ? 'is-copied' : ''} onClick={handleCopy}>
                  {copied ? <><Check size={13} /> {t('تم')}</> : <><Copy size={13} /> {t('نسخ')}</>}
                </button>
              </div>
            )}
          </div>

          <div className="exd__info">
            <div className="exd__title">
              <h2 id="exd-title">{exercise.name}</h2>
              {exercise.exercise_date && (
                <p><CalendarDays size={13} /> {dayName(exercise.exercise_date)} {formatDate(exercise.exercise_date)}</p>
              )}
            </div>

            <div className="exd__nums">
              <div><b>{exercise.sets}</b><small>{t('مجموعات')}</small></div>
              <div><b>{exercise.reps}</b><small>{t('تكرار')}</small></div>
            </div>

            <div className="exd__row">
              {trainee && <span className="exd__ava">{initials(trainee)}</span>}
              <div>
                <small>{t('المتدرب')}</small>
                <b>{trainee || t('غير مرتبط بمتدرب')}</b>
              </div>
            </div>

            {exercise.notes && (
              <div className="exd__notes">
                <small>{t('ملاحظات')}</small>
                {exercise.notes}
              </div>
            )}

            <div className="exd__actions">
              <button type="button" className="exs-btn exs-btn--brand exs-btn--grow" onClick={() => onEdit(exercise)}>
                <Pencil size={16} /> {t('تعديل التمرين')}
              </button>
              <button type="button" className="exs-btn exs-btn--danger" onClick={() => onDelete(exercise)} aria-label={t('حذف')}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </ExSheet>
  );
};

export default ExerciseDetailModal;
