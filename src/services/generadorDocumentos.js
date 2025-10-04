export const elegirAleatorio = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

export const generarFechaAleatoria = (start, end) => {
    const startMs = start.getTime();
    const endMs = end.getTime();
    const fecha = new Date(startMs + Math.random() * (endMs - startMs));
    fecha.setHours(Math.floor(Math.random() * 24));
    fecha.setMinutes(Math.floor(Math.random() * 60));
    fecha.setSeconds(Math.floor(Math.random() * 60));
    return fecha;
};

export const generarRuc = () => {
    const prefijo = Math.random() < 0.5 ? "10" : "20";
    const resto = Math.floor(Math.random() * 1_000_000_000)
        .toString()
        .padStart(9, "0");
    return prefijo + resto;
};

export const generarDni = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

export const generarItemsAleatorios = (catalogo, maxItems = 2) => {
    const cantidad = Math.floor(Math.random() * maxItems) + 1;
    return Array.from({ length: cantidad }, () => {
        const item = elegirAleatorio(catalogo);
        let precio = item.precio || 0;
        if (precio < 20 || precio > 200) {
            precio = Math.floor(Math.random() * (200 - 20 + 1)) + 20;
        }
        return { ...item, cantidad: 1, unidad: "UND", precio };
    });
};

export const calcularMonto = (tipoDocumento, totalItems) => {
    switch (tipoDocumento) {
        case "NOTA DE CRÉDITO ELECTRÓNICA":
            return -Math.abs(totalItems);
        case "GUÍA DE REMISIÓN ELECTRÓNICA":
            return 0;
        default:
            return totalItems;
    }
};

export const generarEstado = (tipoDocumento) => {
    if (tipoDocumento === "NOTA DE CRÉDITO ELECTRÓNICA") return "ANULADO";

    const rnd = Math.random();
    if (rnd < 0.01) return "RECHAZADO";  // 1%
    if (rnd < 0.55) return "EN PROCESO";  // 54%
    return "ACEPTADO";                    // 45%
};

export const resolverEstado = (estadoActual) => {
    if (estadoActual !== "EN PROCESO") return estadoActual;
    const rnd = Math.random();
    if (rnd < 0.01) return "RECHAZADO"; // 1%
    return "ACEPTADO";                   // 99%
};