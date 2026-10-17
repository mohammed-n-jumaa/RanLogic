import { memo } from 'react';
import { Ruler } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';

const BodyMeasurements = ({ measurements }) => {
  const { t } = useProfileLanguage();

  const fields = [
    { key: 'height', ar: 'الطول', en: 'Height', unit: t('سم', 'cm') },
    { key: 'weight', ar: 'الوزن', en: 'Weight', unit: t('كغ', 'kg') },
    { key: 'waist', ar: 'الخصر', en: 'Waist', unit: t('سم', 'cm') },
    ...(measurements?.gender === 'female' ? [{ key: 'hips', ar: 'الأرداف', en: 'Hips', unit: t('سم', 'cm') }] : []),
  ];

  return (
    <section className="pf-card">
      <div className="pf-card__head">
        <h3 className="pf-card__title"><span className="pf-card__icon"><Ruler /></span>{t('قياسات الجسم', 'Body measurements')}</h3>
      </div>
      {!measurements ? (
        <p className="pf-card__sub">{t('لا توجد قياسات', 'No measurements')}</p>
      ) : (
        <div className="db-measures">
          {fields.map(f => (
            <div key={f.key} className="db-measure">
              <small>{t(f.ar, f.en)}</small>
              <strong className="pf-num">{measurements[f.key] || '--'}</strong>
              <small>{f.unit}</small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default memo(BodyMeasurements);
