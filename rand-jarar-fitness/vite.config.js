import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // ✅ يشتغل فقط في الإنتاج - ما يزعج في التطوير
      devOptions: {
        enabled: false
      },
      manifest: {
        name: "RanLogic - Rend Jarrar Fitness",
        short_name: "RanLogic",
        description: "مدربة لياقة بدنية معتمدة دولياً",
        theme_color: "#FDB813",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        dir: "rtl",
        lang: "ar",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  // ✅ تحسين الأداء
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          framer: ['framer-motion'],
          icons: ['react-icons']
        }
      }
    }
  }
})