import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaCheckDouble,
  FaCheck,
  FaUser,
  FaDumbbell,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaDownload,
  FaPlayCircle,
} from 'react-icons/fa';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const MessagesList = ({ messages }) => {
  const { t, isRTL } = useProfileLanguage();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getFileLabel = (message) => {
    switch (message.type) {
      case 'pdf':
        return t('ملف PDF', 'PDF File');
      case 'doc':
        return t('مستند', 'Document');
      case 'video':
        return t('فيديو', 'Video');
      case 'file':
      default:
        return t('ملف', 'File');
    }
  };

  const renderFileIcon = (message) => {
    switch (message.type) {
      case 'pdf':
        return <FaFilePdf className="message-file-icon pdf" />;
      case 'doc':
        return <FaFileWord className="message-file-icon doc" />;
      case 'video':
        return <FaPlayCircle className="message-file-icon video" />;
      case 'file':
      default:
        return <FaFileAlt className="message-file-icon file" />;
    }
  };

  const renderMessageBody = (message) => {
    const hasImage = message.type === 'image' && message.file_url;
    const hasVideo = message.type === 'video' && message.file_url;
    const hasFile = ['pdf', 'doc', 'file'].includes(message.type) && message.file_url;

    if (hasImage) {
      return (
        <>
          <motion.div className="message-image-wrapper" whileHover={{ scale: 1.02 }}>
            <img
              src={message.file_url}
              alt={message.file_name || 'Message attachment'}
              className="message-image"
              loading="lazy"
            />
          </motion.div>

          {message.content && <div className="message-text">{message.content}</div>}
        </>
      );
    }

    if (hasVideo) {
      return (
        <>
          <div className="message-file-card">
            <div className="message-file-main">
              {renderFileIcon(message)}
              <div className="message-file-info">
                <div className="message-file-name">
                  {message.file_name || getFileLabel(message)}
                </div>
                <div className="message-file-meta">
                  {message.file_size || getFileLabel(message)}
                </div>
              </div>
            </div>

            <a
              href={message.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="message-file-download"
            >
              <FaDownload />
            </a>
          </div>

          {message.content && <div className="message-text">{message.content}</div>}
        </>
      );
    }

    if (hasFile) {
      return (
        <>
          <div className="message-file-card">
            <div className="message-file-main">
              {renderFileIcon(message)}
              <div className="message-file-info">
                <div className="message-file-name">
                  {message.file_name || getFileLabel(message)}
                </div>
                <div className="message-file-meta">
                  {message.file_size || getFileLabel(message)}
                </div>
              </div>
            </div>

            <a
              href={message.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="message-file-download"
            >
              <FaDownload />
            </a>
          </div>

          {message.content && <div className="message-text">{message.content}</div>}
        </>
      );
    }

    if (message.content) {
      return <div className="message-text">{message.content}</div>;
    }

    return <div className="message-text">{getFileLabel(message)}</div>;
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="messages-list">
        <div className="no-messages">
          <FaDumbbell />
          <h4>{t('لا توجد رسائل بعد', 'No messages yet')}</h4>
          <p>{t('ابدأ المحادثة مع مدربك', 'Start chatting with your trainer')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-list" dir={isRTL ? 'rtl' : 'ltr'}>
      {messages.map((message, index) => {
        const isTrainer = message.sender === 'trainer';
        const isUser = message.sender === 'user';

        return (
          <motion.div
            key={message.id || index}
            className={`message-wrapper ${isTrainer ? 'trainer-message' : 'user-message'}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.25, ease: 'easeOut' }}
          >
            {isTrainer && (
              <motion.div className="message-avatar trainer-avatar" whileHover={{ scale: 1.1 }}>
                <FaDumbbell />
              </motion.div>
            )}

            <div className={`message-bubble ${isTrainer ? 'trainer-bubble' : 'user-bubble'}`}>
              {isTrainer && (
                <div className="sender-name">
                  <FaDumbbell className="sender-icon" />
                  <span>{t('المدربة', 'Rand')}</span>
                </div>
              )}

              <div className="message-content-wrapper">
                {renderMessageBody(message)}
              </div>

              <div className="message-footer">
                <span className="message-time">
                  {message.timestamp ||
                    new Date().toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                </span>

                {isUser && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginInlineStart: '6px'
                  }}>
                    {message.status === 'read' ? (
                      <>
                        <FaCheckDouble
                          title={t('تمت القراءة', 'Read')}
                          style={{
                            color: '#2d9cff',
                            fontSize: '14px'
                          }}
                        />
                        <span style={{
                          fontSize: '11px',
                          color: '#2d9cff',
                          fontWeight: '600'
                        }}>
                          {t('تمت القراءة', 'Seen')}
                        </span>
                      </>
                    ) : (
                      <FaCheck
                        title={t('تم الإرسال', 'Sent')}
                        style={{
                          color: '#b8b8b8',
                          fontSize: '14px'
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {isUser && (
              <motion.div className="message-avatar user-avatar" whileHover={{ scale: 1.1 }}>
                <FaUser />
              </motion.div>
            )}
          </motion.div>
        );
      })}

      <div ref={endRef} />
    </div>
  );
};

export default MessagesList;