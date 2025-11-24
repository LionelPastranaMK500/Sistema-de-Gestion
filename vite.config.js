import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@components": path.resolve(__dirname, "src/components"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@auth": path.resolve(__dirname, "src/modules/auth"),
      "@cliente": path.resolve(__dirname, "src/modules/clientes"),
      "@configuracion": path.resolve(__dirname, "src/modules/configuracion"),
      "@dashboard": path.resolve(__dirname, "src/modules/dashboard"),
      "@estadistica": path.resolve(__dirname, "src/modules/estadisticas"),
      "@facturas": path.resolve(__dirname, "src/modules/facturas"),
      "@productos": path.resolve(__dirname, "src/modules/productos"),
      "@guias": path.resolve(__dirname, "src/modules/guia_remision"),
      "@proformas": path.resolve(__dirname, "src/modules/proformas"),
      "@ventas": path.resolve(__dirname, "src/modules/ventas"),
      "@reportes": path.resolve(__dirname, "src/modules/reportes"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@services": path.resolve(__dirname, "src/services"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@stores": path.resolve(__dirname, "src/stores"),
    },
  },
})