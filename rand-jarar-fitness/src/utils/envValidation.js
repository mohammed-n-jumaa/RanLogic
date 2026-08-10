const requiredVars = [
  'VITE_API_BASE_URL',
  'VITE_BACKEND_URL',
  'VITE_PUSHER_APP_KEY',
  'VITE_PUSHER_APP_CLUSTER',
  'VITE_ONESIGNAL_APP_ID',
];

export const validateEnv = () => {
  if (import.meta.env.PROD) return;

  const missing = requiredVars.filter(
    (key) => !import.meta.env[key]
  );

  if (missing.length > 0) {
    console.warn(
      `⚠️ Missing environment variables:\n${missing.map((v) => `  - ${v}`).join('\n')}\n\nCopy .env.example to .env and fill in the values.`
    );
  }
};