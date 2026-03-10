// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',  // important for proper asset loading in production
  plugins: [react()]
   
})
