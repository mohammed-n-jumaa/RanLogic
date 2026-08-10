import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import dashboardApi from '../../api/dashboardApi';
import WeightChart from './WeightChart';
import ProgressPhotos from './ProgressPhotos';
import StreakCard from './StreakCard';
import WaterTracker from './WaterTracker';
import BodyMeasurements from './BodyMeasurements';
import ChallengesCard from './ChallengesCard';
import HeatmapCard from './HeatmapCard';
import WorkoutCalendar from './WorkoutCalendar';
import BadgesCard from './BadgesCard';
import WeeklyReport from './WeeklyReport';
import ShareCard from './ShareCard';
import QuickStats from './QuickStats';
import "./Dashboard.scss";
import { User, RulerDimensionLine, Scale, HeartPulse, Users, Target, Home, Cake, Calendar, CheckCircle, XCircle, Share2 } from 'lucide-react';

const goalLabels = {
  'weight-loss': { ar: 'إنقاص الوزن', en: 'Weight Loss' },
  'muscle-gain': { ar: 'بناء العضلات', en: 'Muscle Gain' },
  'toning':      { ar: 'شد الجسم', en: 'Toning' },
  'fitness':     { ar: 'لياقة عامة', en: 'General Fitness' },
};

const placeLabels = {
  'home': { ar: 'المنزل', en: 'Home' },
  'gym':  { ar: 'الصالة الرياضية', en: 'Gym' },
};

const genderLabels = {
  'male':   { ar: 'ذكر', en: 'Male' },
  'female': { ar: 'أنثى', en: 'Female' },
};

const DashboardTab = () => {
  const { t, currentLang } = useProfileLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>{t('جاري تحميل لوحة التحكم...', 'Loading dashboard...')}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-error">
        <p>{t('فشل تحميل البيانات', 'Failed to load data')}</p>
        <button onClick={fetchDashboard}>{t('إعادة المحاولة', 'Retry')}</button>
      </div>
    );
  }

  const user = data.user_info;
  const sub = data.subscription;

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const anim = (delay) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay },
  });

  return (
    <div className="dashboard-tab">
      <div className="dash-header-row">
        <h2 className="dash-page-title">{t('لوحة التحكم', 'Dashboard')}</h2>
        <button className="dash-share-btn" onClick={() => setShowShare(true)}>
          <Share2 /> {t('شارك تقدمك', 'Share progress')}
        </button>
      </div>

      {showShare && <ShareCard data={data} onClose={() => setShowShare(false)} />}

      <div className="dashboard-grid">

        {/* Profile Summary Strip */}
        <motion.div className="grid-full" {...anim(0.05)}>
          <div className="dash-card profile-strip">
            <div className="strip-top">
              <div className="strip-user">
                <div className="strip-avatar">{user.name?.charAt(0) || '?'}</div>
                <div>
                  <div className="strip-name">{user.name}</div>
                  <div className="strip-program">
                    {user.goal ? (goalLabels[user.goal]?.[currentLang] || user.goal) : ''}
                    {user.workout_place ? ` · ${placeLabels[user.workout_place]?.[currentLang] || user.workout_place}` : ''}
                  </div>
                </div>
              </div>
              <div className="strip-pills">
                <span className={`strip-pill ${sub.active ? 'active' : 'inactive'}`}>
                  {sub.active
                    ? <><CheckCircle /> {t('نشط', 'Active')}</>
                    : <><XCircle /> {t('منتهي', 'Expired')}</>
                  }
                </span>
              </div>
            </div>

            <div className="strip-dates">
              <div className="strip-date-item">
                <Calendar />
                <span className="strip-date-label">{t('البدء', 'Start')}</span>
                <span className="strip-date-value">{formatDate(sub.start_date)}</span>
              </div>
              <div className="strip-date-divider" />
              <div className="strip-date-item">
                <Calendar />
                <span className="strip-date-label">{t('الانتهاء', 'End')}</span>
                <span className="strip-date-value">{formatDate(sub.end_date)}</span>
              </div>
            </div>

            <div className="strip-stats">
              {[
                { icon: <RulerDimensionLine />, label: t('الطول', 'Height'), value: user.height ? `${user.height}` : '--', color: '#534AB7' },
                { icon: <Scale />, label: t('الوزن', 'Weight'), value: user.weight ? `${user.weight}` : '--', color: '#993556' },
                { icon: <User />, label: t('الخصر', 'Waist'), value: user.waist ? `${user.waist}` : '--', color: '#0F6E56' },
                ...(user.gender === 'female' && user.hips
                  ? [{ icon: <User />, label: t('الأرداف', 'Hips'), value: `${user.hips}`, color: '#8b5cf6' }]
                  : []),
                { icon: <Users />, value: user.gender ? (genderLabels[user.gender]?.[currentLang] || user.gender) : '--', color: '#185FA5' },
                { icon: <Cake fill="currentColor" />, value: user.age ? `${user.age} ${t('سنة', 'y')}` : '--', color: '#993C1D' },
                ...(user.health_notes
                  ? [{ icon: <HeartPulse />, value: user.health_notes, color: '#A32D2D' }]
                  : []),
              ].map((s, i) => (
                <div key={i} className="strip-stat" style={{ color: s.color }}>
                  {s.icon}
                  {s.label && <span className="strip-stat-label">{s.label}</span>}
                  <span className="strip-stat-value">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div className="grid-full" {...anim(0.1)}>
          <QuickStats data={data} />
        </motion.div>

        {/* Weight Chart */}
        <motion.div className="grid-full" {...anim(0.15)}>
          <WeightChart data={data.weight_chart} />
        </motion.div>

        {/* Progress Photos */}
        <motion.div className="grid-full" {...anim(0.2)}>
          <ProgressPhotos
  photos={data.progress_photos}
  onRefresh={fetchDashboard}
  hasConsent={data.measurements?.marketing_consent === true}
/>
        </motion.div>

        {/* Streak & Water */}
        <motion.div {...anim(0.25)}>
          <StreakCard streak={data.streak} />
        </motion.div>

        <motion.div {...anim(0.3)}>
          <WaterTracker water={data.water} />
        </motion.div>

        {/* Measurements & Challenges */}
        <motion.div {...anim(0.35)}>
          <BodyMeasurements measurements={data.measurements} />
        </motion.div>

        <motion.div {...anim(0.4)}>
          <ChallengesCard challenges={data.challenges} />
        </motion.div>

        {/* Heatmap */}
        <motion.div className="grid-full" {...anim(0.45)}>
          <HeatmapCard heatmap={data.heatmap} />
        </motion.div>

        {/* Calendar & Badges */}
        <motion.div {...anim(0.5)}>
          <WorkoutCalendar calendar={data.workout_calendar} />
        </motion.div>

        <motion.div {...anim(0.55)}>
          <BadgesCard badges={data.badges} />
        </motion.div>

        {/* Weekly Report */}
        <motion.div className="grid-full" {...anim(0.6)}>
          <WeeklyReport report={data.weekly_report} />
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardTab;