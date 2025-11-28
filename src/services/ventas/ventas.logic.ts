import { ventasService } from "../api/ventas.service";
import { toast } from "react-toastify";

// Interfaz para los datos que vienen del formulario antes de ser una VentaGenerada completa
interface VentaFormData {
  cliente?: {
    documento?: string;
    tipoDocumento?: string;
    razonSocial?: string;
    direccion?: string;
  };
  items?: any[];
  total?: number;
  tipoComprobante?: string;
  serie?: string;
  fechaEmision?: Date | string;
  fechaVencimiento?: Date | string;
  placa?: string;
  ordenCompra?: string;
  observaciones?: string;
  condicionPago?: any;
  [key: string]: any;
}

const validarVenta = (ventaData: VentaFormData): string[] => {
  const errors: string[] = [];

  if (!ventaData.cliente || !ventaData.cliente.documento) {
    errors.push("Cliente es requerido");
  }

  if (!ventaData.items || ventaData.items.length === 0) {
    errors.push("Debe agregar al menos un producto");
  }

  if ((ventaData.total ?? 0) <= 0) {
    errors.push("El total debe ser mayor a cero");
  }

  if (
    ventaData.tipoComprobante === "FACTURA" &&
    ventaData.cliente?.tipoDocumento !== "RUC"
  ) {
    errors.push("Para factura el cliente debe tener RUC");
  }

  return errors;
};

// Resultado de la operación
interface LogicResult {
  success: boolean;
  data?: any;
  error?: string;
  errors?: string[];
}

export const handleEmitirVenta = async (
  ventaData: VentaFormData
): Promise<LogicResult> => {
  try {
    const errors = validarVenta(ventaData);
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return { success: false, errors };
    }

    toast.info("Emitiendo documento...");
    // Cast a any o VentaGenerada según lo que espere el servicio,
    // aquí asumimos que ventaData cumple con lo necesario para el backend
    const response = await ventasService.emitir(ventaData as any);

    toast.success(
      `${response.tDocumento || "Documento"} ${
        response.numero
      } emitida exitosamente`
    );

    // Si la respuesta trae una URL de PDF (simulado o real)
    if ((response as any).pdf) {
      window.open((response as any).pdf, "_blank");
    }

    return { success: true, data: response };
  } catch (err: any) {
    const message = err.data?.message || "Error al emitir documento";
    toast.error(message);
    return { success: false, error: message };
  }
};

export const handleConsultarEstado = async (
  documentoId: string | number
): Promise<LogicResult> => {
  try {
    toast.info("Consultando estado SUNAT...");
    const response = await ventasService.getEstado(documentoId);

    if (response.estado === "ACEPTADO") {
      toast.success("Documento aceptado por SUNAT");
    } else if (response.estado === "RECHAZADO") {
      toast.error(`Documento rechazado: ${response.motivo}`);
    } else {
      toast.warning(`Estado: ${response.estado}`);
    }

    return { success: true, data: response };
  } catch (err) {
    toast.error("Error al consultar estado");
    return { success: false };
  }
};

export const handleDescargarCDR = async (
  documentoId: string | number
): Promise<LogicResult> => {
  try {
    const response = await ventasService.getCdr(documentoId);
    const byteCharacters = atob(response.cdrBase64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CDR-${response.numero}.zip`;
    link.click();

    toast.success("CDR descargado");
    return { success: true };
  } catch (err) {
    toast.error("Error al descargar CDR");
    return { success: false };
  }
};

export const handleAnularDocumento = async (
  documentoId: string | number,
  motivo: string
): Promise<LogicResult> => {
  try {
    if (!motivo || motivo.trim().length < 10) {
      toast.error("El motivo debe tener al menos 10 caracteres");
      return { success: false };
    }

    const confirmed = window.confirm("¿Está seguro de anular este documento?");
    if (!confirmed) return { success: false };

    toast.info("Anulando documento...");
    await ventasService.anular(documentoId, motivo);

    toast.success("Documento anulado exitosamente");
    return { success: true };
  } catch (err: any) {
    toast.error(err.data?.message || "Error al anular documento");
    return { success: false };
  }
};

// Esta función transforma los datos del formulario y hooks en el objeto final para enviar
export const prepararDatosVenta = (
  formData: VentaFormData,
  items: any[],
  desglose: any
): VentaFormData => {
  return {
    tipoComprobante: formData.tipoComprobante,
    serie: formData.serie,
    fechaEmision: formData.fechaEmision,
    fechaVencimiento: formData.fechaVencimiento,
    cliente: {
      tipoDocumento: formData.cliente?.tipoDocumento,
      documento: formData.cliente?.documento,
      razonSocial: formData.cliente?.razonSocial,
      direccion: formData.cliente?.direccion,
    },
    items: items.map((item) => ({
      codigo: item.codigo,
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      valorVenta: item.valorVenta,
      igv: item.igv,
      total: item.total,
    })),
    totales: {
      subtotal: desglose.subtotal,
      igv: desglose.igv,
      total: desglose.total,
      descuento: desglose.descuento || 0,
    },
    placa: formData.placa,
    ordenCompra: formData.ordenCompra,
    observaciones: formData.observaciones,
    condicionPago: formData.condicionPago,
  };
};
