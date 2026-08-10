import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';
import ScrollToTop from '../../components/common/ScrollToTop/ScrollToTop';
import SEO from '../../components/common/SEO/SEO';
import '../Legal/LegalPages.scss';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  const { isArabic, currentLang } = useLanguage();

  const content = {
    ar: {
      badge:          'شروط الاستخدام',
      title:          'شروط الاستخدام',
      subtitle:       'تنظم هذه الشروط استخدامك لموقع RanLogic والخدمات التدريبية الرقمية المقدمة من فريق RanLogic، بما في ذلك التسجيل والاشتراك والوصول للمحتوى التدريبي والتغذوي.',
      updated:        'آخر تحديث',
      effective:      'سارية من',
      owner:          'اسم المنصة',
      updatedValue:   'مارس 2026',
      effectiveValue: 'مارس 2026',
      ownerValue:     'RanLogic',
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
            'يوفر فريق RanLogic خدمات تدريبية ورقمية تشمل خطط الاشتراك، خطط التمرين، الأنظمة الغذائية، متابعة المستخدم، والمحادثة مع فريق التدريب.',
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
            'لا يجوز استخدام المنصة بأي طريقة تضر بالنظام أو بمحتواه أو بفريق RanLogic أو بالمستخدمين.'
          ]
        },
        {
          title: 'تعديل الخدمة أو الشروط',
          points: [
            'يجوز لفريق RanLogic تعديل بعض أجزاء الموقع أو المحتوى أو هذه الشروط عند الحاجة.',
            'أي استمرار في استخدام الموقع بعد التحديثات يعتبر موافقة على النسخة المعدلة.'
          ]
        }
      ],
      note: 'يخضع استخدام الموقع أيضًا لسياسة الخصوصية وسياسة الاسترجاع المعروضة في الصفحات القانونية.'
    },
    en: {
      badge:          'Terms of Service',
      title:          'Terms of Service',
      subtitle:       'These terms govern your use of RanLogic and the digital coaching services provided by the RanLogic team, including registration, subscriptions, and access to workout and nutrition content.',
      updated:        'Last Updated',
      effective:      'Effective From',
      owner:          'Platform Name',
      updatedValue:   'March 2026',
      effectiveValue: 'March 2026',
      ownerValue:     'RanLogic',
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
            'The RanLogic team provides digital coaching services including subscription plans, workout plans, nutrition plans, user follow-up, and chat access with the training team.',
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
            'You may not use the platform in any way that harms the system, its content, the RanLogic team, or other users.'
          ]
        },
        {
          title: 'Changes to Services or Terms',
          points: [
            'The RanLogic team may update parts of the website, content, or these terms when necessary.',
            'Continued use of the website after updates means acceptance of the revised version.'
          ]
        }
      ],
      note: 'Your use of the website is also subject to the Privacy Policy and the Refund Policy displayed in the legal pages.'
    }
  };

  const t = isArabic ? content.ar : content.en;

  return (
    <>
      <SEO
        page="termsOfService"
        breadcrumbItems={[
          { name: isArabic ? 'الرئيسية' : 'Home',         url: '/' },
          { name: isArabic ? 'شروط الاستخدام' : 'Terms of Service', url: '/terms-of-service' }
        ]}
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
                <FileText />
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