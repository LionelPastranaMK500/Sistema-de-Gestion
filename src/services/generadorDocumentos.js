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
        if (precio < 100 || precio > 1000) {
            precio = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
        }
        return { ...item, cantidad: 1, unidad: "UND", precio };
    });
};

export const calcularMonto = (tipoDocumento, totalItems) => {
    switch (tipoDocumento) {
        case "Nota de Credito":
            return -Math.round(totalItems * 0.5);
        case "Guia de Remision":
            return 10;
        default:
            return totalItems;
    }
};

export const generarEstado = () => {
    const rnd = Math.random();
    if (rnd < 0.01) return "RECHAZADO";      // 1%
    if (rnd < 0.89) return "EN PROCESO";    // 89%
    return "ACEPTADO";                      // 90%
};