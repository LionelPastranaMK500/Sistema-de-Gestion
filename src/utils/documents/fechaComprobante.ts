export const formatearFechaComprobante = (fecha) => {
    if (!fecha) return "Fecha no disponible";

    const f = new Date(fecha);
    return f.toLocaleString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
    });
};
