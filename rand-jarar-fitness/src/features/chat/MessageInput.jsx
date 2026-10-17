import { useEffect, useRef, useState } from 'react';
import { Send, ImagePlus, X, Loader2 } from 'lucide-react';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { useProfileFeedback } from '../profile/shell/feedbackContext';

const MAX_IMAGE_MB = 5;

const MessageInput = ({ chatMessage, setChatMessage, onSendMessage, sending }) => {
  const { t } = useProfileLanguage();
  const { toast } = useProfileFeedback();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast(t('يرجى اختيار صورة فقط', 'Please select an image only'), 'error');
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast(t(`حجم الصورة لازم يكون أقل من ${MAX_IMAGE_MB} ميجا`, `Image must be under ${MAX_IMAGE_MB}MB`), 'error');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSend = () => {
    if (sending) return;
    if (image) {
      onSendMessage(chatMessage, image);
      clearImage();
      return;
    }
    if (chatMessage.trim()) onSendMessage(chatMessage, null);
  };

  const canSend = !sending && (chatMessage.trim() || image);

  return (
    <div className="ch__compose">
      {preview && (
        <div className="ch__preview">
          <img src={preview} alt="" />
          <button type="button" onClick={clearImage} aria-label={t('إزالة الصورة', 'Remove image')}><X /></button>
        </div>
      )}
      <form className="ch__input" onSubmit={e => { e.preventDefault(); handleSend(); }}>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageSelect} />
        <button type="button" className="pf-icon-btn" onClick={() => fileRef.current?.click()} disabled={sending} aria-label={t('إرفاق صورة', 'Attach image')}>
          <ImagePlus />
        </button>
        <input
          type="text"
          value={chatMessage}
          onChange={e => setChatMessage(e.target.value)}
          placeholder={t('اكتب رسالتك للكوتش…', 'Write to your coach…')}
          disabled={sending}
          autoComplete="off"
        />
        <button type="submit" className="pf-btn pf-btn--primary" disabled={!canSend} aria-label={t('إرسال', 'Send')}>
          {sending ? <Loader2 className="pf-spin" /> : <Send />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
