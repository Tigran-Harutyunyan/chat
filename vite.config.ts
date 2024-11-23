import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoprefixer from 'autoprefixer'

import tailwind from 'tailwindcss'
import { fileURLToPath, URL } from 'node:url'
// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/', import.meta.url)),
      '@convex': fileURLToPath(new URL('./convex/_generated', import.meta.url))
    },
  },
  optimizeDeps: {
    include: ["quill"]
  }
});