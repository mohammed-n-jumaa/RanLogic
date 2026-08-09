import { useState, useEffect } from 'react';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import { useProfileLanguage } from '../../contexts/ProfileLanguageContext';
import api from '../../api/index';
import authApi from '../../api/authApi';

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
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  // useEffect(() => {
  //   // تسجيل OneSignal ID تلقائياً إذا كان مسموحاً
  //   if (notifStatus === 'granted' && authApi.isAuthenticated()) {
  //     const saved = localStorage.getItem('onesignal_id');
  //     if (!saved) {
  //       import('react-onesignal').then(({ default: OneSignal }) => {
  //         setTimeout(() => {
  //           const playerId = OneSignal.User?.PushSubscription?.id;
  //           if (playerId) {
  //             api.post('/fcm-token', { onesignal_id: playerId })
  //               .then(() => localStorage.setItem('onesignal_id', playerId))
  //               .catch(console.error);
  //           }
  //         }, 2000);
  //       });
  //     }
  //   }
  // }, [notifStatus]);

  const handleEnableNotifications = async () => {
    try {
      const { default: OneSignal } = await import('react-onesignal');

      const permission = await Notification.requestPermission();
      setNotifStatus(permission);
      if (permission !== 'granted') return;

      await OneSignal.User.PushSubscription.optIn();

      setTimeout(async () => {
        const playerId = OneSignal.User?.PushSubscription?.id;
        if (playerId && authApi.isAuthenticated()) {
          await api.post('/fcm-token', { onesignal_id: playerId });
          localStorage.setItem('onesignal_id', playerId);
        }
      }, 2000);
    } catch (err) {
      console.error('OneSignal error:', err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          {trainerAvatar && (
            <div className="trainer-header-avatar">
              <img src={trainerAvatar} alt="RanLogic Team" />
            </div>
          )}

          <div className="header-text">
            <h3>{t('المحادثة مع فريق RanLogic', 'Chat with RanLogic Team')}</h3>
            <p>
              {trainerTyping
                ? t('يكتب الآن...', 'Typing...')
                : trainerOnline
                ? t('متصل الآن', 'Online now')
                : t('غير متصل', 'Offline')}
            </p>
          </div>
        </div>

        {notifStatus !== 'granted' && (
          <button
            onClick={handleEnableNotifications}
            style={{
              background: '#FDB813',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            🔔 {t('تفعيل الإشعارات', 'Enable Notifications')}
          </button>
        )}
      </div>

      <MessagesList messages={messages} />

      <MessageInput
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        onSendMessage={onSendMessage}
        sending={sending}
      />
    </div>
  );
};

export default ChatContainer;