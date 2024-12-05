import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true, // Enable SSR build
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
  optimizeDeps: {
    include: ['swiper'],
  },

 
})

