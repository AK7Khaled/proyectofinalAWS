import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3306', // redirige /api a tu backend
    },
    allowedHosts: 'ec2-18-191-42-211.us-east-2.compute.amazonaws.com',
    host: true,    
  },
});
