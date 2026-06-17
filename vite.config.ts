import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Default globs don't include audio; precache the breath clips so they
        // still play when the installed PWA is used offline.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
      },
      manifest: {
        name: 'Breathe Bubbles',
        short_name: 'Breathe',
        description: 'HRV breathing tracking app',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        id: '/',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
