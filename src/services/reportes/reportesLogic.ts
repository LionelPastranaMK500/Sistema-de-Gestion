import {
  generarDataFalsa,
  tiposComprobante,
  getClientes,
  getProductos,
  mapTipo,
} from "@/services/generadorData";
import { getActiveUser, getActiveCompany } from "@/services/auth/authServices";
import { Producto, VentaGenerada, Cliente } from "@/types/services";
import { AuthUser } from "@/types/services/auth";
import { ReporteParams, SheetsData } from "@/types/services/reportes";

export const handleReportes = async (
  action: string,
  params: ReporteParams = {}
): Promise<SheetsData> => {
  let sheetsData: SheetsData = {};

  switch (action) {
    case "producto_listado": {
      const productos: Producto[] = getProductos();
      sheetsData = {
        Productos: [
          ["Reporte de Productos"],
          [],
          [
            "Código",
            "Descripción",
            "Unidad de Medida",
            "Moneda",
            "Precio Unitario",
          ],
          ...productos.map((p) => [
            p.codigo || "-",
            p.descripcion || "-",
            p.unidadMedida || "UNIDADES",
            p.moneda || "PEN",
            p.precio !== undefined ? Number(p.precio).toFixed(2) : "0.00",
          ]),
        ],
      };
      break;
    }

    case "guia_remision": {
      const guiaData: any[] = []; // Se puede tipar mejor si existiera getGuias()

      const encabezadoRemitente = [
        "SERIE",
        "NUMERO",
        "SUCURSAL",
        "FECHA DE EMISION",
        "RECEPTOR DOC",
        "RECEPTOR NOMBRE",
        "FECHA DE ENVIO",
        "BULTOS",
        "PESO KG",
        "ORIGEN - UBIGEO",
        "ORIGEN - DIRECCIÓN",
        "DESTINO - UBIGEO",
        "DESTINO - DIRECCIÓN",
        "TRANSPORTISTA DOC",
        "TRANSPORTISTA NOMBRE",
        "CONDUCTORES",
        "VEHICULOS",
        "USUARIO",
        "OBSERVACIONES",
        "ESTADO SUNAT",
      ];

      const encabezadoTransportista = [
        "SERIE",
        "NUMERO",
        "SUCURSAL",
        "FECHA DE EMISION",
        "REMITENTE DOC",
        "REMITENTE NOMBRE",
        "DESTINATARIO DOC",
        "DESTINATARIO NOMBRE",
        "FECHA DE ENVIO",
        "PESO KG",
        "ORIGEN - UBIGEO",
        "ORIGEN - DIRECCIÓN",
        "DESTINO - UBIGEO",
        "DESTINO - DIRECCIÓN",
        "CONDUCTORES",
        "VEHICULOS",
        "USUARIO",
        "OBSERVACIONES",
        "ESTADO SUNAT",
      ];

      sheetsData = {
        "GUIAS DE REMISION - REMITENTE": [
          ["REPORTE DE GUIAS DE REMISION - REMITENTE"],
          [],
          encabezadoRemitente,
          ...guiaData.map(() => Array(encabezadoRemitente.length).fill("")),
        ],
        "GUIAS DE REMISION - TRANSPORTISTA": [
          ["REPORTE DE GUIAS DE REMISION - TRANSPORTISTA"],
          [],
          encabezadoTransportista,
          ...guiaData.map(() => Array(encabezadoTransportista.length).fill("")),
        ],
      };
      break;
    }

    case "cliente_proveedor_listado": {
      const { type = "all" } = params;
      const clientes: Cliente[] = getClientes();

      const tipoMap: Record<string, string> = {
        dni: "DNI",
        ruc: "RUC",
        ce: "CARNET DE EXTRANJERÍA",
        pasaportes: "PASAPORTE",
        clientes: "NO DOMICILIADO, SIN RUC(EXPORTACIÓN)",
      };

      if (type !== "all" && !tipoMap[type]) {
        throw new Error("Tipo de documento no válido");
      }

      const filteredData =
        type === "all"
          ? clientes
          : clientes.filter((c) => c.documentoTipo === tipoMap[type]);

      if (filteredData.length === 0) {
        throw new Error(
          "No se encontraron datos para el tipo de documento seleccionado"
        );
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
          [
            "Tipo",
            "Documento",
            "Nombre",
            "Email",
            "Teléfono",
            "Dirección",
            "Observaciones",
          ],
          ...filteredData.map((c) => [
            c.documentoTipo || "-",
            c.documento || "-",
            c.nombre || c.razonSocial || "-",
            c.email || "-",
            c.telefono || "-",
            c.direccion || "-",
            c.observaciones || "-",
          ]),
        ],
      };
      break;
    }

    case "venta_reporte": {
      const {
        type,
        moneda,
        sucursal,
        usuario,
        cliente,
        fechaInicio,
        fechaFin,
      } = params;
      const data: VentaGenerada[] = generarDataFalsa(200);
      const empresa = getActiveCompany() || { sucursal: "-" };

      const usuarioActivo =
        getActiveUser() ||
        ({ correo: "-", nombres: "-", apellidoPaterno: "-" } as AuthUser);

      const filteredData = data.filter((item) => {
        const fecha = new Date(item.fecha);
        const inicioStr = fechaInicio ? `${fechaInicio}T00:00:00` : "";
        const finStr = fechaFin ? `${fechaFin}T23:59:59` : "";

        const desde = new Date(inicioStr);
        const hasta = new Date(finStr);

        const matchTipo =
          !type ||
          type === "all" ||
          item.tDocumento.toLowerCase().includes(type.replace(/_/g, " "));
        const matchMoneda =
          !moneda || moneda === "all" || item.monto?.moneda === moneda || "PEN";
        const matchSucursal =
          !sucursal ||
          sucursal === "all" ||
          (empresa.sucursal && empresa.sucursal === sucursal);
        const matchUsuario =
          !usuario || usuario === "all" || usuarioActivo.correo === usuario;
        const matchCliente =
          !cliente ||
          cliente === "all" ||
          item.cliente?.toLowerCase() === cliente.toLowerCase();

        const matchFecha =
          !fechaInicio || !fechaFin
            ? true
            : !isNaN(fecha.getTime()) && fecha >= desde && fecha <= hasta;

        return (
          matchTipo &&
          matchMoneda &&
          matchSucursal &&
          matchUsuario &&
          matchCliente &&
          matchFecha
        );
      });

      const groupedData: Record<string, VentaGenerada[]> = {};
      const tipos = tiposComprobante || [];

      tipos.forEach((tipo) => {
        const filtrado = filteredData.filter(
          (item) => item.tDocumento === tipo
        );
        if (filtrado.length > 0) groupedData[tipo] = filtrado;
      });

      if (Object.keys(groupedData).length === 0) {
        throw new Error(
          "No se encontraron datos para los filtros seleccionados."
        );
      }

      for (const tipo of Object.keys(groupedData)) {
        const rows: (string | number)[][] = [];
        const isNota =
          tipo.includes("NOTA DE CRÉDITO") || tipo.includes("NOTA DE DÉBITO");

        rows.push([`REPORTE DE VENTAS: ${tipo.toUpperCase()}`]);
        rows.push([]);

        const headers = isNota
          ? [
              "SERIE",
              "NÚMERO",
              "DOCUMENTO AFECTADO",
              "MOTIVO",
              "SUCURSAL",
              "CLIENTE DOC",
              "CLIENTE NOMBRE",
              "FECHA DE EMISION",
              "FECHA DE VENCIMIENTO",
              "FECHA DE CREACION",
              "USUARIO",
              "PLACA VEHICULO",
              "OBSERVACIONES",
              "OTROS",
              "MONEDA",
              "RC",
              "DESCUENTO",
              "GRAVADO",
              "EXONERADO",
              "INAFECTO",
              "EXPORTACION",
              "GRATUITO",
              "IGV",
              "ISC",
              "ICBPER",
              "TOTAL",
              "ANULADO",
              "ESTADO SUNAT",
            ]
          : [
              "SERIE",
              "NÚMERO",
              "SUCURSAL",
              "CLIENTE DOC",
              "CLIENTE NOMBRE",
              "FECHA DE EMISION",
              "FECHA DE VENCIMIENTO",
              "FECHA DE CREACION",
              "USUARIO",
              "PLACA VEHICULO",
              "ORDEN DE COMPRA",
              "GUIAS DE REMISION",
              "COND. DE PAGO",
              "MET. DE PAGO",
              "REFERENCIA",
              "CUOTAS",
              "OBSERVACIONES",
              "OTROS",
              "MONEDA",
              "DETRACCIÓN (PEN)",
              "RETENCIÓN",
              "PERCEPCIÓN (PEN)",
              "RC",
              "DESCUENTO",
              "GRAVADO",
              "EXONERADO",
              "INAFECTO",
              "EXPORTACION",
              "GRATUITO",
              "IGV",
              "ISC",
              "ICBPER",
              "TOTAL",
              "ANULADO",
              "ESTADO SUNAT",
            ];

        rows.push(headers);

        groupedData[tipo].forEach((item) => {
          const monto = item.monto || {};
          const dEmision = new Date(item.fecha);
          const nombreUsuario = usuarioActivo.nombres || "-";
          const tipoCorto = mapTipo ? mapTipo[tipo] : tipo;

          const row = isNota
            ? [
                item.serie,
                item.numero,
                item.documentoAfectado || "-",
                item.motivo || "-",
                empresa.sucursal || "Lubricantes Claudia",
                item.documento,
                item.cliente,
                dEmision.toLocaleDateString("es-ES"),
                "-",
                dEmision.toLocaleString("es-ES"),
                nombreUsuario,
                item.placaVehiculo || "-",
                item.observaciones || "-",
                "-",
                "PEN",
                monto.rc || 0,
                monto.descuento || 0,
                monto.gravado || 0,
                monto.exonerado || 0,
                monto.inafecto || 0,
                0,
                0,
                monto.igv || 0,
                monto.isc || 0,
                0,
                monto.total || 0,
                item.state === "ANULADO" ? "SÍ" : "NO",
                `La ${tipoCorto} número ${item.serie}-${
                  item.numero
                }, ha sido ${item.state.toLowerCase()}`,
              ]
            : [
                item.serie,
                item.numero,
                empresa.sucursal || "Lubricantes Claudia",
                item.documento,
                item.cliente,
                dEmision.toLocaleDateString("es-ES"),
                "-",
                dEmision.toLocaleString("es-ES"),
                nombreUsuario,
                item.placaVehiculo || "-",
                "-",
                "-",
                "CONTADO",
                "EFECTIVO",
                "-",
                "-",
                item.observaciones || "-",
                "-",
                "PEN",
                0,
                0,
                0,
                monto.rc || 0,
                monto.descuento || 0,
                monto.gravado || 0,
                monto.exonerado || 0,
                monto.inafecto || 0,
                0,
                0,
                monto.igv || 0,
                monto.isc || 0,
                0,
                monto.total || 0,
                item.state === "ANULADO" ? "SÍ" : "NO",
                `La ${tipoCorto} número ${item.serie}-${
                  item.numero
                }, ha sido ${item.state.toLowerCase()}`,
              ];
          rows.push(row);
        });

        const sum = (campo: string) =>
          groupedData[tipo].reduce(
            (acc, i) => acc + (Number(i.monto?.[campo]) || 0),
            0
          );
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
};
