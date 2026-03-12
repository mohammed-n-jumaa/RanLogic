import { motion } from 'framer-motion';
import { FaCheckDouble, FaCheck, FaUser, FaDumbbell } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const MessagesList = ({ messages }) => {
  const { t, isRTL } = useProfileLanguage();

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
        const hasImage = message.type === 'image' && message.file_url;

        return (
          <motion.div
            key={message.id || index}
            className={`message-wrapper ${isTrainer ? 'trainer-message' : 'user-message'}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.05,
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            {/* Avatar للمدرب فقط */}
            {isTrainer && (
              <motion.div 
                className="message-avatar trainer-avatar"
                whileHover={{ scale: 1.1 }}
              >
                <FaDumbbell />
              </motion.div>
            )}

            <div className={`message-bubble ${isTrainer ? 'trainer-bubble' : 'user-bubble'}`}>
              {/* اسم المرسل */}
              {isTrainer && (
                <div className="sender-name">
                  <FaDumbbell className="sender-icon" />
                  <span>{t('المدرب', 'Rand')}</span>
                </div>
              )}

              {/* محتوى الرسالة */}
              <div className="message-content-wrapper">
                {/* الصورة إذا كانت موجودة */}
                {hasImage && (
                  <motion.div 
                    className="message-image-wrapper"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img 
                      src={message.file_url} 
                      alt="Message attachment" 
                      className="message-image"
                      loading="lazy"
                    />
                  </motion.div>
                )}

                {/* النص إذا كان موجوداً */}
                {message.content && (
                  <div className="message-text">
                    {message.content}
                  </div>
                )}
              </div>

              {/* وقت الرسالة وحالة القراءة */}
              <div className="message-footer">
                <span className="message-time">
                  {message.timestamp || new Date().toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                
                {/* حالة القراءة للمتدرب فقط */}
                {isUser && (
                  <span className="message-status">
                    {message.status === 'read' ? (
                      <FaCheckDouble className="read-status" />
                    ) : (
                      <FaCheck className="sent-status" />
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Avatar للمتدرب فقط */}
            {isUser && (
              <motion.div 
                className="message-avatar user-avatar"
                whileHover={{ scale: 1.1 }}
              >
                <FaUser />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default MessagesList;