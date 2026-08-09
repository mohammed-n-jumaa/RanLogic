import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: { enabled: false },
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      selfDestroying: true,
      manifest: {
        name: 'RanLogic - فريق مدربين ومختصي تغذية أونلاين',
        short_name: 'RanLogic',
        description: 'منصة لياقة بدنية متكاملة: فريق من المدربين الشخصيين المعتمدين ومختصي التغذية. برامج تدريب مخصصة، أنظمة غذائية، وحاسبة سعرات مجانية.',
        theme_color: '#FDB813',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        dir: 'rtl',
        lang: 'ar',
        categories: ['health', 'fitness', 'lifestyle', 'sports'],
        icons: [
          { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        shortcuts: [
          {
            name: 'باقات الاشتراك',
            short_name: 'الباقات',
            description: 'اختر باقة التدريب المناسبة لك',
            url: '/plans',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'حاسبة السعرات',
            short_name: 'حاسبة',
            description: 'احسب سعراتك اليومية مجاناً',
            url: '/calorie-calculator',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'الأسئلة الشائعة',
            short_name: 'FAQ',
            description: 'إجابات على أسئلتك عن التدريب والتغذية',
            url: '/faq',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }]
          }
        ]
      }
    })
  ],

  build: {
    target: 'es2020',
minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer'
            if (id.includes('react-icons')) return 'icons'
            if (id.includes('sweetalert2')) return 'swal'
            if (id.includes('pusher') || id.includes('laravel-echo')) return 'realtime'
            if (id.includes('html2canvas')) return 'html2canvas'
            if (id.includes('axios')) return 'axios'
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/react-router/') ||
              id.includes('/react-router-dom/')
            ) return 'vendor'

            return 'vendor'
          }
        }
      }
    }
  }
})