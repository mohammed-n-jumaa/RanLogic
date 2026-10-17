import { useEffect, useState } from 'react';
import { Landmark, Upload, CheckCircle2, X, Copy, Smartphone, Loader2, Send, PartyPopper } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { useProfileFeedback } from '../profile/shell/feedbackContext';
import subscriptionApi from '../../api/subscriptionApi';

const BANK_DETAILS = {
  bankName: 'Bank al Etihad',
  accountName: 'Randa Nimer',
  iban: 'JO73UBSI6700000670166682715101',
  cliqAlias: 'RANDAR101',
};
const MAX_MB = 5;

const BankTransferPayment = ({ planType, duration, amount, originalAmount, discountPercentage, onSuccess, onCancel }) => {
  const { t } = useProfileLanguage();
  const { toast, celebrate } = useProfileFeedback();
  const [transferNumber, setTransferNumber] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(t('تم النسخ ✓', 'Copied ✓'), 'info');
    } catch {
      toast(t('ما قدرنا ننسخ — انسخه يدوياً', "Couldn't copy — please copy it manually"), 'error');
    }
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErrors(p => ({ ...p, receipt: t('يرجى رفع صورة فقط', 'Please upload an image') })); return; }
    if (file.size > MAX_MB * 1024 * 1024) { setErrors(p => ({ ...p, receipt: t(`الحجم لازم يكون أقل من ${MAX_MB} ميجا`, `Must be under ${MAX_MB}MB`) })); return; }
    setReceipt(file);
    setPreview(URL.createObjectURL(file));
    setErrors(p => ({ ...p, receipt: '' }));
  };

  const removeImage = () => { setReceipt(null); setPreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors = {};
    if (!transferNumber.trim()) nextErrors.transferNumber = t('يرجى إدخال رقم التحويل', 'Please enter the transfer number');
    if (!receipt) nextErrors.receipt = t('يرجى رفع صورة الإيصال', 'Please upload the receipt');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const subscription = await subscriptionApi.createBankTransferSubscription({
        plan_type: planType,
        duration,
        amount: parseFloat(amount),
        original_amount: parseFloat(originalAmount),
        discount_percentage: discountPercentage,
        payment_method: 'bank_transfer',
        bank_transfer_number: transferNumber,
      });
      if (!subscription.success) throw new Error('Failed to create subscription');

      const upload = await subscriptionApi.uploadBankReceipt(subscription.data.subscription_id, {
        transferNumber,
        receipt,
      });
      if (!upload.success) throw new Error('Failed to upload receipt');

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

        <div className="pay-bank__title pay-bank__title--cliq"><Smartphone /> {t('أو عبر كليك (الأردن)', 'Or via CliQ (Jordan)')}</div>
        <CopyRow label={t('الاسم المستعار', 'Alias')} value={BANK_DETAILS.cliqAlias} onCopy={copy} copyLabel={t('نسخ', 'Copy')} />
      </div>

      <p className="pay-step__note"><CheckCircle2 /> {t('بعد التحويل، اكتب رقم الحوالة وارفع صورة الإيصال.', 'After transferring, enter the reference number and upload the receipt.')}</p>

      <label className={`ep-field ${errors.transferNumber ? 'has-error' : ''}`}>
        <span className="ep-field__label">{t('رقم التحويل *', 'Transfer number *')}</span>
        <input
          type="text"
          value={transferNumber}
          onChange={e => { setTransferNumber(e.target.value); if (errors.transferNumber) setErrors(p => ({ ...p, transferNumber: '' })); }}
          placeholder={t('رقم الحوالة البنكية', 'Bank transfer reference')}
          disabled={isSubmitting}
          dir="ltr"
        />
        {errors.transferNumber && <small className="ep-field__error">{errors.transferNumber}</small>}
      </label>

      <div className="ep-field">
        <span className="ep-field__label">{t('صورة الإيصال *', 'Receipt image *')}</span>
        {preview ? (
          <div className="pay-receipt">
            <img src={preview} alt="" />
            <span className="pay-receipt__name">{receipt?.name}</span>
            <button type="button" className="pf-icon-btn" onClick={removeImage} disabled={isSubmitting} aria-label={t('إزالة', 'Remove')}><X /></button>
          </div>
        ) : (
          <label className={`pay-upload ${errors.receipt ? 'has-error' : ''}`}>
            <input type="file" accept="image/*" hidden onChange={handleImage} disabled={isSubmitting} />
            <Upload />
            <strong>{t('اضغط لرفع صورة الإيصال', 'Tap to upload the receipt')}</strong>
            <small>{t(`PNG أو JPG — حتى ${MAX_MB} ميجا`, `PNG or JPG — up to ${MAX_MB}MB`)}</small>
          </label>
        )}
        {errors.receipt && <small className="ep-field__error">{errors.receipt}</small>}
      </div>

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
