import {
    elegirAleatorio,
    generarRuc,
    generarDni,
    generarItemsAleatorios,
    calcularMonto,
    generarEstado
} from "./generadorDocumentos";
import { getActiveCompany } from "@services/auth/authServices";

export const tiposComprobante = [
    "Factura Electronica",
    "Boleta de Venta Electronica",
    "Nota de Credito",
    "Nota de Debito",
    "Proforma",
    "Guia de Remision"
];

export const mapTipo = {
    "Factura Electronica": "Factura",
    "Boleta de Venta Electronica": "Boleta",
    "Nota de Credito": "NotaCredito",
    "Nota de Debito": "NotaDebito",
    "Proforma": "Proforma",
    "Guia de Remision": "Guia"
};

export const series = {
    "20123456789": {
        "Factura": ["F001", "F002"],
        "Boleta": ["B001", "B002"],
        "Proforma": ["P001"],
        "Guia": ["T001"],
        "NotaCredito": ["NC01"],
        "NotaDebito": ["ND01"]
    },
    "20234567890": {
        "Factura": ["F101"],
        "Boleta": ["B101"]
    }
};

export const clientes = [
    { razonSocial: "NORSET SL", direccion: "Av. Los Olivos 12453, Lima" },
    { razonSocial: "Talleres Pérez E.I.R.L.", direccion: "Calle San Martín 45, Lima" },
    { razonSocial: "Auto Partes García S.A.", direccion: "Jr. Arequipa 567, Lima" },
    { razonSocial: "Servicios de Transporte Torres S.A.C.", direccion: "Av. Javier Prado 890, Lima" },
    { razonSocial: "Lubricantes Fernández S.A.", direccion: "Calle Bolívar 234, Lima" },
    { razonSocial: "Distribuciones Díaz E.I.R.L.", direccion: "Av. La Marina 678, Lima" },
    { razonSocial: "Motors Ramírez S.A.", direccion: "Jr. Tacna 101, Lima" },
    { razonSocial: "MISDUS SL", direccion: "Av. Grau 345, Lima" },
    { razonSocial: "WESIZE SA", direccion: "Calle Pardo 22, Lima" },
    { razonSocial: "Jorge Herrera S.A.C.", direccion: "Av. Arequipa 19, Lima" }
];

export const productos = [
    { codigo: "001", descripcion: "Filtro de aire", precio: 150 },
    { codigo: "002", descripcion: "Aceite Shell Helix 10W40", precio: 162 },
    { codigo: "4003", descripcion: "Pastillas de freno", precio: 120 },
    { codigo: "004", descripcion: "Neumático Michelin 16''", precio: 135 },
    { codigo: "7005", descripcion: "Batería Bosch 12V", precio: 148 },
    { codigo: "006", descripcion: "Kit de embrague Toyota Hilux", precio: 125 },
    { codigo: "007", descripcion: "Aceite Castrol Magnatec 5W30 4L", precio: 110 },
    { codigo: "008", descripcion: "Filtro de aceite", precio: 180 },
    { codigo: "009", descripcion: "Amortiguador delantero Toyota Corolla", precio: 42 },
    { codigo: "010", descripcion: "Radiador Nissan Sentra", precio: 168 },
    { codigo: "011", descripcion: "Disco de freno Hyundai Accent", precio: 130 },
    { codigo: "1012", descripcion: "Alternador Chevrolet Aveo", precio: 195 },
    { codigo: "013", descripcion: "Correa de distribución Kia Rio", precio: 27 },
    { codigo: "014", descripcion: "Luz LED H4 alta/baja", precio: 109 },
    { codigo: "015", descripcion: "Espejo retrovisor lateral derecho", precio: 120 },
    { codigo: "016", descripcion: "Parachoques delantero Toyota Yaris", precio: 75 },
    { codigo: "4017", descripcion: "Juego de bujías NGK x4", precio: 149 },
    { codigo: "018", descripcion: "Sensor de oxígeno Honda Civic", precio: 359 },
    { codigo: "019", descripcion: "Aceite Valvoline SynPower 5W40 4L", precio: 169 },
    { codigo: "6020", descripcion: "Balatas traseras Nissan Versa", precio: 229 }
];

export const getTiposComprobante = () => tiposComprobante;
export const getSeries = (tipo) => {
    const company = getActiveCompany();
    return series[company?.ruc]?.[tipo] || ["BB004"];
};
export const getClientes = () => clientes;
export const getProductos = () => productos;

export const generarDataFalsa = (cantidad = 1000) => {
    const data = [];
    const counters = [];
    const start = new Date(2024, 5, 1);
    const end = new Date(2025, 8, 10);
    const dias = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dias.push(new Date(d));
    }
    let idCounter = 1;
    dias.forEach(fecha => {
        for (let i = 0; i < cantidad; i++) {
            const tDocumento = elegirAleatorio(getTiposComprobante());
            const claveTipo = mapTipo[tDocumento];
            const seriesDisponibles = getSeries(claveTipo);
            const serie = seriesDisponibles.length > 0 ? elegirAleatorio(seriesDisponibles) : "XX01";
            if (!counters[serie]) counters[serie] = 0;
            counters[serie]++;
            const numero = counters[serie].toString().padStart(6, "0");

            const items = generarItemsAleatorios(getProductos());
            const totalItems = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
            const monto = calcularMonto(tDocumento, totalItems);
            const clienteElegido = elegirAleatorio(getClientes());
            const tipoOperacion = Math.random() < 0.5 ? "venta" : "compra";

            const isRuc = Math.random() < 0.6;
            const documento = isRuc ? generarRuc() : generarDni();

            data.push({
                id: idCounter,
                serie,
                numero,
                cliente: clienteElegido.razonSocial,
                documento,
                fecha: fecha.toISOString(),
                direccion: clienteElegido.direccion,
                monto,
                tDocumento,
                state: generarEstado(),
                items,
                tipoOperacion
            });
        }
    })

    return data;
};

