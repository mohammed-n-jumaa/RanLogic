import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import apiClient from '../api/apiClient';
import { BACKEND_URL } from '../config';
import { getEchoInstance, setEchoInstance } from './socket';

export { getSocketId, disconnectEcho } from './socket';

window.Pusher = Pusher;

export const getEcho = () => {
  const existing = getEchoInstance();
  if (existing) return existing;

  const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'eu',
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    // Authorize private channels through apiClient so the *current* token is
    // always sent (a token captured at creation time goes stale after re-login).
    authorizer: (channel) => ({
      authorize: (socketId, callback) => {
        apiClient
          .post(`${BACKEND_URL}/broadcasting/auth`, {
            socket_id: socketId,
            channel_name: channel.name,
          }, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            withCredentials: false,
          })
          .then((response) => callback(null, response.data))
          .catch((error) => callback(error));
      },
    }),
  });

  setEchoInstance(echo);
  return echo;
};
