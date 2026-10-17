import { useState } from 'react';
import { BellRing, Dumbbell } from 'lucide-react';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import { useProfileFeedback } from '../profile/shell/feedbackContext';
import api from '../../api/index';
import authApi from '../../api/authApi';
import './Chat.scss';

const ChatContainer = ({
  messages,
  chatMessage,
  setChatMessage,
  onSendMessage,
  sending,
  trainerAvatar,
  trainerOnline,
  trainerTyping,
}) => {
  const { t } = useProfileLanguage();
  const { toast } = useProfileFeedback();
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  const handleEnableNotifications = async () => {
    try {
      const { default: OneSignal } = await import('react-onesignal');
      const permission = await Notification.requestPermission();
      setNotifStatus(permission);
      if (permission !== 'granted') return;

      await OneSignal.User.PushSubscription.optIn();
      toast(t('تم تفعيل الإشعارات 🔔', 'Notifications enabled 🔔'));

      setTimeout(async () => {
        const playerId = OneSignal.User?.PushSubscription?.id;
        if (playerId && authApi.isAuthenticated()) {
          await api.post('/fcm-token', { onesignal_id: playerId });
          localStorage.setItem('onesignal_id', playerId);
        }
      }, 2000);
    } catch (err) {
      console.error('OneSignal error:', err);
      toast(t('ما قدرنا نفعّل الإشعارات', "Couldn't enable notifications"), 'error');
    }
  };

  const status = trainerTyping
    ? t('يكتب الآن...', 'Typing...')
    : trainerOnline ? t('متصل الآن', 'Online now') : t('غير متصل', 'Offline');

  return (
    <section className="pf-card ch">
      <header className="ch__head">
        <span className="ch__avatar">
          {trainerAvatar ? <img src={trainerAvatar} alt="" /> : <Dumbbell />}
          {trainerOnline && <i className="ch__online" aria-hidden="true" />}
        </span>
        <div className="ch__who">
          <strong>{t('فريق RanLogic', 'RanLogic Team')}</strong>
          <small className={trainerOnline || trainerTyping ? 'is-online' : ''}>{status}</small>
        </div>

        {notifStatus !== 'granted' && notifStatus !== 'denied' && (
          <button type="button" className="pf-btn pf-btn--ghost pf-btn--sm" onClick={handleEnableNotifications}>
            <BellRing /> <span className="ch__notif-label">{t('تفعيل الإشعارات', 'Enable notifications')}</span>
          </button>
        )}
      </header>

      <MessagesList messages={messages} trainerTyping={trainerTyping} />

      <MessageInput
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        onSendMessage={onSendMessage}
        sending={sending}
      />
    </section>
  );
};

export default ChatContainer;
