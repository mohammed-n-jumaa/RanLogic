import axios from 'axios';

/**
 * API Configuration
 * Base URL is read from VITE_API_BASE_URL (see src/config.js)
 */
import { API_BASE_URL } from '../config';
import { toast, fallbackError } from '../lib/notify';
import { t } from '../i18n';

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

/**
 * Request interceptor
 * Adds authentication token to every request
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Rate limiting (429)
 * The backend throttles requests; instead of failing, wait and retry
 * automatically while a countdown toast tells the admin what's happening.
 */
const MAX_RETRIES = 2;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retryDelay = (error, attempt) => {
  const retryAfter = Number(error.response?.headers?.['retry-after']);
  if (retryAfter > 0) return Math.min(retryAfter, 10) * 1000;
  return 3000 * attempt;
};

let busyToast = null;
let pendingRetries = 0;
let retryFailed = false;

const beginRetry = (ms) => {
  pendingRetries += 1;
  const seconds = Math.max(1, Math.round(ms / 1000));
  const busy = {
    type: 'warning',
    title: t('الخادم مشغول قليلاً'),
    text: t('سنعيد المحاولة تلقائياً'),
    countdown: seconds,
  };
  if (busyToast) busyToast.update(busy);
  else busyToast = toast(busy);
};

const endRetry = (ok) => {
  pendingRetries -= 1;
  if (!ok) retryFailed = true;
  if (pendingRetries > 0 || !busyToast) return;
  busyToast.update(retryFailed
    ? { type: 'error', title: t('الخادم مشغول'), text: t('حاول مرة أخرى بعد دقيقة') }
    : { type: 'success', title: t('تم'), text: t('تم تحميل البيانات'), duration: 2500 });
  busyToast = null;
  retryFailed = false;
};

/**
 * Error message shown when a request fails and the page doesn't show its own
 */
const errorMessage = (error) => {
  const status = error.response?.status;
  const serverMessage = error.response?.data?.message;
  if (!error.response) {
    return error.code === 'ECONNABORTED'
      ? t('انتهت مهلة الاتصال بالخادم، حاول مرة أخرى')
      : t('لا يوجد اتصال بالخادم، تأكد من الإنترنت');
  }
  if (status === 403) return serverMessage || t('ليس لديك صلاحية لتنفيذ هذا الإجراء');
  if (status === 404) return serverMessage || t('العنصر غير موجود');
  if (status === 422) return serverMessage || t('تأكد من البيانات المدخلة');
  if (status >= 500) return t('حدث خطأ في الخادم، حاول بعد قليل');
  return serverMessage || t('حدث خطأ غير متوقع');
};

/**
 * Response interceptor
 * Handles rate limiting, expired sessions and shows errors to the admin
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const status = response?.status;

    // Unauthorized - token expired or invalid
    if (status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');

      // Redirect to login only if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Too many requests - wait and retry
    if (status === 429 && config) {
      const attempt = (config.retryCount || 0) + 1;
      if (attempt <= MAX_RETRIES) {
        config.retryCount = attempt;
        const ms = retryDelay(error, attempt);
        if (!config.silent) beginRetry(ms);
        await sleep(ms);
        try {
          const retried = await apiClient(config);
          if (!config.silent) endRetry(true);
          return retried;
        } catch (retryError) {
          if (!config.silent) endRetry(false);
          return Promise.reject(retryError);
        }
      }
      // Out of retries: the busy toast already reports it
      return Promise.reject(error);
    }

    if (import.meta.env.DEV) {
      console.error('API error:', status ?? error.code, config?.url, response?.data);
    }

    // A missing resource on load is often expected (empty section), so stay quiet on GET 404
    const quiet = config?.silent || (status === 404 && config?.method === 'get');
    if (!quiet && !axios.isCancel(error)) {
      fallbackError(t('حدث خطأ'), errorMessage(error));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
