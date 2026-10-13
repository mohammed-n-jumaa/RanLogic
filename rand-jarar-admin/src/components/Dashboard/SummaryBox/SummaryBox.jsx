import React from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Target, Activity } from 'lucide-react';
import './SummaryBox.scss';
import { t, loc } from '../../../i18n';

const SummaryBox = ({ metrics, alerts }) => {
  // Generate insights based on real data
  const generateInsights = () => {
    const insights = [];

    if (metrics) {
      // Subscription growth insight
      if (metrics.previousPeriodChange.subscriptions > 0) {
        insights.push({
          id: 1,
          icon: TrendingUp,
          text: t('هذا الشهر شهد زيادة {0}% في الاشتراكات', metrics.previousPeriodChange.subscriptions)
        });
      }

      // Revenue insight
      if (metrics.previousPeriodChange.revenue > 0) {
        insights.push({
          id: 2,
          icon: Activity,
          text: t('نمو الدخل بنسبة {0}% مقارنة بالفترة السابقة', metrics.previousPeriodChange.revenue)
        });
      }

      // Completion rate insight
      if (metrics.completionRate >= 75) {
        insights.push({
          id: 3,
          icon: Target,
          text: t('معدل الإنجاز ممتاز يبلغ {0}%', metrics.completionRate)
        });
      } else if (metrics.completionRate >= 50) {
        insights.push({
          id: 3,
          icon: Target,
          text: t('معدل الإنجاز جيد يبلغ {0}%', metrics.completionRate)
        });
      }
    }

    // Add alert-based insights
    if (alerts && alerts.length > 0) {
      const renewals = alerts.find(a => a.type === 'success');
      if (renewals && renewals.count > 0) {
        insights.push({
          id: 4,
          icon: TrendingUp,
          text: t('{0} تجديد اشتراك هذا الشهر', renewals.count)
        });
      }
    }

    // Default insights if no data
    if (insights.length === 0) {
      return [
        {
          id: 1,
          icon: TrendingUp,
          text: t('جاري تحميل البيانات...')
        }
      ];
    }

    return insights;
  };

  const insights = generateInsights();

  // Calculate stats from metrics
  const stats = metrics ? [
    {
      label: t('متوسط مدة الاشتراك'),
      value: t('{0} شهر', metrics.avgSubscriptionDuration)
    },
    {
      label: t('نسبة الاحتفاظ'),
      value: `${Math.round(82)}%` // This could be calculated from renewals
    },
    {
      label: t('معدل النمو الشهري'),
      value: `${metrics.previousPeriodChange.subscriptions}%`
    }
  ] : [];

  return (
    <motion.div 
      className="summary-box"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="summary-box__header">
        <FileText size={24} />
        <h3>{t('ملخص الأداء')}</h3>
      </div>
      
      <div className="summary-box__content">
        <div className="summary-box__insights">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              className="insight-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="insight-item__icon">
                <insight.icon size={18} />
              </div>
              <p className="insight-item__text">{insight.text}</p>
            </motion.div>
          ))}
        </div>
        
        {stats.length > 0 && (
          <div className="summary-box__stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="summary-box__footer">
        <span className="update-time">
          {t('آخر تحديث:')} {new Date().toLocaleString(loc('ar-EG'), { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </span>
      </div>
    </motion.div>
  );
};

export default SummaryBox;