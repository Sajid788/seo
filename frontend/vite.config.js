import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './', 
  plugins: [react()],
  server: {
    port: 3001,
  },
  build: {
    outDir: 'dist', 
    emptyOutDir: true,
    // Reduce issues with file locks on Windows/OneDrive
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Clear cache before build if needed
  clearScreen: false,
})
