import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle } from 'lucide-react';

// Short answers taken from the site's own policies (terms / refund / FAQ pages)
const QUESTIONS = [
  {
    q: { ar: 'متى بيوصلني البرنامج بعد الاشتراك؟', en: 'When do I get my program after subscribing?' },
    a: { ar: 'خلال 24–48 ساعة بيوصلك برنامج التدريب والتغذية المخصص إلك، وبتقدر تتواصل مع الكوتش من أول يوم.', en: 'Within 24–48 hours you receive your personalised training and nutrition program, and you can message your coach from day one.' },
  },
  {
    q: { ar: 'شو طرق الدفع المتاحة؟', en: 'Which payment methods can I use?' },
    a: { ar: 'PayPal (بطاقة أو حساب PayPal) بشكل فوري، أو تحويل بنكي ويتفعّل اشتراكك بعد مراجعة التحويل.', en: 'PayPal (card or PayPal account) instantly, or bank transfer — your subscription is activated once the transfer is reviewed.' },
  },
  {
    q: { ar: 'هل البرامج مناسبة للمبتدئين؟', en: 'Are the programs suitable for beginners?' },
    a: { ar: 'أكيد، البرنامج بيتصمم حسب مستواك وهدفك، من المبتدئ للمحترف، وبيتعدّل مع تقدّمك.', en: 'Yes — every program is built around your level and goal, from beginner to advanced, and adjusted as you progress.' },
  },
  {
    q: { ar: 'بقدر أتمرن بالبيت ولا لازم جيم؟', en: 'Can I train at home, or do I need a gym?' },
    a: { ar: 'الاثنين. بتختار مكان التمرين، والكوتش بيصمم برنامجك على أساسه — بالبيت أو بالجيم.', en: 'Both. You choose where you train and your coach builds the program around it — at home or at the gym.' },
  },
];

const PlansFaq = ({ isArabic }) => {
  const t = (ar, en) => (isArabic ? ar : en);
  const [open, setOpen] = useState(0);

  return (
    <section className="pl-section pl-faq">
      <div className="pl-container pl-container--narrow">
        <div className="pl-section__head">
          <h2>{t('أسئلة قبل ما تشترك', 'Questions before you subscribe')}</h2>
        </div>

        <div className="pl-faq__list">
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`pl-faq__item ${isOpen ? 'is-open' : ''}`}>
                <button type="button" className="pl-faq__q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span>{t(item.q.ar, item.q.en)}</span>
                  <ChevronDown />
                </button>
                <div className="pl-faq__a">
                  <div>
                    <p>
                      {t(item.a.ar, item.a.en)}
                      {item.link && <> <Link to={item.link.to}>{t(item.link.ar, item.link.en)}</Link></>}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="pl-faq__contact">
          <MessageCircle />
          {t('عندك سؤال ثاني؟', 'Another question?')} <Link to="/contact">{t('تواصل معنا', 'Contact us')}</Link>
        </p>
      </div>
    </section>
  );
};

export default PlansFaq;
