import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaImage, FaTimes } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const ChatInput = ({ value, onChange, onSend, sending }) => {
  const { t } = useProfileLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert(t('يرجى اختيار صورة فقط', 'Please select an image only'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(t('حجم الصورة يجب أن يكون أقل من 5 ميجابايت', 'Image size must be less than 5MB'));
        return;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if (selectedImage) {
      onSend(value, selectedImage);
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (value.trim()) {
      onSend(value, null);
    }
  };

  return (
    <div className="chat-input-wrapper">
      {imagePreview && (
        <div className="image-preview-container">
          <img src={imagePreview} alt="Preview" className="image-preview" />
          <button className="remove-image-btn" onClick={handleRemoveImage}>
            <FaTimes />
          </button>
        </div>
      )}
      
      <div className="chat-input">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
        
        <motion.button
          className="image-btn"
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          disabled={sending}
        >
          <FaImage />
        </motion.button>

        <input
          type="text"
          placeholder={t('اكتب رسالتك...', 'Type your message...')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={sending}
        />
        
        <motion.button
          className="send-btn"
          onClick={handleSend}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          disabled={sending || (!value.trim() && !selectedImage)}
        >
          <FaPaperPlane />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatInput;