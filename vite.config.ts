import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const hmrEnabled = process.env.DISABLE_HMR !== 'true' && !process.env.APP_URL;

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    define: {
      'import.meta.env.APP_URL': JSON.stringify(process.env.APP_URL ?? ''),
      // Supabase credentials — baked in at build time so they work in all
      // environments (AI Studio, local dev, production) without a .env file.
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
        process.env.VITE_SUPABASE_URL ?? 'https://lpsxrwesflgkoosncyrc.supabase.co'
      ),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
        process.env.VITE_SUPABASE_ANON_KEY ??
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwc3hyd2VzZmxna29vc25jeXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NTkyMDgsImV4cCI6MjEwOTUzNTIwOH0.9VlSqKrbzPoYTaKrV1tTQlxruGsKk-UWQxqrZAqjl4k'
      ),
    },
    server: {
      // Hosted previews set APP_URL because their Vite HMR WebSocket is unreachable.
      hmr: hmrEnabled,
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
