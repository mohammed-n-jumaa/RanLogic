import { motion } from 'framer-motion';
import { FaCheckCircle, FaPlayCircle, FaYoutube, FaDumbbell } from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const ExerciseItem = ({ exercise, dayIndex, exerciseIndex, onToggleExercise }) => {
  const { t } = useProfileLanguage();

  const handleCheckToggle = () => {
    onToggleExercise(exercise.id);
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    if (exercise.videoUrl) {
      window.open(exercise.videoUrl, '_blank');
    }
  };

  const handleYoutubeClick = (e) => {
    e.stopPropagation();
    if (exercise.youtubeUrl) {
      window.open(exercise.youtubeUrl, '_blank');
    }
  };

  return (
    <motion.div
      className={`exercise-item ${exercise.checked ? 'checked' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: exerciseIndex * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      {/* Check Button */}
      <motion.button
        className={`check-btn ${exercise.checked ? 'checked' : ''}`}
        onClick={handleCheckToggle}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {exercise.checked && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
          >
            <FaCheckCircle />
          </motion.div>
        )}
      </motion.button>

      {/* Exercise Info */}
      <div className="exercise-info">
        <h5>
          <FaDumbbell 
            style={{ 
              marginRight: '0.5rem',
              color: 'var(--primary-color)',
              fontSize: '1rem'
            }} 
          />
          {exercise.name}
        </h5>
        
        <div className="exercise-details">
          <span>{exercise.sets} {t('مجموعات', 'sets')}</span>
          <span>×</span>
          <span>{exercise.reps} {t('تكرارات', 'reps')}</span>
        </div>

        {exercise.notes && (
          <motion.div
            className="exercise-notes"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2 }}
          >
            {exercise.notes}
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="exercise-actions">
        {exercise.videoUrl && (
          <motion.button
            className="video-btn"
            onClick={handleVideoClick}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            title={t('مشاهدة الفيديو', 'Watch Video')}
          >
            <FaPlayCircle />
          </motion.button>
        )}

        {exercise.youtubeUrl && (
          <motion.button
            className="youtube-btn"
            onClick={handleYoutubeClick}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            title={t('مشاهدة على يوتيوب', 'Watch on YouTube')}
          >
            <FaYoutube />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ExerciseItem;