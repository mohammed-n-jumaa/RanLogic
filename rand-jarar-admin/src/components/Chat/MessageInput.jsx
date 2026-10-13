// src/components/Chat/MessageInput.jsx
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile, Image as ImageIcon, X } from 'lucide-react';
import './MessageInput.scss';
import { t } from '../../i18n';

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleKeyPress,
  handleFileUpload
}) => {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="message-input">
      <div className="message-input__actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <motion.button
          className="message-input__action-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFileClick}
          aria-label={t('إرفاق ملف')}
        >
          <Paperclip size={20} />
        </motion.button>

       
      </div>

      <div className="message-input__field">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('اكتب رسالتك هنا...')}
          rows="1"
        />
      </div>

      <div className="message-input__send">
        <motion.button
          className="message-input__send-btn"
          onClick={handleSendMessage}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={!newMessage.trim()}
          aria-label={t('إرسال الرسالة')}
        >
          <Send size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default MessageInput;