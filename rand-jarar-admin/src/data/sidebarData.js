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
  Globe
} from 'lucide-react';

export const sidebarSections = [

  {
    id: 'dashboard',
    title: 'لوحة التحكم',
    icon: LayoutDashboard,
    color: '#e91e63',
    items: [
      {
        id: 'dashboard-home',
        label: 'تحليلات الموقع ',
        icon: LayoutDashboard,
        path: '/dashboard'
      }
    ]
  },

  // إدارة المحتوى
  {
    id: 'content',
    title: 'إدارة المحتوى',
    icon: LayoutDashboard,
    color: '#9c27b0',
    items: [
      { id: 'logo', label: 'الشعار والعلامة', icon: Image, path: '/content/logo' },
      { id: 'hero', label: 'واجهة الموقع', icon: Video, path: '/content/hero' },
      { id: 'AboutCoach', label: 'عن المدربة', icon: Star, path: '/content/AboutCoach' },
      { id: 'certifications', label: 'الشهادات والدورات', icon: Medal, path: '/content/certifications' },
      { id: 'testimonials', label: 'آراء العملاء', icon: MessageSquare, path: '/content/testimonials' },
      { id: 'faq', label: 'الأسئلة الشائعة', icon: HelpCircle, path: '/content/faq' },
      { id: 'footer', label: 'إدارة الفوتر', icon: Globe, path: '/content/footer' }

      
    ]
  },

  // إدارة التدريب
  {
    id: 'training',
    title: 'إدارة التدريب',
    icon: Dumbbell,
    color: '#3f51b5',
    items: [
      { id: 'clients-list', label: 'قائمة المتدربين', icon: Users, path: '/training/clients' },
      { id: 'chat', label: 'محادثات المتدربين', icon: MessageCircleMore, path: '/chat' }
    ]
  },

  // المدفوعات
  {
    id: 'subscriptions',
    title: 'المدفوعات',
    icon: Users,
    color: '#ff9800',
    items: [
      { id: 'bank-transfer', label: 'التحويلات البنكية', icon: UserCheck, path: '/BankTransferSubscriptions' },
      { id: 'paypal', label: 'باي بال', icon: UserCheck, path: '/PayPalSubscriptions' }
    ]
  },

  // الإعدادات
  {
    id: 'settings',
    title: 'الإعدادات',
    icon: Settings,
    color: '#607d8b',
    items: [
      { id: 'profile', label: 'الملف الشخصي', icon: UserCircle, path: '/settings/profile' }
    ]
  },

 {
  id: 'logout',
  title: 'تسجيل الخروج',
  icon: LogOut,
  color: '#f44336',
  items: [],
  action: 'logout', 
}
];
