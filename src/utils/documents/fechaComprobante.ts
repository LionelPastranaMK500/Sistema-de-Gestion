export const formatearFechaComprobante = (
  fecha: string | Date | null | undefined
): string => {
  if (!fecha) return "Fecha no disponible";

  const f = new Date(fecha);

  if (isNaN(f.getTime())) return "Fecha inválida";

  return f.toLocaleString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
