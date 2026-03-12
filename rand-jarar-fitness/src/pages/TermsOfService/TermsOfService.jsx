import React from 'react';
import { motion } from 'framer-motion';
import { FaFileContract } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import SEO from '../../components/SEO/SEO';
import '../Legal/LegalPages.scss';

const TermsOfService = () => {
  const { isArabic, currentLang } = useLanguage();

  const content = {
    ar: {
      seoTitle: 'شروط الاستخدام | RanLogic',
      seoDescription:
        'اطلع على شروط استخدام منصة RanLogic وخدمات الاشتراك والتدريب المقدمة من رند جرار.',
      badge: 'شروط الاستخدام',
      title: 'شروط الاستخدام',
      subtitle:
        'تنظم هذه الشروط استخدامك لموقع RanLogic والخدمات التدريبية الرقمية المقدمة عبره، بما في ذلك التسجيل والاشتراك والوصول للمحتوى التدريبي والتغذوي.',
      updated: 'آخر تحديث',
      effective: 'سارية من',
      owner: 'اسم المنصة',
      updatedValue: 'مارس 2026',
      effectiveValue: 'مارس 2026',
      ownerValue: 'RanLogic',
      sections: [
        {
          title: 'قبول الشروط',
          points: [
            'باستخدامك للموقع أو بإنشاء حساب، فإنك توافق على الالتزام بهذه الشروط.',
            'إذا كنت لا توافق على هذه الشروط، يجب عليك عدم استخدام الموقع أو أي من خدماته.'
          ]
        },
        {
          title: 'الخدمة المقدمة',
          points: [
            'يوفر الموقع خدمات تدريبية ورقمية تشمل خطط الاشتراك، خطط التمرين، الأنظمة الغذائية، متابعة المستخدم، والمحادثة مع المدربة.',
            'الخدمة مقدمة لأغراض اللياقة والتوجيه العام ولا تعتبر بديلًا عن الاستشارة الطبية المتخصصة.'
          ]
        },
        {
          title: 'الحساب والمسؤولية',
          points: [
            'أنت مسؤول عن صحة البيانات التي تقدمها عند التسجيل وعن الحفاظ على سرية بيانات الدخول الخاصة بك.',
            'أنت مسؤول عن كل الأنشطة التي تتم من خلال حسابك.'
          ]
        },
        {
          title: 'الاشتراك والوصول',
          points: [
            'يتم منحك الوصول إلى الخدمات وفقًا للخطة والمدة التي تقوم باختيارها ودفعها.',
            'قد تختلف المزايا حسب نوع الخطة المختارة ومدة الاشتراك.'
          ]
        },
        {
          title: 'الاستخدام المسموح',
          points: [
            'لا يجوز إعادة بيع الخدمة أو مشاركة الحساب أو محاولة الوصول غير المصرح به إلى حسابات أو بيانات مستخدمين آخرين.',
            'لا يجوز استخدام المنصة بأي طريقة تضر بالنظام أو بمحتواه أو بالمدربة أو بالمستخدمين.'
          ]
        },
        {
          title: 'تعديل الخدمة أو الشروط',
          points: [
            'يجوز تعديل بعض أجزاء الموقع أو المحتوى أو هذه الشروط عند الحاجة.',
            'أي استمرار في استخدام الموقع بعد التحديثات يعتبر موافقة على النسخة المعدلة.'
          ]
        }
      ],
      note:
        'يخضع استخدام الموقع أيضًا لسياسة الخصوصية وسياسة عدم الاسترجاع المعروضة في الصفحات القانونية.'
    },
    en: {
      seoTitle: 'Terms of Service | RanLogic',
      seoDescription:
        'Read the terms that govern the use of RanLogic and the digital coaching services provided by Rand Jarrar.',
      badge: 'Terms of Service',
      title: 'Terms of Service',
      subtitle:
        'These terms govern your use of RanLogic and the digital coaching services provided through the platform, including registration, subscriptions, and access to workout and nutrition content.',
      updated: 'Last Updated',
      effective: 'Effective From',
      owner: 'Platform Name',
      updatedValue: 'March 2026',
      effectiveValue: 'March 2026',
      ownerValue: 'RanLogic',
      sections: [
        {
          title: 'Acceptance of Terms',
          points: [
            'By using the website or creating an account, you agree to be bound by these terms.',
            'If you do not agree, you should not use the website or any related services.'
          ]
        },
        {
          title: 'Services Provided',
          points: [
            'The platform provides digital coaching services including subscription plans, workout plans, nutrition plans, user follow-up, and chat access with the coach.',
            'The service is offered for fitness and general coaching purposes and is not a substitute for professional medical advice.'
          ]
        },
        {
          title: 'Account Responsibility',
          points: [
            'You are responsible for the accuracy of the information you provide and for maintaining the confidentiality of your login credentials.',
            'You are responsible for activities that occur under your account.'
          ]
        },
        {
          title: 'Subscription and Access',
          points: [
            'Access to services is granted according to the selected plan and duration that you purchase.',
            'Available features may vary depending on the subscription type and duration.'
          ]
        },
        {
          title: 'Permitted Use',
          points: [
            'You may not resell the service, share your account, or attempt unauthorized access to other accounts or user data.',
            'You may not use the platform in any way that harms the system, its content, the coach, or other users.'
          ]
        },
        {
          title: 'Changes to Services or Terms',
          points: [
            'Parts of the website, content, or these terms may be updated when necessary.',
            'Continued use of the website after updates means acceptance of the revised version.'
          ]
        }
      ],
      note:
        'Your use of the website is also subject to the Privacy Policy and the No Refund Policy displayed in the legal pages.'
    }
  };

  const t = isArabic ? content.ar : content.en;

  return (
    <>
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        lang={currentLang}
      />

      <div className="legal-page-wrapper">
        <Header />

        <div className="legal-page" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="legal-page__inner">
            <motion.div
              className="legal-hero"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="hero-badge">
                <FaFileContract />
                <span>{t.badge}</span>
              </div>
              <h1 className="hero-title">{t.title}</h1>
              <p className="hero-subtitle">{t.subtitle}</p>
            </motion.div>

            <motion.div
              className="legal-card"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.7 }}
            >
              <div className="legal-meta">
                <div className="meta-box">
                  <span className="meta-label">{t.updated}</span>
                  <span className="meta-value">{t.updatedValue}</span>
                </div>
                <div className="meta-box">
                  <span className="meta-label">{t.effective}</span>
                  <span className="meta-value">{t.effectiveValue}</span>
                </div>
                <div className="meta-box">
                  <span className="meta-label">{t.owner}</span>
                  <span className="meta-value">{t.ownerValue}</span>
                </div>
              </div>

              <div className="legal-sections">
                {t.sections.map((section, index) => (
                  <div className="legal-section" key={index}>
                    <h2 className="section-title">
                      <span className="dot"></span>
                      {section.title}
                    </h2>
                    <ul>
                      {section.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="legal-note">{t.note}</div>
            </motion.div>
          </div>
        </div>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default TermsOfService;