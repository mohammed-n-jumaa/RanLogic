import { useEffect, useRef } from 'react';
import authApi from '../api/authApi';
import api from '../api/index';

const useOneSignal = () => {
  const didInitRef = useRef(false);

  useEffect(() => {
    if (didInitRef.current) return;
    if (!authApi.isAuthenticated()) return;

    didInitRef.current = true;

    import('react-onesignal').then(({ default: OneSignal }) => {
      OneSignal.init({
        appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
        safari_web_id: 'web.onesignal.auto.212e621b-efc2-4b2a-9d36-9f4cd158ecec',
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: false,
      }).then(() => {
        OneSignal.Notifications.requestPermission().then(() => {
          OneSignal.User.PushSubscription.optIn();

          setTimeout(() => {
            const playerId = OneSignal.User?.PushSubscription?.id;
            if (playerId && authApi.isAuthenticated()) {
              const savedId = localStorage.getItem('onesignal_id');
              if (savedId === playerId) return;

              api.post('/fcm-token', { onesignal_id: playerId })
                .then(() => localStorage.setItem('onesignal_id', playerId))
                .catch(() => {});
            }
          }, 2000);
        });
      });
    });
  }, []);
};

export default useOneSignal;