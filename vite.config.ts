import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


import dotenv from 'dotenv';

dotenv.config();

const env = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    host:"localhost",
  },
  define: {
    'process.env': env,
  },
  plugins: [react()],
})
