import { defineConfig } from 'vite';
import path from 'path';
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export default defineConfig({
  define: {
    // Accessing variables using process.env to use in frontend
    'REVOLUT_API_PUBLIC_KEY': JSON.stringify(process.env.REVOLUT_API_PUBLIC_KEY),
    'PRS_URL': JSON.stringify(process.env.PRS_URL),
    'FETCH_URL': JSON.stringify('http://' + process.env.HOST + ':' + process.env.PORT) 
  },
  root: path.resolve(__dirname, './client/html'), // Set the frontend root
  server: {
    port: 5179, // Change port if needed
  },
  proxy: {
    '/api': {
      target: process.env.HOST + ':' + process.env.PORT, // Use the environment variable
      changeOrigin: true,
      secure: false, // For local development (use true for production)
      rewrite: (path) => path.replace(/^\/api/, ''),
    }
    
  },
  build: {
    outDir: path.resolve(__dirname, './client/html', 'dist'), // Output build files in client/dist
  }
});