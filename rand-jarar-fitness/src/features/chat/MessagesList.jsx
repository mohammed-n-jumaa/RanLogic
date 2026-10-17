import { useEffect, useRef } from 'react';
import { Check, CheckCheck, Download, FileDown, FileText, PlayCircle, MessageSquare } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const FILE_ICONS = { pdf: FileDown, doc: FileText, video: PlayCircle, file: FileText };

const MessagesList = ({ messages, trainerTyping }) => {
  const { t, currentLang } = useProfileLanguage();
  const bodyRef = useRef(null);
  const locale = currentLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

  // Keep the newest message in view (scroll the list, not the whole page)
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, trainerTyping]);

  const fileLabel = type => ({
    pdf: t('ملف PDF', 'PDF file'),
    doc: t('مستند', 'Document'),
    video: t('فيديو', 'Video'),
  }[type] || t('ملف', 'File'));

  const dayLabel = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return t('اليوم', 'Today');
    if (d.toDateString() === yesterday.toDateString()) return t('أمس', 'Yesterday');
    return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const renderBody = (m) => {
    if (m.type === 'image' && m.file_url) {
      return (
        <>
          <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="ch-msg__image">
            <img src={m.file_url} alt={m.file_name || ''} loading="lazy" />
          </a>
          {m.content && <p>{m.content}</p>}
        </>
      );
    }
    if (['pdf', 'doc', 'file', 'video'].includes(m.type) && m.file_url) {
      const Icon = FILE_ICONS[m.type] || FileText;
      return (
        <>
          <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="ch-msg__file">
            <Icon />
            <span>
              <strong>{m.file_name || fileLabel(m.type)}</strong>
              <small>{m.file_size || fileLabel(m.type)}</small>
            </span>
            <Download />
          </a>
          {m.content && <p>{m.content}</p>}
        </>
      );
    }
    return <p>{m.content || fileLabel(m.type)}</p>;
  };

  if (!messages?.length) {
    return (
      <div className="ch__body" ref={bodyRef}>
        <div className="pf-state">
          <span className="pf-state__icon"><MessageSquare /></span>
          <h3>{t('لا توجد رسائل بعد', 'No messages yet')}</h3>
          <p className="pf-card__sub">{t('ابدأ المحادثة مع مدربك', 'Start chatting with your coach')}</p>
        </div>
      </div>
    );
  }

  // Show a date separator whenever the day changes from the previous message
  const days = messages.map(m => dayLabel(m.created_at));

  return (
    <div className="ch__body" ref={bodyRef}>
      {messages.map((m, i) => {
        const day = days[i];
        const showDay = day && day !== days[i - 1];
        const mine = m.sender === 'user';
        return (
          <div key={m.id || i} className="ch__row">
            {showDay && <span className="ch__day">{day}</span>}
            <div className={`ch-msg ${mine ? 'ch-msg--me' : 'ch-msg--coach'}`}>
              {renderBody(m)}
              <small className="ch-msg__meta">
                <span className="pf-num">{m.timestamp}</span>
                {mine && (m.status === 'read'
                  ? <CheckCheck className="is-read" aria-label={t('تمت القراءة', 'Seen')} />
                  : <Check aria-label={t('تم الإرسال', 'Sent')} />)}
              </small>
            </div>
          </div>
        );
      })}
      {trainerTyping && (
        <div className="ch-msg ch-msg--coach ch-typing" aria-label={t('يكتب الآن', 'Typing')}>
          <i /><i /><i />
        </div>
      )}
    </div>
  );
};

export default MessagesList;
