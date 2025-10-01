// src/components/Loaders/ContentLoader.jsx
import { useEffect } from "react";

// Este componente se usa como fallback en tus rutas privadas.
// Solo envía eventos para mostrar/ocultar el overlay del MainLayout.
export default function ContentLoader() {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("content-loader:show", {
        detail: { total: 5000, fade: 2000 }, // total=7s, fade in/out=2s => hold=3s
      })
    );

    // Cuando React quite el fallback, pedimos ocultar.
    return () => {
      window.dispatchEvent(new Event("content-loader:hide"));
    };
  }, []);

  return null; // No renderiza UI; el overlay lo maneja MainLayout
}
