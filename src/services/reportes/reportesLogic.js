import {
    generarDataFalsa,
    tiposComprobante,
    getClientes,
    mapTipo,
    getProductos
} from '../generadorData';
import { getActiveUser, getActiveCompany } from "@/services/auth/authServices";

export const handleReportes = (a, params = {}) => {
    let sheetsData = {};

    switch (a) {
        case "producto_listado": {
            const productos = getProductos();
            sheetsData = {
                Productos: [
                    ["Reporte de Productos"],
                    [],
                    ["Código", "Descripción", "Unidad de Medida", "Moneda", "Precio Unitario"],
                    ...productos.map(p => [
                        p.codigo || "-",
                        p.descripcion || "-",
                        p.unidadMedida || "UNIDADES",
                        p.moneda || "PEN",
                        (p.precio !== undefined ? p.precio.toFixed(2) : "0.00")
                    ])
                ]
            };
            break;
        }

        case "guia_remision":{
            
            break;
        }

        case "cliente_proveedor_listado": {
            const { type } = params;
            const clientes = getClientes();
            let filteredData = clientes;

            if (type === "dni") {
                filteredData = clientes.filter(c => c.documentoTipo === "DNI");
            } else if (type === "ruc") {
                filteredData = clientes.filter(c => c.documentoTipo === "RUC");
            } else if (type === "ce") {
                filteredData = clientes.filter(c => c.documentoTipo === "CARNET DE EXTRANJERÍA");
            } else if (type === "pasaportes") {
                filteredData = clientes.filter(c => c.documentoTipo === "PASAPORTE");
            } else if (type === "clientes") {
                filteredData = clientes.filter(c => c.documentoTipo === "NO DOMICILIADO, SIN RUC(EXPORTACIÓN)");
            } else if (type !== "all") {
                throw new Error("Tipo de documento no válido.");
            }

            //console.log(type,filteredData);

            if (filteredData.length === 0) {
                throw new Error("No se encontraron datos para el tipo de documento seleccionado.");
            }

            sheetsData = {
                [type === "all" ? "Todos los Tipos" : type === "clientes" ? "No Domiciliado, Sin RUC" : type]: [
                    [`LISTADO DE CLIENTES/PROVEEDORES`],
                    [],
                    ["Tipo", "Documento", "Nombre", "Email", "Teléfono", "Dirección", "Observaciones"],
                    ...filteredData.map(c => [
                        c.documentoTipo || "-",
                        c.documento || "-",
                        c.nombre || c.razonSocial || "-",
                        c.email || "-",
                        c.telefono || "-",
                        c.direccion || "-",
                        c.observaciones || "-"
                    ])
                ]
            };
            break;
        }

        case "venta_reporte": {
            const data = generarDataFalsa(50);
            const groupedData = {};
            tiposComprobante.forEach(tipo => {
                groupedData[tipo] = data.filter(item => item.tDocumento === tipo);
                if (groupedData[tipo].length === 0) {
                    groupedData[tipo] = generarDataFalsa(5).filter(item => item.tDocumento === tipo);
                }
            });

            Object.keys(groupedData).forEach(tipo => {
                const rows = [];
                rows.push([`REPORTE DE VENTAS: ${tipo.toUpperCase()}`]);
                rows.push([]);

                const headers = tipo.includes('NOTA DE CRÉDITO') || tipo.includes('NOTA DE DÉBITO')
                    ? [
                        "SERIE", "NÚMERO", "DOCUMENTO AFECTADO", "MOTIVO", "SUCURSAL", "CLIENTE DOC",
                        "CLIENTE NOMBRE", "FECHA DE EMISION", "FECHA DE VENCIMIENTO", "FECHA DE CREACION",
                        "USUARIO", "PLACA VEHICULO", "OBSERVACIONES", "OTROS", "MONEDA", "RC", "DESCUENTO",
                        "GRAVADO", "EXONERADO", "INAFECTO", "EXPORTACION", "GRATUITO", "IGV", "ISC",
                        "ICBPER", "TOTAL", "ANULADO", "ESTADO SUNAT"
                    ]
                    : [
                        "SERIE", "NÚMERO", "SUCURSAL", "CLIENTE DOC", "CLIENTE NOMBRE", "FECHA DE EMISION",
                        "FECHA DE VENCIMIENTO", "FECHA DE CREACION", "USUARIO", "PLACA VEHICULO",
                        "ORDEN DE COMPRA", "GUIAS DE REMISION", "COND. DE PAGO", "MET. DE PAGO",
                        "REFERENCIA", "CUOTAS", "OBSERVACIONES", "OTROS", "MONEDA", "DETRACCIÓN (PEN)",
                        "RETENCIÓN", "PERCEPCIÓN (PEN)", "RC", "DESCUENTO", "GRAVADO", "EXONERADO",
                        "INAFECTO", "EXPORTACION", "GRATUITO", "IGV", "ISC", "ICBPER", "TOTAL",
                        "ANULADO", "ESTADO SUNAT"
                    ];

                rows.push(headers);

                groupedData[tipo].forEach(item => {
                    const empresa = getActiveCompany();
                    const usuarioActivo = getActiveUser();
                    const row = tipo.includes('NOTA DE CRÉDITO') || tipo.includes('NOTA DE DÉBITO')
                        ? [
                            item.serie,
                            item.numero,
                            item.documentoAfectado || '-',
                            item.motivo || '-',
                            empresa?.sucursal || 'LUBRICANTES CLAUDIA',
                            item.documento,
                            item.cliente,
                            new Date(item.fecha).toLocaleDateString('es-ES'),
                            '-',
                            new Date(item.fecha).toLocaleString('es-ES'),
                            usuarioActivo?.nombre || 'Campo rellenado',
                            item.placaVehiculo || '-',
                            item.observaciones || '-',
                            '-',
                            'PEN',
                            item.monto.rc || 0,
                            item.monto.descuento || 0,
                            item.monto.gravado || 0,
                            item.monto.exonerado || 0,
                            item.monto.inafecto || 0,
                            0, 0,
                            item.monto.igv || 0,
                            item.monto.isc || 0,
                            0,
                            item.monto.total || 0,
                            item.state === 'ANULADO' ? 'SÍ' : 'NO',
                            `La ${mapTipo[tipo]} numero ${item.serie}-${item.numero}, ha sido ${item.state.toLowerCase()}`
                        ]
                        : [
                            item.serie,
                            item.numero,
                            empresa?.sucursal || 'LUBRICANTES CLAUDIA',
                            item.documento,
                            item.cliente,
                            new Date(item.fecha).toLocaleDateString('es-ES'),
                            '-',
                            new Date(item.fecha).toLocaleString('es-ES'),
                            usuarioActivo?.nombre || 'Campo rellenado',
                            item.placaVehiculo || '-',
                            '-', '-', 'CONTADO', 'EFECTIVO', '-', '-',
                            item.observaciones || '-',
                            '-',
                            'PEN',
                            0, 0, 0,
                            item.monto.rc || 0,
                            item.monto.descuento || 0,
                            item.monto.gravado || 0,
                            item.monto.exonerado || 0,
                            item.monto.inafecto || 0,
                            0, 0,
                            item.monto.igv || 0,
                            item.monto.isc || 0,
                            0,
                            item.monto.total || 0,
                            item.state === 'ANULADO' ? 'SÍ' : 'NO',
                            `La ${mapTipo[tipo]} numero ${item.serie}-${item.numero}, ha sido ${item.state.toLowerCase()}`
                        ];
                    rows.push(row);
                });
                sheetsData[tipo] = rows;
            });
            break;
        }
    }

    return sheetsData;
}
