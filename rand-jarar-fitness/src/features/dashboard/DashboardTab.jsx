import { useState, useEffect } from 'react';
import { Share2, Loader2, RefreshCw } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import dashboardApi from '../../api/dashboardApi';
import QuickStats from './QuickStats';
import WeightChart from './WeightChart';
import WaterTracker from './WaterTracker';
import StreakCard from './StreakCard';
import HeatmapCard from './HeatmapCard';
import ChallengesCard from './ChallengesCard';
import BadgesCard from './BadgesCard';
import BodyMeasurements from './BodyMeasurements';
import ProgressPhotos from './ProgressPhotos';
import WorkoutCalendar from './WorkoutCalendar';
import WeeklyReport from './WeeklyReport';
import ShareCard from './ShareCard';
import './Dashboard.scss';

const DashboardTab = () => {
  const { t } = useProfileLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getDashboard();
      if (response.success) setData(response.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="pf-card pf-state">
        <span className="pf-state__icon"><Loader2 className="pf-spin" /></span>
        <p className="pf-card__sub">{t('جاري تحميل لوحة التحكم...', 'Loading dashboard...')}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pf-card pf-state">
        <h3>{t('فشل تحميل البيانات', 'Failed to load data')}</h3>
        <button type="button" className="pf-btn pf-btn--ghost" onClick={fetchDashboard}><RefreshCw /> {t('إعادة المحاولة', 'Retry')}</button>
      </div>
    );
  }

  return (
    <div className="pf-grid">
      <div className="pf-toolbar" style={{ margin: 0 }}>
        <p className="pf-card__sub">{t('تقدّمك كله بمكان واحد', 'All your progress in one place')}</p>
        <button type="button" className="pf-btn pf-btn--primary" onClick={() => setShowShare(true)}>
          <Share2 /> {t('شارك تقدمك', 'Share progress')}
        </button>
      </div>

      {showShare && <ShareCard data={data} onClose={() => setShowShare(false)} />}

      <QuickStats data={data} />

      <div className="pf-grid pf-grid--3">
        <div className="pf-span-2"><WeightChart data={data.weight_chart} /></div>
        <WaterTracker water={data.water} />
      </div>

      <div className="pf-grid pf-grid--3">
        <StreakCard streak={data.streak} />
        <div className="pf-span-2"><HeatmapCard heatmap={data.heatmap} /></div>
      </div>

      <div className="pf-grid pf-grid--3">
        <ChallengesCard challenges={data.challenges} />
        <BadgesCard badges={data.badges} />
        <BodyMeasurements measurements={data.measurements} />
      </div>

      <div className="pf-grid pf-grid--3">
        <div className="pf-span-2">
          <ProgressPhotos
            photos={data.progress_photos}
            onRefresh={fetchDashboard}
            hasConsent={data.measurements?.marketing_consent === true}
          />
        </div>
        <WorkoutCalendar calendar={data.workout_calendar} />
      </div>

      <WeeklyReport report={data.weekly_report} />
    </div>
  );
};

export default DashboardTab;
