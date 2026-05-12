import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // 监听所有网络接口，支持局域网访问
    port: 5173,
  },
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
