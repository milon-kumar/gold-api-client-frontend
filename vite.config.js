import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5050,

    hmr: {
      host: 'org-saas-frontend.test',
      port: 5050,
    },

    allowedHosts: [
      'org-saas-frontend.test',
      'jubosongho.org-saas-frontend.test',
      'ahlehadeethbd.org-saas-frontend.test'
    ]
  }
})