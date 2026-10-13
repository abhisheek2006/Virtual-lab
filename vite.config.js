import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Tailwind v4 is wired in as a Vite plugin (no tailwind.config.js needed).
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
