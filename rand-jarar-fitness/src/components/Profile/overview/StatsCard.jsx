import { motion } from 'framer-motion';
import { 
  FaRuler, 
  FaWeight, 
  FaBullseye, 
  FaUser,
  FaHome,
  FaHeartbeat,
  FaRunning,
  FaVenusMars,
  FaChartLine
} from 'react-icons/fa';
import { useProfileLanguage } from '../../../contexts/ProfileLanguageContext';

const StatsCard = ({ userData, delay }) => {
  const { t } = useProfileLanguage();

  const goalLabels = {
    'weight-loss': { ar: 'إنقاص الوزن', en: 'Weight Loss' },
    'muscle-gain': { ar: 'بناء العضلات', en: 'Muscle Gain' },
    'toning': { ar: 'التنشيف', en: 'Toning' },
    'fitness': { ar: 'اللياقة العامة', en: 'General Fitness' }
  };

  const workoutPlaceLabels = {
    'home': { ar: 'المنزل', en: 'Home' },
    'gym': { ar: 'الصالة الرياضية', en: 'Gym' }
  };

  const genderLabels = {
    'male': { ar: 'ذكر', en: 'Male' },
    'female': { ar: 'أنثى', en: 'Female' }
  };

  const getGoalLabel = (goal) => {
    const label = goalLabels[goal];
    return label ? t(label.ar, label.en) : t('غير محدد', 'Not set');
  };

  const getWorkoutPlaceLabel = (place) => {
    const label = workoutPlaceLabels[place];
    return label ? t(label.ar, label.en) : t('غير محدد', 'Not set');
  };

  const getGenderLabel = (gender) => {
    const label = genderLabels[gender];
    return label ? t(label.ar, label.en) : t('غير محدد', 'Not set');
  };

  const stats = [
    { icon: FaRuler, labelAr: 'الطول (سم)', labelEn: 'Height (cm)', value: `${userData.height || '--'} ${t('سم', 'cm')}`, type: 'height' },
    { icon: FaWeight, labelAr: 'الوزن الحالي (كجم)', labelEn: 'Current Weight (kg)', value: `${userData.weight || '--'} ${t('كجم', 'kg')}`, type: 'weight' },
    { icon: FaVenusMars, labelAr: 'الجنس', labelEn: 'Gender', value: getGenderLabel(userData.gender), type: 'gender' },
    { icon: FaUser, labelAr: 'الخصر (عند السرة)', labelEn: 'Waist (at navel)', value: `${userData.waist || '--'} ${t('سم', 'cm')}`, type: 'waist' },
    { icon: FaUser, labelAr: 'الأرداف (للإناث)', labelEn: 'Hips (for females)', value: userData.gender === 'female' ? `${userData.hips || '--'} ${t('سم', 'cm')}` : '--', type: 'hips' },
    { icon: FaBullseye, labelAr: 'هدفك', labelEn: 'Your Goal', value: getGoalLabel(userData.goal), type: 'goal' },
    { icon: FaHome, labelAr: 'مكان التمرين', labelEn: 'Workout Place', value: getWorkoutPlaceLabel(userData.workout_place), type: 'place' },
    { icon: FaHeartbeat, labelAr: 'ملاحظات صحية', labelEn: 'Health Notes', value: userData.health_notes || t('لا توجد إصابات أو حساسية', 'No injuries or allergies'), type: 'health' },
    { icon: FaRunning, labelAr: 'العمر', labelEn: 'Age', value: `${userData.age || '--'} ${t('سنة', 'years')}`, type: 'age' }
  ];

  return (
    <motion.div
      className="stats-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="card-header">
        <h3>{t('الإحصائيات الشخصية', 'Personal Stats')}</h3>
        <FaChartLine className="header-icon" />
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-item"
            whileHover={{ scale: 1.03 }}
          >
            <div className={`stat-icon ${stat.type}`}>
              <stat.icon />
            </div>
            <div className="stat-info">
              <span className="stat-label">{t(stat.labelAr, stat.labelEn)}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StatsCard;