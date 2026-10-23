import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Keep big, rarely-changing libraries in their own long-cached chunks
        advancedChunks: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'charts', test: /node_modules[\\/](recharts|d3-[^\\/]+|victory-vendor)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/ },
            { name: 'realtime', test: /node_modules[\\/](pusher-js|laravel-echo)[\\/]/ },
            { name: 'sweetalert', test: /node_modules[\\/]sweetalert2[\\/]/ },
          ],
        },
      },
    },
  },
})
