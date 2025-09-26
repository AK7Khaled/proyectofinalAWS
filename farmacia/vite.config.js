import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'farmaciadb.c1qy26iwyklf.us-east-2.rds.amazonaws.com:5000', // redirige /api a tu backend
    },
    allowedHosts: ['ec2-18-191-42-211.us-east-2.compute.amazonaws.com'],
    host: true,    
  },
});
