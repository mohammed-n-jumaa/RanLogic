// src/components/Chat/ChatWindow.jsx
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, Image as ImageIcon, FileText, PlayCircle } from 'lucide-react';
import './ChatWindow.scss';

const ChatWindow = ({ messages = [], client = {} }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (time) => time;

  // ✅ نفس منطق الهيدر: ديفولت حسب الجنس (هنا نستنتج من default-avatar-*.png)
  const getDefaultAvatar = (clientObj) => {
    const fallback = 'https://i.postimg.cc/WpqHf2CH/download.png';
    if (!clientObj) return fallback;

    // عندك هنا الحقل اسمه client.image في الكود الحالي
    const avatarUrl = clientObj.image || clientObj.avatar_url || clientObj.avatar || '';

    // لو أفاتار مرفوع فعليًا (مو default-avatar)
    const isServerDefault = !avatarUrl || String(avatarUrl).includes('default-avatar');
    const hasCustomAvatar = avatarUrl && !isServerDefault;

    if (hasCustomAvatar) return avatarUrl;

    // ✅ استنتاج الجنس من رابط الديفولت القادم من السيرفر
    if (avatarUrl && String(avatarUrl).includes('default-avatar-male')) {
      return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
    }

    if (avatarUrl && String(avatarUrl).includes('default-avatar-female')) {
      return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
    }

    return fallback;
  };

  const getMessageDateLabel = (message) => {
    // API عندك يرجع date: "Y-m-d" ممتاز
    if (message.date) {
      const d = new Date(message.date);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('ar-SA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      return message.date;
    }

    // fallback: إذا ما في date حاول من created_at لو موجود
    if (message.created_at) {
      const d = new Date(message.created_at);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('ar-SA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
    }

    return null;
  };

  const renderAttachment = (message) => {
    const type = message.type;
    const url = message.file_url;

    if (!type || !url) return null;

    // Image
    if (type === 'image') {
      return (
        <div className="message__attachment message__attachment--image">
          <img src={url} alt={message.file_name || 'image'} loading="lazy" />
        </div>
      );
    }

    // Video
    if (type === 'video') {
      return (
        <div className="message__attachment message__attachment--video">
          <video controls preload="metadata">
            <source src={url} />
            المتصفح لا يدعم تشغيل الفيديو
          </video>
        </div>
      );
    }

    // PDF / DOC / FILE => link
    const isDoc = type === 'pdf' || type === 'doc' || type === 'file';
    if (isDoc) {
      return (
        <a
          className="message__attachment message__attachment--file"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          <FileText size={18} />
          <div className="message__file-info">
            <div className="message__file-name">{message.file_name || 'ملف'}</div>
            {message.file_size && <div className="message__file-size">{message.file_size}</div>}
          </div>
        </a>
      );
    }

    return null;
  };

  return (
    <div className="chat-window">
      {/* Welcome Message */}
      <div className="chat-window__welcome">
        <motion.div
          className="welcome-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="welcome-message__avatar">
            {/* ✅ هنا التعديل: نفس منطق الهيدر */}
            <img
              src={getDefaultAvatar(client)}
              alt={client.name || 'Client'}
              onError={(e) => {
                e.target.src = 'https://i.postimg.cc/WpqHf2CH/download.png';
              }}
            />
          </div>
          <h3 className="welcome-message__title">أنت تتحدث مع {client.name || 'المتدرب'}</h3>
          <p className="welcome-message__subtitle">
            {client.isOnline ? 'متصل الآن' : `آخر ظهور ${client.lastSeen || ''}`}
          </p>
        </motion.div>
      </div>

      {/* Messages Container */}
      <div className="chat-window__messages">
        <div className="messages-container">
          {messages.map((message, index) => {
            const isTrainer = message.sender === 'trainer';

            const currentDateLabel = getMessageDateLabel(message);
            const prevDateLabel = index > 0 ? getMessageDateLabel(messages[index - 1]) : null;
            const showDate = index === 0 || (currentDateLabel && currentDateLabel !== prevDateLabel);

            const isRead = message.is_read ?? message.isRead ?? false;

            return (
              <React.Fragment key={message.id || index}>
                {showDate && currentDateLabel && (
                  <div className="message-date">{currentDateLabel}</div>
                )}

                <motion.div
                  className={`message ${isTrainer ? 'message--trainer' : 'message--client'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="message__content">
                    {/* Attachment (image/video/file) */}
                    {renderAttachment(message)}

                    {/* Text (caption or normal text) */}
                    {message.content && (
                      <div className="message__text">{message.content}</div>
                    )}

                    <div className="message__meta">
                      <span className="message__time">{formatTime(message.timestamp)}</span>

                      {/* Status only for trainer messages */}
                      {isTrainer && (
                        <span className="message__status">
                          {isRead ? <CheckCheck size={12} /> : <Check size={12} />}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
