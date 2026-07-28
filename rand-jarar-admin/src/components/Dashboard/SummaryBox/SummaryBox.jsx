import React from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Target, Activity } from 'lucide-react';
import './SummaryBox.scss';

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
          text: `هذا الشهر شهد زيادة ${metrics.previousPeriodChange.subscriptions}% في الاشتراكات`
        });
      }

      // Revenue insight
      if (metrics.previousPeriodChange.revenue > 0) {
        insights.push({
          id: 2,
          icon: Activity,
          text: `نمو الدخل بنسبة ${metrics.previousPeriodChange.revenue}% مقارنة بالفترة السابقة`
        });
      }

      // Completion rate insight
      if (metrics.completionRate >= 75) {
        insights.push({
          id: 3,
          icon: Target,
          text: `معدل الإنجاز ممتاز يبلغ ${metrics.completionRate}%`
        });
      } else if (metrics.completionRate >= 50) {
        insights.push({
          id: 3,
          icon: Target,
          text: `معدل الإنجاز جيد يبلغ ${metrics.completionRate}%`
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
          text: `${renewals.count} تجديد اشتراك هذا الشهر`
        });
      }
    }

    // Default insights if no data
    if (insights.length === 0) {
      return [
        {
          id: 1,
          icon: TrendingUp,
          text: 'جاري تحميل البيانات...'
        }
      ];
    }

    return insights;
  };

  const insights = generateInsights();

  // Calculate stats from metrics
  const stats = metrics ? [
    {
      label: 'متوسط مدة الاشتراك',
      value: `${metrics.avgSubscriptionDuration} شهر`
    },
    {
      label: 'نسبة الاحتفاظ',
      value: `${Math.round(82)}%` // This could be calculated from renewals
    },
    {
      label: 'معدل النمو الشهري',
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
        <h3>ملخص الأداء</h3>
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
          آخر تحديث: {new Date().toLocaleString('ar-EG', { 
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