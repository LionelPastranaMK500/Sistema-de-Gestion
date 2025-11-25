import jsPDF from "jspdf";
import { renderFacturaA4, renderFactura80mm, PAGE_SIZES, LAYOUT } from "@/utils/pdf/pdfConfig";
import { getActiveUser, getActiveCompany } from "@services/auth/authServices";

export async function visualizarPDF(factura = {}, tipo = "A4") {
    const { width: W, height: H } = PAGE_SIZES[tipo] || PAGE_SIZES.A4;
    const cfg = LAYOUT[tipo] || LAYOUT.A4;
    const doc = new jsPDF({ unit: "mm", format: [W, H] });
    const activeUser = getActiveUser();
    const activeCompany = getActiveCompany();
    const nombreCompleto =
        activeUser?.nombreCompleto ||
        `${activeUser?.nombres || ""} ${activeUser?.apellidoPaterno || ""}`.trim();
    factura.emisorRuc = activeCompany?.ruc || "";
    if (tipo === "A4") {
        renderFacturaA4(doc, factura, cfg, W, H, nombreCompleto);
    } else if (tipo === "t80mm") {
        renderFactura80mm(doc, factura, cfg, W, H, nombreCompleto);
    }

    return doc.output("blob");
}
