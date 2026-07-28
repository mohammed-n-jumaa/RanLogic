import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';

const UploadReceiptCard = ({ delay }) => {
  return (
    <motion.div
      className="upload-receipt-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="card-header">
        <h3>Upload Receipt</h3>
        <FaUpload className="header-icon" />
      </div>

      <div className="upload-area">
        <FaUpload className="upload-icon" />
        <p>Drag receipt here or click to upload</p>
        <input type="file" accept="image/*,.pdf" />
        <button className="upload-btn">
          Choose File
        </button>
      </div>
    </motion.div>
  );
};

export default UploadReceiptCard;