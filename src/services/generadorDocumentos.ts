// Helper genérico para elegir un elemento aleatorio de un array
export const elegirAleatorio = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const generarFechaAleatoria = (start: Date, end: Date): Date => {
  const startMs = start.getTime();
  const endMs = end.getTime();
  const fecha = new Date(startMs + Math.random() * (endMs - startMs));
  fecha.setHours(Math.floor(Math.random() * 24));
  fecha.setMinutes(Math.floor(Math.random() * 60));
  fecha.setSeconds(Math.floor(Math.random() * 60));
  return fecha;
};

export const generarRuc = (): string => {
  const prefijo = Math.random() < 0.5 ? "10" : "20";
  const resto = Math.floor(Math.random() * 1_000_000_000)
    .toString()
    .padStart(9, "0");
  return prefijo + resto;
};

export const generarDni = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Definimos qué necesita tener un item para ser usado en la generación
interface CatalogoItem {
  precio?: number;
  [key: string]: any; // Permite otras propiedades
}

export const generarItemsAleatorios = <T extends CatalogoItem>(
  catalogo: T[],
  maxItems: number = 2
) => {
  const cantidad = Math.floor(Math.random() * maxItems) + 1;
  return Array.from({ length: cantidad }, () => {
    const item = elegirAleatorio(catalogo);
    let precio = item.precio || 0;

    // Lógica para evitar precios irreales o cero
    if (precio < 20 || precio > 200) {
      precio = Math.floor(Math.random() * (200 - 20 + 1)) + 20;
    }

    // Retornamos el item enriquecido con cantidad, unidad y precio asegurado
    return { ...item, cantidad: 1, unidad: "UND", precio };
  });
};

// Interfaz para los items que se usan en el cálculo de monto
interface ItemCompra {
  precio: number;
  cantidad: number;
  afectoISC?: boolean;
  [key: string]: any;
}

export const calcularMonto = (tipoDocumento: string, items: ItemCompra[]) => {
  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const igv = subtotal * 0.18;
  const isc = items.some((i) => i.afectoISC) ? subtotal * 0.1 : 0;
  const total = subtotal + igv + isc;

  const round = (n: number) => Number(n.toFixed(2));

  const base = {
    gravado: round(subtotal),
    exonerado: 0,
    inafecto: 0,
    igv: round(igv),
    isc: round(isc),
    total: round(total),
  };

  switch (tipoDocumento) {
    case "NOTA DE CRÉDITO ELECTRÓNICA":
      // Invierte los signos para notas de crédito
      return Object.fromEntries(
        Object.entries(base).map(([k, v]) => [k, round(-v)])
      );

    case "GUÍA DE REMISIÓN REMITENTE ELECTRÓNICA":
      return {
        gravado: 0,
        exonerado: 0,
        inafecto: 0,
        igv: 0,
        isc: 0,
        total: 0,
      };

    default:
      return base;
  }
};

export const generarEstado = (tipoDocumento: string): string => {
  if (tipoDocumento === "NOTA DE CRÉDITO ELECTRÓNICA") return "ANULADO";

  const rnd = Math.random();
  if (rnd < 0.01) return "RECHAZADO"; // 1%
  if (rnd < 0.55) return "EN PROCESO"; // 54%
  return "ACEPTADO"; // 45%
};

export const resolverEstado = (estadoActual: string): string => {
  if (estadoActual !== "EN PROCESO") return estadoActual;
  const rnd = Math.random();
  if (rnd < 0.01) return "RECHAZADO"; // 1%
  return "ACEPTADO"; // 99%
};
