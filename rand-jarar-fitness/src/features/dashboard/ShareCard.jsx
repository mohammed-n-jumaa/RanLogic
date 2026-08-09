import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { FaShareAlt, FaTimes, FaFire, FaWeight, FaTint, FaDumbbell, FaTrophy } from 'react-icons/fa';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import localLogo from '../../assets/logo.webp';

const ShareCard = ({ data, onClose }) => {
  const { t, currentLang } = useProfileLanguage();
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);

  const user = data.user_info;
  const report = data.weekly_report;
  const weights = data.weight_chart;
  const firstW = weights[0]?.weight;
  const lastW = weights[weights.length - 1]?.weight;
  const change = firstW && lastW ? (parseFloat(lastW) - parseFloat(firstW)).toFixed(1) : null;
  const earnedBadges = data.badges.filter(b => b.earned).length;

  const downloadBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const captureCard = async () => {
    if (!cardRef.current) return null;

    // Small delay to ensure rendering is complete (helps iOS)
    await new Promise(r => setTimeout(r, 300));

    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: '#1a1a2e',
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false,
      width: cardRef.current.scrollWidth,
      height: cardRef.current.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
    });

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  };

  const generateImage = async () => {
    if (generating) return;
    setGenerating(true);

    try {
      const blob = await captureCard();
      if (!blob) throw new Error('Capture failed');

      // Try native share with image file
      if (navigator.share) {
        const file = new File([blob], 'my-progress.png', { type: 'image/png' });

        try {
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: t('تقدمي مع RanLogic', 'My Progress with RanLogic'),
              text: t('شوفوا تقدمي 💪', 'Check out my progress 💪'),
            });
            setGenerating(false);
            return;
          }
        } catch (e) {
          if (e.name !== 'AbortError') {
            console.log('File share failed, trying download:', e);
          } else {
            // User cancelled
            setGenerating(false);
            return;
          }
        }
      }

      // Fallback: open image in new tab (works on all devices including iOS)
      const url = URL.createObjectURL(blob);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS) {
        // iOS: open in new tab so user can long-press to save/share
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${t('تقدمي', 'My Progress')}</title>
                <style>
                  body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #f5f5f5; font-family: system-ui; }
                  img { max-width: 90%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
                  p { margin-top: 16px; color: #888; font-size: 14px; text-align: center; }
                </style>
              </head>
              <body>
                <img src="${url}" alt="Progress" />
                <p>${t('اضغط مطولاً على الصورة لحفظها أو مشاركتها', 'Long press the image to save or share')}</p>
              </body>
            </html>
          `);
          newTab.document.close();
        }
      } else {
        downloadBlob(blob);
      }

    } catch (err) {
      console.error('Generate error:', err);

      // Emergency fallback: screenshot instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert(t(
          'اضغط زر الطاقة + رفع الصوت لأخذ سكرين شوت ومشاركتها',
          'Press Power + Volume Up to take a screenshot and share it'
        ));
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>

        <button className="share-close" onClick={onClose}><FaTimes /></button>

        <div ref={cardRef} className="share-card-capture">
          <div className="sc-bg">

            {/* Header */}
            <div className="sc-header">
              <div className="sc-logo">
                <img
                  src={localLogo}
                  alt="RanLogic"
                  style={{ height: 40, objectFit: 'contain', borderRadius: 6 }}
                />
              </div>
              <div className="sc-date">
                {new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </div>
            </div>

            {/* User */}
            <div className="sc-user">
              <div className="sc-avatar">{user.name?.charAt(0)}</div>
              <div>
                <div className="sc-name">{user.name}</div>
                <div className="sc-subtitle">{t('ملخص التقدم', 'Progress summary')}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="sc-stats">
              {change && (
                <div className="sc-stat highlight">
                  <FaWeight />
                  <div className="sc-stat-val">{change > 0 ? '+' : ''}{change} {t('كغ', 'kg')}</div>
                  <div className="sc-stat-lbl">{t('تغيير الوزن', 'Weight change')}</div>
                </div>
              )}
              <div className="sc-stat">
                <FaFire />
                <div className="sc-stat-val">{data.streak.count}</div>
                <div className="sc-stat-lbl">{t('يوم التزام', 'Day streak')}</div>
              </div>
              <div className="sc-stat">
                <FaDumbbell />
                <div className="sc-stat-val">{report.exercise_rate}%</div>
                <div className="sc-stat-lbl">{t('التزام التمارين', 'Exercise rate')}</div>
              </div>
              <div className="sc-stat">
                <FaTint />
                <div className="sc-stat-val">{report.avg_water}</div>
                <div className="sc-stat-lbl">{t('معدل المي', 'Avg water')}</div>
              </div>
              <div className="sc-stat">
                <FaTrophy />
                <div className="sc-stat-val">{earnedBadges}</div>
                <div className="sc-stat-lbl">{t('شارات', 'Badges')}</div>
              </div>
              <div className="sc-stat">
                <FaDumbbell />
                <div className="sc-stat-val">{report.workout_days}/7</div>
                <div className="sc-stat-lbl">{t('أيام التمرين', 'Workout days')}</div>
              </div>
            </div>

            {/* Challenges */}
            {data.challenges.filter(c => c.is_joined).length > 0 && (
              <div className="sc-challenges">
                <div className="sc-ch-title">{t('التحديات النشطة', 'Active challenges')}</div>
                {data.challenges.filter(c => c.is_joined).map(ch => {
                  const pct = Math.round((ch.completed_days / ch.duration_days) * 100);
                  return (
                    <div key={ch.id} className="sc-ch-row">
                      <span className="sc-ch-name">
                        {currentLang === 'ar' ? ch.name_ar : ch.name_en}
                      </span>
                      <div className="sc-ch-bar">
                        <div className="sc-ch-fill" style={{ width: `${pct}%`, background: ch.color }} />
                      </div>
                      <span className="sc-ch-pct">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Weight journey */}
            {firstW && lastW && (
              <div className="sc-journey">
                <span className="sc-j-item">{firstW} {t('كغ', 'kg')}</span>
                <span className="sc-j-arrow">→</span>
                <span className="sc-j-item current">{lastW} {t('كغ', 'kg')}</span>
              </div>
            )}

            {/* Footer */}
            <div className="sc-footer">
              <span>ranlogic.com</span>
              <span>💪 {t('حقق أهدافك معنا', 'Achieve your goals with us')}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="share-actions">
          <button
            className="share-action-btn primary"
            onClick={generateImage}
            disabled={generating}
          >
            {generating
              ? t('جاري التحميل...', 'Generating...')
              : <><FaShareAlt /> {t('مشاركة التقدم', 'Share Progress')}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;