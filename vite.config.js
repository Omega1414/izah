import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteHtmlPlugin from 'vite-plugin-html';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ViteHtmlPlugin()],
  optimizeDeps: {
    include: ['swiper'],
  },

 
})

