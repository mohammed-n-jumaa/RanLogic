import { Home, LayoutGrid, UtensilsCrossed, Dumbbell, MessageSquare, CreditCard } from 'lucide-react';

export const PROFILE_TABS = [
  { id: 'overview',  labelAr: 'نظرة عامة',   labelEn: 'Overview',  Icon: Home },
  { id: 'dashboard', labelAr: 'لوحة التحكم', labelEn: 'Dashboard', Icon: LayoutGrid },
  { id: 'nutrition', labelAr: 'التغذية',     labelEn: 'Nutrition', Icon: UtensilsCrossed },
  { id: 'workout',   labelAr: 'التمارين',    labelEn: 'Workout',   Icon: Dumbbell },
  { id: 'chat',      labelAr: 'الرسائل',     labelEn: 'Messages',  Icon: MessageSquare, hasBadge: true },
  { id: 'payment',   labelAr: 'الاشتراك',    labelEn: 'Subscription', Icon: CreditCard },
];

export const isProfileTab = id => PROFILE_TABS.some(tab => tab.id === id);

const FALLBACK_AVATAR = 'https://i.postimg.cc/WpqHf2CH/download.png';
const DEFAULT_AVATARS = [FALLBACK_AVATAR, 'default-avatar-female.png', 'default-avatar-male.png'];

// Same rules the old ProfileHeader used: replace the generic default with a gendered one
export const getAvatarUrl = (user) => {
  const url = user?.avatar_url;
  if (url && !DEFAULT_AVATARS.some(d => url.includes(d))) return url;
  if (user?.gender === 'male') return 'https://i.postimg.cc/VNmvRfK2/0b90cfaf-8167-4730-8de0-8872054ff0c5.jpg';
  if (user?.gender === 'female') return 'https://i.postimg.cc/bvmy9QDq/fee021a6-b60e-4456-abc4-6febcb2353c4.jpg';
  return FALLBACK_AVATAR;
};

export const onAvatarError = e => { e.currentTarget.src = FALLBACK_AVATAR; };

export const getSubscriptionProgress = (user) => {
  const start = user?.subscription_start_date ? new Date(user.subscription_start_date) : null;
  const end = user?.subscription_end_date ? new Date(user.subscription_end_date) : null;
  if (!end) return { daysLeft: 0, totalDays: 0, pctLeft: 0, pctUsed: 0 };
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
  const totalDays = start ? Math.max(1, Math.ceil((end - start) / 86400000)) : Math.max(daysLeft, 30);
  const pctLeft = Math.min(100, Math.round((daysLeft / totalDays) * 100));
  return { daysLeft, totalDays, pctLeft, pctUsed: 100 - pctLeft };
};

// YYYY-MM-DD in local time — same format the API uses for exercise_date / meal_date
export const toDateKey = date => date.toLocaleDateString('sv-SE');
export const normalizeDate = value => (value ? String(value).split('T')[0] : null);
export const periodOf = day => (day <= 10 ? 1 : day <= 20 ? 2 : 3);

export const STORAGE_URL = `${import.meta.env.VITE_API_URL || 'https://api.ranlogic.com'}/storage`;

// A rest day is stored as a normal workout row (imported from Excel) named "راحة"
const REST_NAME = /^\s*(يوم\s*)?(راحة|استراحة|rest(\s*day)?|off)\s*$/i;
export const isRestRow = row => REST_NAME.test(row?.name || '');
export const isRestDay = rows => rows.length > 0 && rows.every(isRestRow);
