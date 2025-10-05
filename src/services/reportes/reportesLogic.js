import {
    generarDataFalsa,
    tiposComprobante,
    getClientes,
    mapTipo,
    getProductos
} from '../generadorData';
import { getActiveUser, getActiveCompany } from "@services/auth/authServices";

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

        case "guia_remision": {
            const guiaData = []; //vacio
            const encabezadoRemitente = [
                "SERIE", "NUMERO", "SUCURSAL", "FECHA DE EMISION", "RECEPTOR DOC", "RECEPTOR NOMBRE",
                "FECHA DE ENVIO", "BULTOS", "PESO KG", "ORIGEN - UBIGEO", "ORIGEN - DIRECCIÓN",
                "DESTINO - UBIGEO", "DESTINO - DIRECCIÓN", "TRANSPORTISTA DOC", "TRANSPORTISTA NOMBRE",
                "CONDUCTORES", "VEHICULOS", "USUARIO", "OBSERVACIONES", "ESTADO SUNAT"
            ];

            const encabezadoTransportista = [
                "SERIE", "NUMERO", "SUCURSAL", "FECHA DE EMISION", "REMITENTE DOC", "REMITENTE NOMBRE",
                "DESTINATARIO DOC", "DESTINATARIO NOMBRE", "FECHA DE ENVIO", "PESO KG",
                "ORIGEN - UBIGEO", "ORIGEN - DIRECCIÓN", "DESTINO - UBIGEO", "DESTINO - DIRECCIÓN",
                "CONDUCTORES", "VEHICULOS", "USUARIO", "OBSERVACIONES", "ESTADO SUNAT"
            ];

            sheetsData = {
                "GUIAS DE REMISION - REMITENTE": [
                    ["REPORTE DE GUIAS DE REMISION - REMITENTE"],
                    [],
                    encabezadoRemitente,
                    ...guiaData.map(() => Array(encabezadoRemitente.length).fill(""))
                ],
                "GUIAS DE REMISION - TRANSPORTISTA": [
                    ["REPORTE DE GUIAS DE REMISION - TRANSPORTISTA"],
                    [],
                    encabezadoTransportista,
                    ...guiaData.map(() => Array(encabezadoTransportista.length).fill(""))
                ]
            };
            break;
        }

        case "cliente_proveedor_listado": {
            const { type = "all" } = params;
            const clientes = getClientes();

            const tipoMap = {
                dni: "DNI",
                ruc: "RUC",
                ce: "CARNET DE EXTRANJERÍA",
                pasaportes: "PASAPORTE",
                clientes: "NO DOMICILIADO, SIN RUC(EXPORTACIÓN)"
            };
            if (type !== "all" && !tipoMap[type]) {
                throw new Error("Tipo de documento no válido");
            }

            const filteredData = type === "all" ? clientes : clientes.filter(c => c.documentoTipo === tipoMap[type]);
            if (filteredData.length === 0) {
                throw new Error("No se encontraron datos para el tipo de documento seleccionado");
            }

            const sheetName =
                type === "all"
                    ? "Todos los Tipos"
                    : type === "clientes"
                        ? "No Domiciliado, Sin RUC"
                        : type.toUpperCase();

            sheetsData = {
                [sheetName]: [
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
            const { type, moneda, sucursal, usuario, cliente, fechaInicio, fechaFin } = params;
            const data = generarDataFalsa(200);
            const empresa = getActiveCompany() || { sucursal: "-" };
            const usuarioActivo = getActiveUser() || { correo: "-", nombre: "-" };

            const filteredData = data.filter((item) => {
                const fecha = new Date(item.fecha);
                const desde = new Date(`${fechaInicio}T00:00:00`);
                const hasta = new Date(`${fechaFin}T23:59:59`);

                const matchTipo = type === "all" || item.tDocumento.toLowerCase().includes(type.replace(/_/g, " "));
                const matchMoneda = moneda === "all" || item.monto?.moneda === moneda || "PEN";
                const matchSucursal = sucursal === "all" || (empresa.sucursal && empresa.sucursal === sucursal);
                const matchUsuario = usuario === "all" || usuarioActivo.correo === usuario;
                const matchCliente = cliente === "all" || item.cliente?.toLowerCase() === cliente.toLowerCase();
                const matchFecha = !isNaN(fecha) && fecha >= desde && fecha <= hasta;

                return matchTipo && matchMoneda && matchSucursal && matchUsuario && matchCliente && matchFecha;
            });

            const groupedData = {};
            tiposComprobante.forEach((tipo) => {
                const filtrado = filteredData.filter((item) => item.tDocumento === tipo);
                if (filtrado.length > 0) groupedData[tipo] = filtrado;
            });

            if (Object.keys(groupedData).length === 0) {
                throw new Error("No se encontraron datos para los filtros seleccionados.");
            }

            for (const tipo of Object.keys(groupedData)) {
                const rows = [];
                const isNota = tipo.includes("NOTA DE CRÉDITO") || tipo.includes("NOTA DE DÉBITO");

                rows.push([`REPORTE DE VENTAS: ${tipo.toUpperCase()}`]);
                rows.push([]);

                const headers = isNota
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

                groupedData[tipo].forEach((item) => {
                    const monto = item.monto || {};
                    const row = isNota
                        ? [
                            item.serie, item.numero, item.documentoAfectado || "-", item.motivo || "-",
                            empresa.sucursal || "Lubricantes Claudia", item.documento, item.cliente,
                            new Date(item.fecha).toLocaleDateString("es-ES"), "-",
                            new Date(item.fecha).toLocaleString("es-ES"), usuarioActivo.nombres || "-",
                            item.placaVehiculo || "-", item.observaciones || "-", "-", "PEN",
                            monto.rc || 0, monto.descuento || 0, monto.gravado || 0, monto.exonerado || 0,
                            monto.inafecto || 0, 0, 0, monto.igv || 0, monto.isc || 0, 0, monto.total || 0,
                            item.state === "ANULADO" ? "SÍ" : "NO",
                            `La ${mapTipo[tipo]} número ${item.serie}-${item.numero}, ha sido ${item.state.toLowerCase()}`
                        ]
                        : [
                            item.serie, item.numero, empresa.sucursal || "Lubricantes Claudia", item.documento,
                            item.cliente, new Date(item.fecha).toLocaleDateString("es-ES"), "-",
                            new Date(item.fecha).toLocaleString("es-ES"), usuarioActivo.nombres || "-",
                            item.placaVehiculo || "-", "-", "-", "CONTADO", "EFECTIVO", "-", "-",
                            item.observaciones || "-", "-", "PEN", 0, 0, 0, monto.rc || 0,
                            monto.descuento || 0, monto.gravado || 0, monto.exonerado || 0, monto.inafecto || 0,
                            0, 0, monto.igv || 0, monto.isc || 0, 0, monto.total || 0,
                            item.state === "ANULADO" ? "SÍ" : "NO",
                            `La ${mapTipo[tipo]} número ${item.serie}-${item.numero}, ha sido ${item.state.toLowerCase()}`
                        ];
                    rows.push(row);
                });

                const sum = (campo) => groupedData[tipo].reduce((acc, i) => acc + (Number(i.monto?.[campo]) || 0), 0);
                const totalRow = Array(headers.length).fill("");
                const totalGravado = sum("gravado");
                const totalExonerado = sum("exonerado");
                const totalIgv = sum("igv");
                const totalIsc = sum("isc");
                const total = sum("total");

                if (isNota) {
                    totalRow[14] = "TOTALES SOLES (S/.)";
                    totalRow[17] = totalGravado.toFixed(2);
                    totalRow[19] = totalExonerado.toFixed(2);
                    totalRow[22] = totalIgv.toFixed(2);
                    totalRow[23] = totalIsc.toFixed(2);
                    totalRow[25] = total.toFixed(2);
                } else {
                    totalRow[18] = "TOTAL SOLES (S/.)";
                    totalRow[24] = totalGravado.toFixed(2);
                    totalRow[26] = totalExonerado.toFixed(2);
                    totalRow[29] = totalIgv.toFixed(2);
                    totalRow[30] = totalIsc.toFixed(2);
                    totalRow[32] = total.toFixed(2);
                }

                rows.push(totalRow);
                sheetsData[tipo] = rows;
            }
            break;
        }

    }

    return sheetsData;
}
