import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';
import ScrollToTop from '../../components/common/ScrollToTop/ScrollToTop';
import SEO from '../../components/common/SEO/SEO';
import '../Legal/LegalPages.scss';

const PrivacyPolicy = () => {
  const { isArabic, currentLang } = useLanguage();

  const content = {
    ar: {
      badge:          'سياسة الخصوصية',
      title:          'سياسة الخصوصية',
      subtitle:       'نوضح هنا كيف يتم جمع بياناتك واستخدامها وحمايتها أثناء استخدامك لموقع RanLogic وخدمات الاشتراك والتدريب المقدمة من فريق RanLogic.',
      updated:        'آخر تحديث',
      effective:      'سارية من',
      owner:          'صاحب الخدمة',
      updatedValue:   'مارس 2026',
      effectiveValue: 'مارس 2026',
      ownerValue:     'فريق RanLogic',
      sections: [
        {
          title: 'ما البيانات التي نجمعها',
          body: [
            'قد نجمع البيانات التي تدخلها عند التسجيل أو الاشتراك أو استخدام الموقع، مثل الاسم، البريد الإلكتروني، كلمة المرور المشفرة، بيانات الملف الشخصي، وبيانات الاشتراك.',
            'قد نجمع أيضًا المعلومات المتعلقة باستخدامك للخدمة مثل الخطة المختارة، مدة الاشتراك، بيانات التقدم، خطط التمرين، النظام الغذائي، وسجل المحادثات مع فريق التدريب داخل النظام.'
          ]
        },
        {
          title: 'كيف نستخدم البيانات',
          body: [
            'نستخدم بياناتك لتشغيل الموقع، إنشاء حسابك، إدارة اشتراكك، عرض خطط التمرين والتغذية، تمكين التواصل مع فريق RanLogic، وتحسين تجربتك داخل المنصة.',
            'قد نستخدم بريدك الإلكتروني أو بيانات التواصل للرد على الاستفسارات أو إرسال إشعارات مرتبطة بحسابك واشتراكك فقط.'
          ]
        },
        {
          title: 'بيانات الدفع',
          body: [
            'عمليات الدفع تتم عبر مزودات دفع خارجية مثل PayPal، ونحن لا نخزن بيانات البطاقة البنكية الكاملة داخل الموقع.',
            'قد نحتفظ فقط ببيانات مرتبطة بحالة الدفع والاشتراك، مثل نوع الخطة، حالة العملية، وتواريخ بداية ونهاية الاشتراك.'
          ]
        },
        {
          title: 'مشاركة البيانات',
          body: [
            'لا نقوم ببيع بياناتك الشخصية لأي طرف ثالث.',
            'قد تتم مشاركة البيانات فقط مع الخدمات الضرورية لتشغيل الموقع بشكل آمن، مثل خدمات الاستضافة، البريد، أو بوابات الدفع، وذلك بالقدر اللازم فقط.'
          ]
        },
        {
          title: 'حماية البيانات',
          body: [
            'يعمل فريق RanLogic على تطبيق وسائل تقنية وإدارية مناسبة لحماية بيانات المستخدمين من الوصول غير المصرح به أو التعديل أو الفقدان.',
            'رغم ذلك، لا يمكن ضمان الأمان الكامل لأي نظام متصل بالإنترنت بشكل مطلق.'
          ]
        },
        {
          title: 'حقوقك',
          body: [
            'يمكنك طلب تحديث بياناتك الشخصية أو تصحيحها من خلال حسابك أو عبر التواصل مع فريقنا.',
            'يمكنك أيضًا التواصل معنا إذا رغبت بالاستفسار عن كيفية استخدام بياناتك.'
          ]
        }
      ],
      note: 'باستخدامك للموقع، فإنك توافق على هذه السياسة وعلى معالجة بياناتك بالقدر اللازم لتقديم خدمات فريق RanLogic.'
    },
    en: {
      badge:          'Privacy Policy',
      title:          'Privacy Policy',
      subtitle:       'This page explains how your information is collected, used, and protected while using RanLogic and the coaching services provided by the RanLogic team.',
      updated:        'Last Updated',
      effective:      'Effective From',
      owner:          'Service Owner',
      updatedValue:   'March 2026',
      effectiveValue: 'March 2026',
      ownerValue:     'RanLogic Team',
      sections: [
        {
          title: 'Information We Collect',
          body: [
            'We may collect the information you provide when registering, subscribing, or using the website, including your name, email address, encrypted password, profile information, and subscription details.',
            'We may also collect service-related usage data such as your selected plan, subscription duration, progress details, workout plans, nutrition plans, and coaching chat history with the RanLogic team.'
          ]
        },
        {
          title: 'How We Use Information',
          body: [
            'Your information is used to operate the platform, create your account, manage subscriptions, deliver workout and nutrition plans, enable communication with the RanLogic team, and improve your overall experience.',
            'We may use your email or contact details to respond to inquiries or send account and subscription related notifications.'
          ]
        },
        {
          title: 'Payment Information',
          body: [
            'Payments are processed through third-party providers such as PayPal, and we do not store full credit or debit card information on our website.',
            'We may keep limited payment-related information such as plan type, payment status, and subscription start and end dates.'
          ]
        },
        {
          title: 'Data Sharing',
          body: [
            'We do not sell your personal data to third parties.',
            'Information may only be shared with service providers necessary to run the website securely, such as hosting, email, or payment providers, and only to the extent required.'
          ]
        },
        {
          title: 'Data Protection',
          body: [
            'The RanLogic team uses reasonable technical and organizational safeguards to protect user information from unauthorized access, loss, misuse, or alteration.',
            'However, no internet-based platform can guarantee absolute security at all times.'
          ]
        },
        {
          title: 'Your Rights',
          body: [
            'You may request correction or update of your personal information through your account or by contacting our team directly.',
            'You may also contact us if you have questions about how your information is handled.'
          ]
        }
      ],
      note: 'By using the website, you agree to this policy and to the processing of your data as necessary to provide RanLogic team services.'
    }
  };

  const t = isArabic ? content.ar : content.en;

  return (
    <>
      <SEO
        page="privacyPolicy"
        breadcrumbItems={[
          { name: isArabic ? 'الرئيسية' : 'Home',           url: '/' },
          { name: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy', url: '/privacy-policy' }
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
                <FaShieldAlt />
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
                    {section.body.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
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

export default PrivacyPolicy;