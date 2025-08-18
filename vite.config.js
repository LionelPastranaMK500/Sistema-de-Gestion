import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
      "@constants": path.resolve(process.cwd(), "src/constants"),
      "@components": path.resolve(process.cwd(), "src/components"),
      "@modules": path.resolve(process.cwd(), "src/modules"),
      "@routes": path.resolve(process.cwd(), "src/routes"),
      "@services": path.resolve(process.cwd(), "src/services"),
      "@utils": path.resolve(process.cwd(), "src/utils"),
      "@hooks": path.resolve(process.cwd(), "src/hooks"),
      "@layouts": path.resolve(process.cwd(), "src/layouts"),
    },
  },
})
