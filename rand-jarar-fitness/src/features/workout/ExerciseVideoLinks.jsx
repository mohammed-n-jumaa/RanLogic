import { PlayCircle } from 'lucide-react';
import { FaYoutube } from '@/components/common/SocialIcons';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { STORAGE_URL } from '../profile/shell/profileShared';

/** "Watch on YouTube" / "Watch video" buttons for an exercise (renders nothing if it has neither) */
const ExerciseVideoLinks = ({ exercise }) => {
  const { t } = useProfileLanguage();
  const videoUrl = exercise.video_file ? `${STORAGE_URL}/${exercise.video_file}` : null;
  const youtubeUrl = exercise.youtube_url || null;
  if (!videoUrl && !youtubeUrl) return null;

  return (
    <div className="ex-links">
      {youtubeUrl && (
        <a className="ex-link ex-link--youtube" href={youtubeUrl} target="_blank" rel="noopener noreferrer"
          aria-label={t(`شاهد ${exercise.name} على يوتيوب`, `Watch ${exercise.name} on YouTube`)}>
          <FaYoutube />
          <span>{t('انقر لمشاهدة التمرين على اليوتيوب', 'Click to watch the exercise on YouTube')}</span>
        </a>
      )}
      {videoUrl && (
        <a className="ex-link ex-link--video" href={videoUrl} target="_blank" rel="noopener noreferrer"
          aria-label={t(`شاهد فيديو ${exercise.name}`, `Watch the ${exercise.name} video`)}>
          <PlayCircle />
          <span>{t('شاهد فيديو التمرين', 'Watch the exercise video')}</span>
        </a>
      )}
    </div>
  );
};

export default ExerciseVideoLinks;
