import {
    elegirAleatorio,
    generarRuc,
    generarDni,
    generarItemsAleatorios,
    calcularMonto,
    generarEstado
} from "./generadorDocumentos";
import { getActiveCompany } from "@services/auth/authServices";

//variables predterminados
const DEFAULT_SERIE = "XX01";
const DEFAULT_FALLBACK = ["BB004"];

export const tiposComprobante = [
    "FACTURA ELECTRÓNICA",
    "BOLETA DE VENTA ELECTRÓNICA",
    "NOTA DE CRÉDITO ELECTRÓNICA",
    "NOTA DE DÉBITO ELECTRÓNICA",
    "PROFORMA ELECTRÓNICA",
    "GUÍA DE REMISIÓN REMITENTE ELECTRÓNICA"
];

export const mapTipo = {
    "FACTURA ELECTRÓNICA": "FACTURA",
    "BOLETA DE VENTA ELECTRÓNICA": "BOLETA DE VENTA",
    "NOTA DE CRÉDITO ELECTRÓNICA": "NOTA DE CRÉDITO",
    "NOTA DE DÉBITO ELECTRÓNICA": "NOTA DE DÉBITO",
    "PROFORMA ELECTRÓNICA": "PROFORMA",
    "GUÍA DE REMISIÓN REMITENTE ELECTRÓNICA": "GUÍA DE REMISIÓN REMITENTE"
};

export const keyMap = {
    "Facturas": "facturas",
    "Boletas de Venta": "boletas",
    "Notas de Crédito": "notasCredito",
    "Notas de Débito": "notasDebito",
    "Proformas": "proformas",
    "Guías de Remisión": "guiasRemision"
};

export const series = {
    "20123456789": {
        "FACTURA": ["F001", "F002"],
        "BOLETA DE VENTA": ["B001", "B002"],
        "PROFORMA": ["P001"],
        "GUÍA DE REMISIÓN REMITENTE": ["T001"],
        "NOTA DE CRÉDITO": ["NC01"],
        "NOTA DE DÉBITO": ["ND01"]
    },
    "20234567890": {
        "FACTURA": ["F101"],
        "BOLETA DE VENTA": ["B101"]
    }
};

export const condicionPago = {

}

export const clientes = [
    { razonSocial: "NORSET SL", direccion: "Av. Los Olivos 12453, Lima", nombre: "Carlos Noriega", tipo: "Cliente", documento: "20123456789", email: "carlos.n@norset.com" },
    { razonSocial: "Talleres Pérez E.I.R.L.", direccion: "Calle San Martín 45, Lima", nombre: "Luis Pérez", tipo: "Cliente", documento: "20567891234", email: "luis.p@talleresperez.com" },
    { razonSocial: "Auto Partes García S.A.", direccion: "Jr. Arequipa 567, Lima", nombre: "Ana García", tipo: "Proveedor", documento: "20456789123", email: "ana.g@autopartesgarcia.com" },
    { razonSocial: "Servicios de Transporte Torres S.A.C.", direccion: "Av. Javier Prado 890, Lima", nombre: "Miguel Torres", tipo: "Cliente", documento: "20345678912", email: "miguel.t@transportetorres.com" },
    { razonSocial: "Lubricantes Fernández S.A.", direccion: "Calle Bolívar 234, Lima", nombre: "Jorge Fernández", tipo: "Proveedor", documento: "20234567891", email: "jorge.f@lubricantesfernandez.com" },
    { razonSocial: "Distribuciones Díaz E.I.R.L.", direccion: "Av. La Marina 678, Lima", nombre: "María Díaz", tipo: "Cliente", documento: "20123456987", email: "maria.d@distribucionesdiaz.com" },
    { razonSocial: "Motors Ramírez S.A.", direccion: "Jr. Tacna 101, Lima", nombre: "Pedro Ramírez", tipo: "Proveedor", documento: "20567892341", email: "pedro.r@motorsramirez.com" },
    { razonSocial: "MISDUS SL", direccion: "Av. Grau 345, Lima", nombre: "Lucía Torres", tipo: "Cliente", documento: "20345678923", email: "lucia.t@misdus.com" },
    { razonSocial: "WESIZE SA", direccion: "Calle Pardo 22, Lima", nombre: "Fernando Silva", tipo: "Proveedor", documento: "20456789134", email: "fernando.s@wesize.com" },
    { razonSocial: "Jorge Herrera S.A.C.", direccion: "Av. Arequipa 19, Lima", nombre: "Jorge Herrera", tipo: "Cliente", documento: "20234567894", email: "jorge.h@jorgeherrera.com" }
];

export const productos = [
    { codigo: "001", unidad: "UND", descripcion: "Filtro de aire", precio: 150 },
    { codigo: "002", unidad: "UND", descripcion: "Aceite Shell Helix 10W40", precio: 162 },
    { codigo: "4003", unidad: "UND", descripcion: "Pastillas de freno", precio: 120 },
    { codigo: "004", unidad: "UND", descripcion: "Neumático Michelin 16''", precio: 135 },
    { codigo: "7005", unidad: "UND", descripcion: "Batería Bosch 12V", precio: 148 },
    { codigo: "006", unidad: "UND", descripcion: "Kit de embrague Toyota Hilux", precio: 125 },
    { codigo: "007", unidad: "UND", descripcion: "Aceite Castrol Magnatec 5W30 4L", precio: 110 },
    { codigo: "008", unidad: "UND", descripcion: "Filtro de aceite", precio: 180 },
    { codigo: "009", unidad: "UND", descripcion: "Amortiguador delantero Toyota Corolla", precio: 42 },
    { codigo: "010", unidad: "UND", descripcion: "Radiador Nissan Sentra", precio: 168 },
    { codigo: "011", unidad: "UND", descripcion: "Disco de freno Hyundai Accent", precio: 130 },
    { codigo: "1012", unidad: "UND", descripcion: "Alternador Chevrolet Aveo", precio: 195 },
    { codigo: "013", unidad: "UND", descripcion: "Correa de distribución Kia Rio", precio: 27 },
    { codigo: "014", unidad: "UND", descripcion: "Luz LED H4 alta/baja", precio: 109 },
    { codigo: "015", unidad: "UND", descripcion: "Espejo retrovisor lateral derecho", precio: 120 },
    { codigo: "016", unidad: "UND", descripcion: "Parachoques delantero Toyota Yaris", precio: 75 },
    { codigo: "4017", unidad: "UND", descripcion: "Juego de bujías NGK x4", precio: 149 },
    { codigo: "018", unidad: "UND", descripcion: "Sensor de oxígeno Honda Civic", precio: 359 },
    { codigo: "019", unidad: "UND", descripcion: "Aceite Valvoline SynPower 5W40 4L", precio: 169 },
    { codigo: "6020", unidad: "UND", descripcion: "Balatas traseras Nissan Versa", precio: 229 }
];



export const getTiposComprobante = () => tiposComprobante;
export const getSeries = (tipo) => {
    const company = getActiveCompany();
    return series[company?.ruc]?.[tipo] || DEFAULT_FALLBACK;
};
export const getClientes = () => clientes;
export const getProductos = () => productos;

export const generarDataFalsa = (cantidad = 5, fechaBase = new Date()) => {
    const data = [];
    const counters = [];

    const year = fechaBase.getFullYear();
    const mesReferencia = fechaBase.getMonth();
    const start = new Date(year, 0, 1);
    const end = new Date(year, mesReferencia + 1, 0);
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
            const serie = seriesDisponibles.length > 0 ? elegirAleatorio(seriesDisponibles) : DEFAULT_SERIE;
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

