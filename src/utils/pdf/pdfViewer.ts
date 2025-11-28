import jsPDF from "jspdf";
import {
  renderFacturaA4,
  renderFactura80mm,
  PAGE_SIZES,
  LAYOUT,
  PdfFormat,
} from "@/utils/pdf/pdfConfig";
import { getActiveUser, getActiveCompany } from "@/services/auth/authServices";
import { VentaGenerada } from "@/services/generadorData";

export async function visualizarPDF(
  factura: Partial<VentaGenerada> = {},
  tipo: string = "A4"
) {
  // 1. Validamos que el tipo sea correcto para evitar errores de índice
  const validTipo: PdfFormat = tipo === "A4" || tipo === "t80mm" ? tipo : "A4";

  const { width: W, height: H } = PAGE_SIZES[validTipo];
  const cfg = LAYOUT[validTipo];

  const doc = new jsPDF({ unit: "mm", format: [W, H] });
  const activeUser = getActiveUser();
  const activeCompany = getActiveCompany();

  const nombreCompleto =
    (activeUser as any)?.nombreCompleto ||
    `${activeUser?.nombres || ""} ${activeUser?.apellidoPaterno || ""}`.trim();

  // 2. Asignamos el RUC del emisor. Usamos 'as any' o la propiedad dinámica si la interfaz lo permite.
  // VentaGenerada tiene [key: string]: any, así que esto es válido.
  (factura as any).emisorRuc = activeCompany?.ruc || "";

  // 3. Llamamos a la función de renderizado correspondiente
  if (validTipo === "A4") {
    renderFacturaA4(doc, factura as VentaGenerada, cfg, W, H, nombreCompleto);
  } else {
    renderFactura80mm(doc, factura as VentaGenerada, cfg, W, H, nombreCompleto);
  }

  return doc.output("blob");
}
