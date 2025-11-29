import jsPDF from "jspdf";
import {
  renderFacturaA4,
  renderFactura80mm,
  PAGE_SIZES,
  LAYOUT,
} from "@/utils/pdf/pdfConfig";
import { PdfFormat } from "@/types/utils/pdf";
import { getActiveUser, getActiveCompany } from "@/services/auth/authServices";
import { VentaGenerada } from "@/services/generadorData";

export async function visualizarPDF(
  factura: Partial<VentaGenerada> = {},
  tipo: string = "A4"
) {
  const validTipo: PdfFormat = tipo === "A4" || tipo === "t80mm" ? tipo : "A4";

  const { width: W, height: H } = PAGE_SIZES[validTipo];
  const cfg = LAYOUT[validTipo];

  const doc = new jsPDF({ unit: "mm", format: [W, H] });
  const activeUser = getActiveUser();
  const activeCompany = getActiveCompany();

  const nombreCompleto =
    (activeUser as any)?.nombreCompleto ||
    `${activeUser?.nombres || ""} ${activeUser?.apellidoPaterno || ""}`.trim();

  (factura as any).emisorRuc = activeCompany?.ruc || "";

  if (validTipo === "A4") {
    renderFacturaA4(doc, factura as VentaGenerada, cfg, W, H, nombreCompleto);
  } else {
    renderFactura80mm(doc, factura as VentaGenerada, cfg, W, H, nombreCompleto);
  }

  return doc.output("blob");
}
