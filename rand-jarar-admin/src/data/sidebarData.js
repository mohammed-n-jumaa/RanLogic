import {
  LayoutDashboard,
  Image,
  Video,
  Star,
  Medal,
  MessageSquare,
  HelpCircle,
  Users,
  Dumbbell,
  UserCheck,
  Settings,
  UserCircle,
  LogOut,
  MessageCircleMore,
  Globe,
  BookOpen,
  LayoutGrid,
  Ticket,
  Palette 
} from 'lucide-react';
import { t } from '../i18n';

export const sidebarSections = [

  {
    id: 'dashboard',
    title: t('لوحة التحكم'),
    icon: LayoutDashboard,
    color: '#e91e63',
    items: [
      {
        id: 'dashboard-home',
        label: t('تحليلات الموقع '),
        icon: LayoutDashboard,
        path: '/dashboard'
      }
    ]
  },

  // إدارة المحتوى
  {
    id: 'content',
    title: t('إدارة المحتوى'),
    icon: LayoutDashboard,
    color: '#9c27b0',
    items: [
      { id: 'site-colors', label: t('ألوان الموقع'), icon: Palette, path: '/site-colors' },
      { id: 'logo', label: t('الشعار والعلامة'), icon: Image, path: '/content/logo' },
      { id: 'hero', label: t('واجهة الموقع'), icon: Video, path: '/content/hero' },
      { id: 'AboutCoach', label: t('عن المدربة'), icon: Star, path: '/content/AboutCoach' },
      { id: 'certifications', label: t('الشهادات والدورات'), icon: Medal, path: '/content/certifications' },
      { id: 'testimonials', label: t('آراء العملاء'), icon: MessageSquare, path: '/content/testimonials' },
      { id: 'faq', label: t('الأسئلة الشائعة'), icon: HelpCircle, path: '/content/faq' },
      { id: 'footer', label: t('إدارة الفوتر'), icon: Globe, path: '/content/footer' }

      
    ]
  },

  // إدارة التدريب
  {
    id: 'training',
    title: t('إدارة التدريب'),
    icon: Dumbbell,
    color: '#3f51b5',
    items: [
      { id: 'clients-list', label: t('قائمة المتدربين'), icon: Users, path: '/training/clients' },
      { id: 'chat', label: t('محادثات المتدربين'), icon: MessageCircleMore, path: '/chat' },
      { id: 'exercise-library', label: t('مكتبة التمارين'), icon: BookOpen, path: '/training/exercise-library' },
      { id: 'all-users', label: t('جميع المستخدمين'), icon: UserCircle, path: '/training/all-users' }
      
    ]
  },

  // المدفوعات
  {
    id: 'subscriptions',
    title: t('المدفوعات'),
    icon: Users,
    color: '#ff9800',
    items: [
      { id: 'bank-transfer', label: t('التحويلات البنكية'), icon: UserCheck, path: '/BankTransferSubscriptions' },
      { id: 'paypal', label: t('باي بال'), icon: UserCheck, path: '/PayPalSubscriptions' },
      { id: 'plans', label: t('إدارة الخطط'), icon: LayoutGrid, path: '/plans' },
      { id: 'coupons', label: t('أكواد الخصم'), icon: Ticket, path: '/coupons' }
    ]
  },

  // الإعدادات
  {
    id: 'settings',
    title: t('الإعدادات'),
    icon: Settings,
    color: '#607d8b',
    items: [
      { id: 'profile', label: t('الملف الشخصي'), icon: UserCircle, path: '/settings/profile' }
    ]
  },

 {
  id: 'logout',
  title: t('تسجيل الخروج'),
  icon: LogOut,
  color: '#f44336',
  items: [],
  action: 'logout', 
}
];
