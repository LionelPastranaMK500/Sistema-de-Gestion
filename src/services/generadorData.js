import {
    elegirAleatorio,
    generarRuc,
    generarDni,
    generarItemsAleatorios,
    calcularMonto,
    generarEstado,
    resolverEstado
} from "./generadorDocumentos";
import { getActiveCompany, getActiveUser, syncActiveCompany } from "@services/auth/authServices";

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

export const clientes = [
    { nombre: 'Juan Carlos Pérez López', direccion: 'Av. Arequipa 1234, Lima', tipo: 'Cliente', documentoTipo: 'DNI', documento: '74581234', email: 'juan.perez@gmail.com' },
    { nombre: 'María Fernanda Torres Ruiz', direccion: 'Jr. Lampa 234, Lima', tipo: 'Cliente', documentoTipo: 'DNI', documento: '75692345', email: 'maria.torres@hotmail.com' },
    { nombre: 'Luis Alberto Ramírez Gómez', direccion: 'Av. Grau 567, Trujillo', tipo: 'Cliente', documentoTipo: 'DNI', documento: '76893456', email: 'luis.ramirez@yahoo.com' },
    { nombre: 'Ana Sofía Castillo Vega', direccion: 'Calle Huallaga 890, Cusco', tipo: 'Cliente', documentoTipo: 'DNI', documento: '78904567', email: 'ana.castillo@gmail.com' },
    { nombre: 'Carlos Enrique Mendoza Salazar', direccion: 'Av. Perú 321, Piura', tipo: 'Cliente', documentoTipo: 'DNI', documento: '79015678', email: 'carlos.mendoza@gmail.com' },
    { nombre: 'Lucía Gabriela Herrera Chávez', direccion: 'Av. Tacna 456, Arequipa', tipo: 'Cliente', documentoTipo: 'DNI', documento: '70126789', email: 'lucia.herrera@hotmail.com' },
    { nombre: 'Pedro Antonio Vargas León', direccion: 'Calle Bolívar 678, Lima', tipo: 'Cliente', documentoTipo: 'DNI', documento: '71237890', email: 'pedro.vargas@yahoo.com' },
    { nombre: 'Rosa Elena Gutiérrez Paredes', direccion: 'Jr. Amazonas 345, Chiclayo', tipo: 'Cliente', documentoTipo: 'DNI', documento: '72348901', email: 'rosa.gutierrez@gmail.com' },
    { nombre: 'Miguel Ángel Flores Sánchez', direccion: 'Av. La Marina 789, Callao', tipo: 'Cliente', documentoTipo: 'DNI', documento: '73459012', email: 'miguel.flores@gmail.com' },
    { nombre: 'Patricia Alejandra Díaz Campos', direccion: 'Calle Los Olivos 123, Lima', tipo: 'Cliente', documentoTipo: 'DNI', documento: '74560123', email: 'patricia.diaz@gmail.com' },

    { razonSocial: 'Ferretería San José S.A.C.', direccion: 'Av. Colonial 2345, Lima', tipo: 'Cliente', documentoTipo: 'RUC', documento: '20123456789', email: 'ventas@ferreteriasanjose.com' },
    { razonSocial: 'Constructora Andina E.I.R.L.', direccion: 'Jr. Puno 567, Cusco', tipo: 'Cliente', documentoTipo: 'RUC', documento: '20456789123', email: 'info@constructoraandina.com' },
    { razonSocial: 'Servicios Generales Torres S.R.L.', direccion: 'Av. Grau 890, Trujillo', tipo: 'Cliente', documentoTipo: 'RUC', documento: '20678912345', email: 'contacto@serviciostorres.com' },
    { razonSocial: 'Textiles del Sur S.A.', direccion: 'Calle Piura 321, Arequipa', tipo: 'Cliente', documentoTipo: 'RUC', documento: '20567891234', email: 'ventas@textilessur.com' },
    { razonSocial: 'Distribuidora Norte E.I.R.L.', direccion: 'Av. Túpac Amaru 123, Chiclayo', tipo: 'Cliente', documentoTipo: 'RUC', documento: '20987654321', email: 'info@distribuidoranorte.com' },
    { razonSocial: 'Comercial Santa Rosa S.A.C.', direccion: 'Jr. Amazonas 567, Piura', tipo: 'Cliente', documentoTipo: 'RUC', documento: '20111222333', email: 'contacto@santarosa.com' },
    { razonSocial: 'Agroexportaciones del Perú S.A.', direccion: 'Av. Agricultura 456, Ica', tipo: 'Cliente', documentoTipo: 'RUC', documento: '20222333444', email: 'ventas@agroperu.com' },
    { razonSocial: 'Transporte Rápido S.R.L.', direccion: 'Av. Panamericana 789, Lima', tipo: 'Cliente', documentoTipo: 'RUC', documento: '20333444555', email: 'contacto@transporterapido.com' },
    { razonSocial: 'Lubricantes Premium del Perú S.A.', direccion: 'Av. República 101, Lima', tipo: 'Cliente', documentoTipo: 'RUC', documento: '20444555666', email: 'info@lubricantespremium.com' },
    { razonSocial: 'Tecnologías Innovadoras S.A.C.', direccion: 'Av. Javier Prado 876, Lima', tipo: 'Cliente', documentoTipo: 'RUC', documento: '20555666777', email: 'ventas@tecnologiasinnovadoras.com' },

    { nombre: 'John Carter', direccion: 'Av. Venezuela 123, Lima', tipo: 'Cliente', documentoTipo: 'CARNET DE EXTRANJERÍA', documento: 'CEE00001', email: 'john.carter@correo.com' },
    { nombre: 'Mary White', direccion: 'Calle Amazonas 456, Lima', tipo: 'Cliente', documentoTipo: 'CARNET DE EXTRANJERÍA', documento: 'CEE00002', email: 'mary.white@correo.com' },
    { nombre: 'David Miller', direccion: 'Av. Brasil 789, Callao', tipo: 'Cliente', documentoTipo: 'CARNET DE EXTRANJERÍA', documento: 'CEE00003', email: 'david.miller@correo.com' },
    { nombre: 'Sophia Johnson', direccion: 'Av. La Marina 890, Lima', tipo: 'Cliente', documentoTipo: 'CARNET DE EXTRANJERÍA', documento: 'CEE00004', email: 'sophia.johnson@correo.com' },
    { nombre: 'Michael Anderson', direccion: 'Jr. Junín 234, Cusco', tipo: 'Cliente', documentoTipo: 'CARNET DE EXTRANJERÍA', documento: 'CEE00005', email: 'michael.anderson@correo.com' },
    { nombre: 'Emily Davis', direccion: 'Av. Grau 567, Trujillo', tipo: 'Cliente', documentoTipo: 'CARNET DE EXTRANJERÍA', documento: 'CEE00006', email: 'emily.davis@correo.com' },
    { nombre: 'Daniel Martinez', direccion: 'Calle Bolívar 123, Lima', tipo: 'Cliente', documentoTipo: 'CARNET DE EXTRANJERÍA', documento: 'CEE00007', email: 'daniel.martinez@correo.com' },
    { nombre: 'Olivia Thompson', direccion: 'Av. Arequipa 678, Lima', tipo: 'Cliente', documentoTipo: 'CARNET DE EXTRANJERÍA', documento: 'CEE00008', email: 'olivia.thompson@correo.com' },
    { nombre: 'James Wilson', direccion: 'Calle Puno 234, Arequipa', tipo: 'Cliente', documentoTipo: 'CARNET DE EXTRANJERÍA', documento: 'CEE00009', email: 'james.wilson@correo.com' },
    { nombre: 'Isabella Brown', direccion: 'Av. Tacna 876, Lima', tipo: 'Cliente', documentoTipo: 'CARNET DE EXTRANJERÍA', documento: 'CEE00010', email: 'isabella.brown@correo.com' },

    { nombre: 'Robert Johnson', direccion: 'Av. Pardo 123, Lima', tipo: 'Cliente', documentoTipo: 'PASAPORTE', documento: 'P1234567', email: 'robert.johnson@correo.com' },
    { nombre: 'Emma Williams', direccion: 'Calle San Martín 234, Lima', tipo: 'Cliente', documentoTipo: 'PASAPORTE', documento: 'P2345678', email: 'emma.williams@correo.com' },
    { nombre: 'William Harris', direccion: 'Av. La Paz 567, Cusco', tipo: 'Cliente', documentoTipo: 'PASAPORTE', documento: 'P3456789', email: 'william.harris@correo.com' },
    { nombre: 'Sophia Martinez', direccion: 'Jr. Grau 890, Trujillo', tipo: 'Cliente', documentoTipo: 'PASAPORTE', documento: 'P4567890', email: 'sophia.martinez@correo.com' },
    { nombre: 'David Robinson', direccion: 'Av. Libertad 321, Arequipa', tipo: 'Cliente', documentoTipo: 'PASAPORTE', documento: 'P5678901', email: 'david.robinson@correo.com' },
    { nombre: 'Olivia Garcia', direccion: 'Calle Amazonas 456, Piura', tipo: 'Cliente', documentoTipo: 'PASAPORTE', documento: 'P6789012', email: 'olivia.garcia@correo.com' },
    { nombre: 'James Thompson', direccion: 'Av. Industrial 789, Callao', tipo: 'Cliente', documentoTipo: 'PASAPORTE', documento: 'P7890123', email: 'james.thompson@correo.com' },
    { nombre: 'Isabella Clark', direccion: 'Calle Bolívar 123, Lima', tipo: 'Cliente', documentoTipo: 'PASAPORTE', documento: 'P8901234', email: 'isabella.clark@correo.com' },
    { nombre: 'Michael Lewis', direccion: 'Av. Miraflores 567, Lima', tipo: 'Cliente', documentoTipo: 'PASAPORTE', documento: 'P9012345', email: 'michael.lewis@correo.com' },
    { nombre: 'Charlotte Walker', direccion: 'Calle Las Flores 890, Lima', tipo: 'Cliente', documentoTipo: 'PASAPORTE', documento: 'P0123456', email: 'charlotte.walker@correo.com' },

    { razonSocial: 'Global Trade Inc.', direccion: '123 Wall Street, New York, USA', tipo: 'Cliente', documentoTipo: 'NO DOMICILIADO, SIN RUC(EXPORTACIÓN)', documento: 'EXT00001', email: 'contact@globaltrade.com' },
    { razonSocial: 'EuroExport GmbH', direccion: 'Berliner Str. 45, Berlin, Alemania', tipo: 'Cliente', documentoTipo: 'NO DOMICILIADO, SIN RUC(EXPORTACIÓN)', documento: 'EXT00002', email: 'info@euroexport.de' },
    { razonSocial: 'Asia Pacific Exports', direccion: 'Tokyo Central 101, Japón', tipo: 'Cliente', documentoTipo: 'NO DOMICILIADO, SIN RUC(EXPORTACIÓN)', documento: 'EXT00003', email: 'sales@apexports.jp' },
    { razonSocial: 'Latam Overseas Ltd.', direccion: 'Av. Paulista 2020, São Paulo, Brasil', tipo: 'Cliente', documentoTipo: 'NO DOMICILIADO, SIN RUC(EXPORTACIÓN)', documento: 'EXT00004', email: 'latam@overseasltd.com' },
    { razonSocial: 'Andes Exportaciones', direccion: 'Av. 9 de Julio 350, Buenos Aires, Argentina', tipo: 'Cliente', documentoTipo: 'NO DOMICILIADO, SIN RUC(EXPORTACIÓN)', documento: 'EXT00005', email: 'ventas@andesexport.com' },
    { razonSocial: 'Africa Trade Co.', direccion: 'Nairobi Business Center, Kenia', tipo: 'Cliente', documentoTipo: 'NO DOMICILIADO, SIN RUC(EXPORTACIÓN)', documento: 'EXT00006', email: 'info@africatrade.com' },
    { razonSocial: 'Oceania Imports', direccion: 'Sydney Harbour 55, Australia', tipo: 'Cliente', documentoTipo: 'NO DOMICILIADO, SIN RUC(EXPORTACIÓN)', documento: 'EXT00007', email: 'sales@oceaniaimports.com' },
    { razonSocial: 'Europa Global S.L.', direccion: 'Calle Mayor 11, Madrid, España', tipo: 'Cliente', documentoTipo: 'NO DOMICILIADO, SIN RUC(EXPORTACIÓN)', documento: 'EXT00008', email: 'contacto@europaglobal.es' },
    { razonSocial: 'North America Export', direccion: 'Toronto Business Tower, Canadá', tipo: 'Cliente', documentoTipo: 'NO DOMICILIADO, SIN RUC(EXPORTACIÓN)', documento: 'EXT00009', email: 'na.export@canada.com' },
    { razonSocial: 'Asian Imports LLC', direccion: 'Shanghai Tower, China', tipo: 'Cliente', documentoTipo: 'NO DOMICILIADO, SIN RUC(EXPORTACIÓN)', documento: 'EXT00010', email: 'support@asianimports.cn' }
];

export const guia_remision = [];

export const productos = [
    { codigo: '001', unidad: 'UND', descripcion: 'Filtro de aire', precio: 150, isc: 0 },
    { codigo: '002', unidad: 'UND', descripcion: 'Aceite Shell Helix 10W40', precio: 162, isc: 0.10 * 162 },
    { codigo: '4003', unidad: 'UND', descripcion: 'Pastillas de freno', precio: 120, isc: 0 },
    { codigo: '004', unidad: 'UND', descripcion: 'Neumático Michelin 16"', precio: 135, isc: 0 },
    { codigo: '7005', unidad: 'UND', descripcion: 'Batería Bosch 12V', precio: 148, isc: 0 },
    { codigo: '006', unidad: 'UND', descripcion: 'Kit de embrague Toyota Hilux', precio: 125, isc: 0 },
    { codigo: '007', unidad: 'UND', descripcion: 'Aceite Castrol Magnatec 5W30 4L', precio: 110, isc: 0.10 * 110 },
    { codigo: '008', unidad: 'UND', descripcion: 'Filtro de aceite', precio: 180, isc: 0 },
    { codigo: '009', unidad: 'UND', descripcion: 'Amortiguador delantero Toyota Corolla', precio: 42, isc: 0 },
    { codigo: '010', unidad: 'UND', descripcion: 'Radiador Nissan Sentra', precio: 168, isc: 0 },
    { codigo: '011', unidad: 'UND', descripcion: 'Disco de freno Hyundai Accent', precio: 130, isc: 0 },
    { codigo: '1012', unidad: 'UND', descripcion: 'Alternador Chevrolet Aveo', precio: 195, isc: 0 },
    { codigo: '013', unidad: 'UND', descripcion: 'Correa de distribución Kia Rio', precio: 27, isc: 0 },
    { codigo: '014', unidad: 'UND', descripcion: 'Luz LED H4 alta/baja', precio: 109, isc: 0 },
    { codigo: '015', unidad: 'UND', descripcion: 'Espejo retrovisor lateral derecho', precio: 120, isc: 0 },
    { codigo: '016', unidad: 'UND', descripcion: 'Parachoques delantero Toyota Yaris', precio: 75, isc: 0 },
    { codigo: '4017', unidad: 'UND', descripcion: 'Juego de bujías NGK x4', precio: 149, isc: 0 },
    { codigo: '018', unidad: 'UND', descripcion: 'Sensor de oxígeno Honda Civic', precio: 359, isc: 0 },
    { codigo: '019', unidad: 'UND', descripcion: 'Aceite Valvoline SynPower 5W40 4L', precio: 169, isc: 0.10 * 169 },
    { codigo: '6020', unidad: 'UND', descripcion: 'Balatas traseras Nissan Versa', precio: 229, isc: 0 },
    { codigo: '021', unidad: 'GAL', descripcion: 'Aceite sintético Mobil 1 5W30', precio: 200, isc: 0.10 * 200 },
    { codigo: '022', unidad: 'UND', descripcion: 'Filtro de combustible Bosch', precio: 80, isc: 0 },
    { codigo: '023', unidad: 'UND', descripcion: 'Bujías Iridium NGK', precio: 50, isc: 0 },
    { codigo: '024', unidad: 'LIT', descripcion: 'Lubricante industrial Total', precio: 300, isc: 0.10 * 300 },
    { codigo: '025', unidad: 'UND', descripcion: 'Kit de transmisión Chevron', precio: 450, isc: 0 },
    { codigo: '026', unidad: 'GAL', descripcion: 'Aceite hidráulico Petroperu', precio: 250, isc: 0.10 * 250 },
    { codigo: '027', unidad: 'UND', descripcion: 'Filtro de aire K&N', precio: 120, isc: 0 },
    { codigo: '028', unidad: 'LIT', descripcion: 'Grasa lubricante Repsol', precio: 100, isc: 0.10 * 100 },
    { codigo: '029', unidad: 'UND', descripcion: 'Pastillas de freno Brembo', precio: 180, isc: 0 },
    { codigo: '030', unidad: 'GAL', descripcion: 'Aceite motor Petromin', precio: 220, isc: 0.10 * 220 },
    { codigo: '031', unidad: 'LIT', descripcion: 'Aceite para motor diésel Rimac', precio: 180, isc: 0.10 * 180 },
    { codigo: '032', unidad: 'UND', descripcion: 'Filtro hidráulico Caterpillar', precio: 95, isc: 0 },
    { codigo: '033', unidad: 'GAL', descripcion: 'Lubricante sintético Petroperú Super', precio: 210, isc: 0.10 * 210 },
    { codigo: '034', unidad: 'LIT', descripcion: 'Grasa multiuso Lubrimax', precio: 80, isc: 0.10 * 80 },
    { codigo: '035', unidad: 'UND', descripcion: 'Kit de sellos hidráulicos', precio: 150, isc: 0 },
    { codigo: '036', unidad: 'GAL', descripcion: 'Aceite transmision automatica Mobil', precio: 190, isc: 0.10 * 190 },
    { codigo: '037', unidad: 'UND', descripcion: 'Bomba de lubricación manual', precio: 300, isc: 0 },
    { codigo: '038', unidad: 'LIT', descripcion: 'Aditivo para combustible Bardahl', precio: 50, isc: 0.10 * 50 },
    { codigo: '039', unidad: 'GAL', descripcion: 'Aceite para compresores Ingersoll', precio: 280, isc: 0.10 * 280 },
    { codigo: '040', unidad: 'UND', descripcion: 'Sistema de lubricación automática', precio: 500, isc: 0 },
];

// Añadimos una lista de usuarios ficticios
export const usuarios = [
    {
        nombres: "Juan",
        apellidoPaterno: "Santos",
        apellidoMaterno: "Pimentel",
        correo: "manuel.santosp58@hotmail.com",
        rol: "ADMINISTRADOR"
    },
    {
        nombres: "Maria",
        apellidoPaterno: "Lopez",
        apellidoMaterno: "Garcia",
        correo: "maria.lopez@example.com",
        rol: "VENDEDOR"
    },
    {
        nombres: "Carlos",
        apellidoPaterno: "Gomez",
        apellidoMaterno: "Fernandez",
        correo: "carlos.gomez@example.com",
        rol: "VENDEDOR"
    },
    {
        nombres: "Ana",
        apellidoPaterno: "Martinez",
        apellidoMaterno: "Rodriguez",
        correo: "ana.martinez@example.com",
        rol: "CONTADOR"
    }
];

export const sucursalesData = [
    {
        id: "SC001",
        nombre: "LUBRICANTES CLAUDIA (Principal)",
        direccion: "Av. Alfredo Mendiola 6376",
        vendedores: [], // Array de emails de vendedores
        almacenes: ["LUBRICANTES CLAUDIA"],
        isPrincipal: true,
        numeracion: [
            { tipo: "FACTURA ELECTRÓNICA", serie: "FF01", inicial: 1 },
            { tipo: "BOLETA DE VENTA ELECTRÓNICA", serie: "BB01", inicial: 1 },
            { tipo: "GUÍA DE REMISIÓN REMITENTE ELECTRÓNICA", serie: "T001", inicial: 1 },
            { tipo: "PROFORMA", serie: "P001", inicial: 1 },
        ]
    },
    {
        id: "SC002",
        nombre: "SUCURSAL (Secundaria)",
        direccion: "Calle Los Olivos 123",
        vendedores: ["maria.lopez@example.com"],
        almacenes: ["SUCURSAL"],
        isPrincipal: false,
        numeracion: [
            { tipo: "FACTURA ELECTRÓNICA", serie: "FF04", inicial: 1 },
            { tipo: "BOLETA DE VENTA ELECTRÓNICA", serie: "BB04", inicial: 1 },
            { tipo: "NOTA DE CRÉDITO ELECTRÓNICA", serie: "FC04", inicial: 1 },
            { tipo: "NOTA DE DÉBITO ELECTRÓNICA", serie: "FD04", inicial: 1 },
            { tipo: "NOTA DE DÉBITO ELECTRÓNICA", serie: "BD04", inicial: 1 },
            { tipo: "GUÍA DE REMISIÓN REMITENTE ELECTRÓNICA", serie: "T004", inicial: 1 },
            { tipo: "PROFORMA", serie: "0004", inicial: 1 },
        ]
    },
];

export const almacenesData = [
    {
        id: "ALM001",
        nombre: "LUBRICANTES CLAUDIA",
        direccion: "-", // Coincide con la imagen de referencia
        isPrincipal: true,
    },
    {
        id: "ALM002",
        nombre: "SUCURSAL",
        direccion: "-", // Coincide con la imagen de referencia
        isPrincipal: false,
    },
];

// --- FIN NUEVO ---

export const getTiposComprobante = () => tiposComprobante;
export const getSeries = (tipo) => {
    const company = getActiveCompany();
    return series[company?.ruc]?.[tipo] || DEFAULT_FALLBACK;
};
export const getClientes = () => clientes;
export const getProductos = () => productos;
export const getUsuarios = () => usuarios;
export const getSucursales = () => sucursalesData;
export const getAlmacenes = () => almacenesData;

export const generarDataFalsa = (cantidad = 100, fechaBase = new Date()) => {
    const data = [];
    const counters = [];

    const today = new Date();
    const year = fechaBase.getFullYear();
    const mesReferencia = fechaBase.getMonth();

    const start = new Date(year, mesReferencia, 1);
    const end = new Date(year, mesReferencia + 1, 0); // Fin del mes

    const dias = [];
    for (let d = new Date(start); d <= end && d <= today; d.setDate(d.getDate() + 1)) {
        dias.push(new Date(d));
    }

    let idCounter = 1;
    const empresa = syncActiveCompany() || getActiveCompany() || { sucursal: "Lubricantes Claudia", ruc: "20123456789" };
    const usuarioActivo = getActiveUser() || { correo: "juan@example.com", nombre: "Juan Santos" };
    console.log(empresa);
    console.log(usuarioActivo);

    dias.forEach((fecha) => {
        for (let i = 0; i < cantidad / dias.length; i++) {
            const tDocumento = elegirAleatorio(getTiposComprobante());
            const claveTipo = mapTipo[tDocumento];
            const seriesDisponibles = getSeries(claveTipo);
            const serie = seriesDisponibles.length > 0 ? elegirAleatorio(seriesDisponibles) : DEFAULT_SERIE;

            if (!counters[serie]) counters[serie] = 0;
            counters[serie]++;
            const numero = counters[serie].toString().padStart(6, "0");

            const clienteElegido = elegirAleatorio(getClientes());
            const esEmpresa = clienteElegido.documentoTipo === "RUC";
            
            const documentoTipo = clienteElegido.documentoTipo || (esEmpresa ? "RUC" : "DNI");
            const documento = clienteElegido.documento || (documentoTipo === "RUC" ? generarRuc() : generarDni());

            const items = generarItemsAleatorios(getProductos());
            const montoBase = calcularMonto(tDocumento, items);

            const monto = tDocumento === "NOTA DE CRÉDITO ELECTRÓNICA" ? { ...montoBase, total: -Math.abs(montoBase.total) } : montoBase;

            let state = generarEstado(tDocumento);
            state = resolverEstado(state);

            const tipoOperacion = i % 2 === 0 ? "venta" : "compra";

            data.push({
                id: idCounter++,
                serie,
                numero,
                cliente: esEmpresa
                    ? clienteElegido.razonSocial
                    : clienteElegido.nombre || "PÚBLICO EN GENERAL (S/D)",
                documentoTipo,
                documento,
                direccion: clienteElegido.direccion,
                email: clienteElegido.email,
                fecha: fecha.toISOString(),
                monto,
                tDocumento,
                state,
                items,
                tipoOperacion,
                sucursal: empresa.sucursal,
                usuario: usuarioActivo.correo
            });
        }
    });

    console.log(data);
    return data;
};


