import { motion } from 'framer-motion';
import { FaImage } from 'react-icons/fa';

const Message = ({ message, index }) => {
  const isImage = message.type === 'image';
  const imageUrl = message.file_url;

  return (
    <motion.div
      className={`message ${message.sender}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="message-content">
        {isImage && imageUrl && (
          <div className="message-image-container">
            <img src={imageUrl} alt="Message" className="message-image" />
          </div>
        )}
        
        {message.content && (
          <p className="message-text">{message.content}</p>
        )}
        
        <span className="message-time">{message.timestamp}</span>
        
        {message.status && (
          <span className={`message-status ${message.status}`}>
            {message.status === 'read' ? '✓✓' : '✓'}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default Message;