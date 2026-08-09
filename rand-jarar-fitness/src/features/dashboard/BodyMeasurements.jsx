import { FaRuler } from 'react-icons/fa';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const BodyMeasurements = ({ measurements }) => {
  const { t } = useProfileLanguage();

  if (!measurements) {
    return (
      <div className="dash-card">
        <div className="dash-card-title">
          <FaRuler />
          <span>{t('قياسات الجسم', 'Body measurements')}</span>
        </div>
        <p className="dash-empty">{t('لا توجد قياسات', 'No measurements')}</p>
      </div>
    );
  }

  const fields = [
    { key: 'height', ar: 'الطول', en: 'Height', unit: t('سم', 'cm') },
    { key: 'weight', ar: 'الوزن', en: 'Weight', unit: t('كغ', 'kg') },
    { key: 'waist',  ar: 'الخصر', en: 'Waist',  unit: t('سم', 'cm') },
  ];

  // أضف الأرداف بس للإناث
  if (measurements.gender === 'female') {
    fields.push({ key: 'hips', ar: 'الأرداف', en: 'Hips', unit: t('سم', 'cm') });
  }

  return (
    <div className="dash-card">
      <div className="dash-card-title">
        <FaRuler />
        <span>{t('قياسات الجسم', 'Body measurements')}</span>
      </div>

      <div className="measurements-grid" style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}>
        {fields.map(f => (
          <div key={f.key} className="measurement-item">
            <span className="measurement-label">{t(f.ar, f.en)}</span>
            <span className="measurement-val">
              {measurements[f.key] || '--'} {f.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BodyMeasurements;