// src/components/SeoContent.jsx
// ─────────────────────────────────────────────────────────────────
// محتوى SEO مرئي لقارئات الشاشة وGoogle — بدون cloaking
// sr-only: مخفي بصرياً لكن متاح للـ crawlers وقارئات الشاشة
// ✅ مقبول من Google لأن المحتوى متاح للجميع (مش aria-hidden)
// ─────────────────────────────────────────────────────────────────
import React from 'react';

const SeoContent = () => {
  return (
    <div
      className="sr-only"
      // لا aria-hidden — يجب أن يقرأه الـ crawler وقارئات الشاشة
    >
      {/* ── Arabic ── */}
      <h1>RanLogic - فريق مدربين شخصيين ومختصي تغذية أونلاين معتمدين</h1>
      <p>
        منصة RanLogic تضم فريقاً من المدربين الشخصيين المعتمدين ومختصي التغذية.
        برامج تدريبية مخصصة وأنظمة غذائية متكاملة لحرق الدهون، بناء العضلات،
        والتنشيف للنساء والرجال. متابعة يومية ونتائج مضمونة في جميع أنحاء العالم.
      </p>

      <h2>خدمات فريق RanLogic</h2>
      <ul>
        <li>تدريب شخصي أونلاين مع مدرب معتمد</li>
        <li>استشارة تغذية مخصصة مع مختص معتمد</li>
        <li>برامج حرق الدهون وتنشيف الجسم</li>
        <li>برامج بناء العضلات وزيادة القوة</li>
        <li>حاسبة السعرات الحرارية مجانية</li>
        <li>متابعة يومية وأسبوعية من أي دولة</li>
        <li>اشتراكات مرنة شهرية وسنوية</li>
        <li>تمارين منزلية وتمارين في النادي أونلاين</li>
      </ul>

      {/* ── English ── */}
      <h2 lang="en">RanLogic - Online Personal Trainers &amp; Nutrition Specialists Team</h2>
      <p lang="en">
        RanLogic is a complete fitness platform with a team of certified personal trainers
        and nutrition specialists. Custom workout programs and meal plans for fat loss,
        muscle building, and body transformation for women and men worldwide.
        Daily follow-up and guaranteed results.
      </p>

      {/* ── FAQ Schema-friendly ── */}
      <h3>الأسئلة الشائعة</h3>
      <div itemScope itemType="https://schema.org/FAQPage">

        <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
          <h4 itemProp="name">ما هي خدمات فريق RanLogic؟</h4>
          <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
            <p itemProp="text">
              يقدم فريق RanLogic تدريباً شخصياً أونلاين، استشارات تغذية مخصصة،
              برامج حرق الدهون وبناء العضلات، وحاسبة سعرات حرارية مجانية.
            </p>
          </div>
        </div>

        <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
          <h4 itemProp="name">كم تكلفة الاشتراك في برامج RanLogic؟</h4>
          <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
            <p itemProp="text">
              تبدأ أسعار الباقات من 39 دولار شهرياً مع خيارات دفع مرنة.
              تفضل بزيارة صفحة الباقات للاطلاع على التفاصيل الكاملة.
            </p>
          </div>
        </div>

        <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
          <h4 itemProp="name">هل تتوفر حاسبة سعرات حرارية مجانية؟</h4>
          <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
            <p itemProp="text">
              نعم، يوفر فريق RanLogic حاسبة سعرات حرارية مجانية تحسب احتياجاتك
              اليومية من السعرات والبروتين والكربوهيدرات والدهون.
            </p>
          </div>
        </div>

      </div>

      {/* ── Service Area ── */}
      <h3>الدول المتاحة</h3>
      <p>
        الأردن، السعودية، الإمارات، مصر، الكويت، قطر، عمان، البحرين،
        أمريكا، كندا، بريطانيا، ألمانيا، فرنسا، أستراليا، وجميع دول العالم.
      </p>
    </div>
  );
};

export default SeoContent;