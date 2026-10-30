import { useState } from 'react';
import { Landmark, CheckCircle2, Copy, Smartphone, Loader2, Send, PartyPopper } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { useProfileFeedback } from '../profile/shell/feedbackContext';
import subscriptionApi from '../../api/subscriptionApi';

// CliQ is hidden for now — set to true to show the alias again
const SHOW_CLIQ = false;

const BANK_DETAILS = {
  bankName: 'Bank al Etihad',
  accountName: 'Randa Nimer',
  iban: 'JO73UBSI6700000670166682715101',
  cliqAlias: 'RANDAR101',
};

const BankTransferPayment = ({ planType, duration, amount, originalAmount, discountPercentage, onSuccess, onCancel }) => {
  const { t } = useProfileLanguage();
  const { toast, celebrate } = useProfileFeedback();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(t('تم النسخ ✓', 'Copied ✓'), 'info');
    } catch {
      toast(t('ما قدرنا ننسخ — انسخه يدوياً', "Couldn't copy — please copy it manually"), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const subscription = await subscriptionApi.createBankTransferSubscription({
        plan_type: planType,
        duration,
        amount: parseFloat(amount),
        original_amount: parseFloat(originalAmount),
        discount_percentage: discountPercentage,
        payment_method: 'bank_transfer',
      });
      if (!subscription.success) throw new Error('Failed to create subscription');

      setSubmitted(true);
      celebrate(t('وصلنا طلبك! 🎉', 'Request received! 🎉'));
    } catch (error) {
      console.error('Bank transfer error:', error);
      toast(error.response?.data?.message
        || t('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى', 'Something went wrong. Please try again'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pay-step pay-step--done">
        <span className="pf-state__icon pay-step__done-icon"><PartyPopper /></span>
        <h3>{t('تم استلام طلب التجديد', 'Renewal request received')}</h3>
        <p className="pf-card__sub">{t('رح نراجع التحويل ونفعّل اشتراكك خلال 48 ساعة.', "We'll review the transfer and activate your plan within 48 hours.")}</p>
        <button type="button" className="pf-btn pf-btn--primary" onClick={onSuccess}>{t('تمام', 'Done')}</button>
      </div>
    );
  }


  return (
    <form className="pay-step" onSubmit={handleSubmit} noValidate>
      <div className="pay-step__amount">
        <span>{t('المبلغ المطلوب', 'Amount due')}</span>
        <strong className="pf-num">${amount}</strong>
      </div>

      <div className="pay-bank">
        <div className="pay-bank__title"><Landmark /> {t('حوّل للحساب البنكي', 'Transfer to this bank account')}</div>
        <div className="pay-bank__row"><span>{t('البنك', 'Bank')}</span><strong>{BANK_DETAILS.bankName}</strong></div>
        <div className="pay-bank__row"><span>{t('اسم الحساب', 'Account name')}</span><strong>{BANK_DETAILS.accountName}</strong></div>
        <CopyRow label="IBAN" value={BANK_DETAILS.iban} onCopy={copy} copyLabel={t('نسخ', 'Copy')} />

        {SHOW_CLIQ && (
          <>
            <div className="pay-bank__title pay-bank__title--cliq"><Smartphone /> {t('أو عبر كليك (الأردن)', 'Or via CliQ (Jordan)')}</div>
            <CopyRow label={t('الاسم المستعار', 'Alias')} value={BANK_DETAILS.cliqAlias} onCopy={copy} copyLabel={t('نسخ', 'Copy')} />
          </>
        )}
      </div>

      <p className="pay-step__note"><CheckCircle2 /> {t('بعد التحويل، اضغط إرسال الطلب ورح نراجعه ونفعّل اشتراكك.', 'After transferring, send the request and we will review it and activate your plan.')}</p>

      <div className="pay-step__actions">
        <button type="button" className="pf-btn pf-btn--ghost" onClick={onCancel} disabled={isSubmitting}>{t('رجوع', 'Back')}</button>
        <button type="submit" className="pf-btn pf-btn--primary" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="pf-spin" /> : <Send />}
          {isSubmitting ? t('جاري الإرسال…', 'Submitting…') : t('إرسال الطلب', 'Submit request')}
        </button>
      </div>
    </form>
  );
};

const CopyRow = ({ label, value, onCopy, copyLabel }) => (
  <button type="button" className="pay-bank__row is-copy" onClick={() => onCopy(value)} aria-label={`${copyLabel} ${label}`}>
    <span>{label}</span>
    <strong className="pf-num">{value}</strong>
    <Copy />
  </button>
);

export default BankTransferPayment;
