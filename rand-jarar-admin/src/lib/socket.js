// Lightweight holder for the Echo instance, so code outside the chat pages
// (chatApi, auth) can read the socket id or disconnect without bundling Pusher.
let echoInstance = null;

export const getEchoInstance = () => echoInstance;

export const setEchoInstance = (instance) => {
  echoInstance = instance;
};

export const getSocketId = () => {
  if (!echoInstance) return null;
  try {
    return echoInstance.socketId();
  } catch {
    return null;
  }
};

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};
