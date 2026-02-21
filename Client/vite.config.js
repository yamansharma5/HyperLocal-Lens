import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {// Proxy API requests to the backend server to avoid CORS issues during development and to enable real-time features with Socket.IO
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',// Proxy Socket.IO connections to the backend
        ws: true,// Proxy WebSocket connections for Socket.IO
      },
    },
  },
});
