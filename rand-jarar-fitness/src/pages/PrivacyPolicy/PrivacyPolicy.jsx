import React from 'react';
import { motion } from 'framer-motion';
import { FaBan } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import SEO from '../../components/SEO/SEO';
import '../Legal/LegalPages.scss';

const RefundPolicy = () => {
  const { isArabic, currentLang } = useLanguage();

  const content = {
    ar: {
      seoTitle: 'سياسة عدم الاسترجاع | RanLogic',
      seoDescription:
        'اطلع على سياسة عدم الاسترجاع الخاصة باشتراكات وخدمات RanLogic التدريبية الرقمية.',
      badge: 'سياسة عدم الاسترجاع',
      title: 'سياسة عدم الاسترجاع',
      subtitle:
        'نظرًا لأن خدمات RanLogic تعتمد على اشتراكات رقمية وخطط تدريب وتغذية يتم تجهيزها وإتاحتها مباشرة بعد تفعيل الاشتراك، فإن جميع الاشتراكات غير قابلة للاسترجاع.',
      updated: 'آخر تحديث',
      effective: 'سارية من',
      owner: 'اسم المنصة',
      updatedValue: 'مارس 2026',
      effectiveValue: 'مارس 2026',
      ownerValue: 'RanLogic',
      sections: [
        {
          title: 'عدم الاسترجاع',
          body: [
            'جميع رسوم الاشتراك المدفوعة عبر الموقع نهائية وغير قابلة للاسترداد.',
            'يشمل ذلك الاشتراكات الشهرية أو لثلاثة أشهر أو لستة أشهر بجميع الخطط المتاحة على المنصة.'
          ]
        },
        {
          title: 'سبب هذه السياسة',
          body: [
            'الخدمة المقدمة هي خدمة رقمية مرتبطة بالوصول إلى النظام، وخطط التدريب، والأنظمة الغذائية، والمتابعة مع المدربة.',
            'بمجرد تفعيل الاشتراك أو تجهيز المحتوى المرتبط به، تعتبر الخدمة قد بدأت فعليًا.'
          ]
        },
        {
          title: 'قبل الشراء',
          body: [
            'يُرجى مراجعة تفاصيل الخطة ومدة الاشتراك والتأكد من اختيار الخطة المناسبة قبل إتمام عملية الدفع.',
            'إذا كان لديك أي استفسار قبل الاشتراك، يمكنك التواصل معنا عبر صفحة التواصل قبل إتمام الدفع.'
          ]
        },
        {
          title: 'الاستثناءات',
          body: [
            'لا توجد استثناءات عامة على سياسة عدم الاسترجاع ما لم يثبت وجود خطأ تقني واضح أدى إلى تحصيل المبلغ أكثر من مرة لنفس الطلب.',
            'في حال وجود مشكلة دفع مكررة مثبتة، سيتم التحقق منها ومعالجتها حسب الحالة.'
          ]
        }
      ],
      note:
        'إتمام الدفع والاشتراك في المنصة يعني موافقتك الكاملة على سياسة عدم الاسترجاع هذه.'
    },
    en: {
      seoTitle: 'No Refund Policy | RanLogic',
      seoDescription:
        'Read the no refund policy that applies to RanLogic digital subscriptions and coaching services.',
      badge: 'No Refund Policy',
      title: 'No Refund Policy',
      subtitle:
        'Because RanLogic provides digital subscription-based services, including workout and nutrition access that become available upon activation, all subscription payments are non-refundable.',
      updated: 'Last Updated',
      effective: 'Effective From',
      owner: 'Platform Name',
      updatedValue: 'March 2026',
      effectiveValue: 'March 2026',
      ownerValue: 'RanLogic',
      sections: [
        {
          title: 'No Refunds',
          body: [
            'All subscription payments made through the platform are final and non-refundable.',
            'This applies to all available plans and durations, including monthly, 3-month, and 6-month subscriptions.'
          ]
        },
        {
          title: 'Why This Policy Exists',
          body: [
            'The service is digital in nature and includes access to the platform, workout plans, nutrition plans, and coaching support.',
            'Once the subscription is activated or related content is prepared, the service is considered to have started.'
          ]
        },
        {
          title: 'Before You Purchase',
          body: [
            'Please review the selected plan and subscription duration carefully before completing your payment.',
            'If you have any questions before subscribing, you may contact us through the Contact page before purchase.'
          ]
        },
        {
          title: 'Exceptions',
          body: [
            'There are no general exceptions to this no-refund policy unless a clear technical issue results in duplicate charging for the same order.',
            'In the event of a confirmed duplicate payment issue, it may be reviewed and handled on a case-by-case basis.'
          ]
        }
      ],
      note:
        'By completing payment and subscribing to the platform, you fully agree to this No Refund Policy.'
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
                <FaBan />
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

export default RefundPolicy;