// src/components/SeoContent.jsx
import React from 'react';

const SeoContent = () => {
  return (
    <div 
      className="seo-content"
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        opacity: 0.0001,
        color: 'transparent',
        background: 'transparent',
        pointerEvents: 'none',
        zIndex: -1,
        userSelect: 'none',
        fontSize: '16px',
        lineHeight: '1.5'
      }}
    >
      <h1>رند جرار - مدربة لياقة بدنية أونلاين معتمدة عالمياً</h1>
      <p>احصل على برنامج تدريبي مخصص ونظام غذائي أونلاين من أي مكان في العالم مع المدربة المعتمدة دولياً رند جرار. برامج خسارة الوزن، بناء العضلات، التنشيف للنساء والرجال. متابعة يومية ونتائج مضمونة في جميع أنحاء العالم عبر الإنترنت.</p>
      
      <h2>خدمات التدريب الأونلاين المتوفرة عالمياً</h2>
      <ul>
        <li>برامج تدريبية مخصصة للنساء والرجال في جميع أنحاء العالم</li>
        <li>أنظمة غذائية للتنشيف وخسارة الوزن عن بعد</li>
        <li>برامج بناء العضلات ونحت الجسم أونلاين</li>
        <li>متابعة يومية ودعم مستمر من أي دولة</li>
        <li>تمارين منزلية وتمارين في النادي عبر الإنترنت</li>
        <li>تدريب شخصي أونلاين متاح 24/7</li>
      </ul>
      
      <h2 lang="en">Rend Jarrar - Certified International Online Fitness Trainer</h2>
      <p lang="en">
        Get personalized training programs and nutrition plans online from anywhere in the world. 
        Weight loss, muscle building, cutting, and body sculpting for women and men. 
        Daily follow-up and guaranteed results worldwide.
      </p>
      
      <h3>الأسئلة الشائعة</h3>
      <div itemScope itemType="https://schema.org/FAQPage">
        <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
          <h4 itemProp="name">كم تكلفة برامج التدريب الشخصي؟</h4>
          <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
            <p itemProp="text">تبدأ أسعار البرامج من 39 دولار أمريكي شهرياً، مع خيارات دفع مرنة وخطة سداد حسب البرنامج المختار.</p>
          </div>
        </div>
      </div>
      
      <h3>الدول المتاحة</h3>
      <p>الأردن، السعودية، الإمارات، مصر، الكويت، قطر، عمان، البحرين، أمريكا، كندا، بريطانيا، ألمانيا، فرنسا، استراليا، وكل دول العالم.</p>
    </div>
  );
};

export default SeoContent;