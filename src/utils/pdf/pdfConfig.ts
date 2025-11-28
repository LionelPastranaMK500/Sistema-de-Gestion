import jsPDF from "jspdf";
import { toast } from "react-toastify";
import n2words from "n2words";
import { getActiveUser, getActiveCompany } from "@/services/auth/authServices";
import { VentaGenerada } from "@/services/generadorData";

const BANKS: string[] = [
  "Cta. BCP: 192-330 26997-0-01",
  "CCI. BCP: 002-192 13302699 700138",
  "Cta. INTERBANK: 378-330 8394360",
  "CCI. INTERBANK: 003-378 013308394360 74",
];

export type PdfFormat = "A4" | "t80mm";

interface PageSize {
  width: number;
  height: number;
}

export const PAGE_SIZES: Record<PdfFormat, PageSize> = {
  A4: { width: 210, height: 297 },
  t80mm: { width: 80, height: 297 },
};

const FORMAT_LABELS: Record<PdfFormat, string> = {
  A4: "A4",
  t80mm: "80mm",
};

interface LayoutConfig {
  margin: number;
  fs: { xs: number; sm: number; md: number; lg: number; xl: number };
  line: number;
  bottomSafe: number;
  cols: (w: number, m: number) => Record<string, number>;
}

export const LAYOUT: Record<PdfFormat, LayoutConfig> = {
  A4: {
    margin: 12,
    fs: { xs: 10, sm: 12, md: 14, lg: 16, xl: 22 },
    line: 8,
    bottomSafe: 50,
    cols: (w, m) => ({
      num: m + 2,
      uni: m + 15,
      cod: m + 35,
      desc: m + 60,
      cant: w - 95, // Reducido espacio
      dscto: w - 75, // Nueva columna DSCTO
      punit: w - 50, // Movido P. UNIT.
      total: w - m - 2, // Mantenido TOTAL
    }),
  },
  t80mm: {
    margin: 2.5,
    fs: { xs: 6, sm: 8, md: 9, lg: 11, xl: 14 },
    cols: (w, m) => ({
      desc: m,
      dscto: w - 36, // Nueva columna DSCTO
      punit: w - 21, // Movido P. UNIT.
      total: w - m,
    }),
    line: 5,
    bottomSafe: 25,
  },
};

const money = (n: number | undefined | null) => ` ${Number(n || 0).toFixed(2)}`;

const amountToWords = (amount: number | undefined | null) => {
  const abs = Math.abs(Number(amount || 0));
  const entero = Math.floor(abs);
  const cent = Math.round((abs - entero) * 100);
  // @ts-ignore: n2words type might be incorrect depending on version, or suppress if lang issue
  const letras = n2words(entero, { lang: "es" }).toUpperCase();
  const centTexto = cent.toString().padStart(2, "0");
  return `${letras} CON ${centTexto}/100 SOLES`;
};

const fmtDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const fmtDateTime = (d: string | Date = new Date()) =>
  new Date(d).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

// Tipamos correctamente los parámetros
export function renderFacturaA4(
  doc: jsPDF,
  factura: VentaGenerada,
  cfg: LayoutConfig,
  W: number,
  H: number,
  nombreCompleto: string
) {
  const M = cfg.margin;
  const fs = cfg.fs;
  const lineH = cfg.line;
  const cols = cfg.cols(W, M);
  let y = M;

  const ensureSpace = (need = 0) => {
    if (y > H - (cfg.bottomSafe + need)) {
      doc.addPage([W, H], "portrait");
      y = M;
    }
  };

  // Acceso seguro a la empresa para evitar errores si es null (aunque generadorData suele asegurar valores)
  const empresa = getActiveCompany();
  const rucEmisor = empresa?.ruc || "RUC NO DISPONIBLE";

  doc.setFont("helvetica", "bold").setFontSize(fs.xl);
  doc.text("LUBRICANTES CLAUDIA", M, y, { align: "left" });
  y += lineH;

  doc.setFont("helvetica", "normal").setFontSize(fs.sm);
  doc.text(`DE ${nombreCompleto.toUpperCase()}`, M, y);
  y += lineH;
  doc.text("SUCURSAL: AV. CANTA CALLAO MZA. A LT. 9 - SMP", M, y);
  y += lineH;
  doc.text("Venta de Aceites, Aditivos, Filtros - Mayor y Menor", M, y);
  y += lineH;

  const boxWidth = 70;
  const boxX = W - M - boxWidth;
  const boxY = M;
  const centerX = boxX + boxWidth / 2;
  let yBox = boxY + lineH + 2;

  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text(`RUC ${rucEmisor}`, centerX, yBox, { align: "center" });
  yBox += lineH + 2;
  doc.setFont("helvetica", "normal").setFontSize(11);
  doc.text(`${factura.tDocumento}`, centerX, yBox, { align: "center" });
  yBox += lineH;
  doc.setFont("helvetica", "bold").setFontSize(14);
  doc.text(
    `${factura.serie}-${String(factura.numero).padStart(6, "0")}`,
    centerX,
    yBox,
    { align: "center" }
  );

  doc.rect(boxX, boxY, boxWidth, yBox - boxY + 10);
  y = Math.max(y, boxY + 50);

  doc.setFont("helvetica", "normal").setFontSize(fs.sm);
  doc.text(`DOCUMENTO RUC/DNI ${factura.documento || ""}`, M, y);
  y += lineH;
  doc.text(`CLIENTE ${factura.cliente || ""}`, M, y);
  y += lineH;
  doc.text(`DIRECCIÓN ${factura.direccion || ""}`, M, y);
  let yRight = y - 2 * lineH;
  doc.text(`FECHA EMISIÓN ${fmtDate(factura.fecha)}`, W - M, yRight, {
    align: "right",
  });
  doc.text("FECHA VENCIMIENTO -", W - M, yRight + lineH, { align: "right" });
  doc.text("MONEDA SOLES", W - M, yRight + 2 * lineH, { align: "right" });
  y = Math.max(y, yRight + 3 * lineH) + lineH + 2;

  let totalItemsFinal = 0;
  let totalDescuentoItems = 0;

  doc.setFont("helvetica", "bold").setFontSize(fs.sm);
  doc.text("Nº", cols.num, y);
  doc.text("UNIDAD", cols.uni, y);
  doc.text("CÓDIGO", cols.cod, y);
  doc.text("DESCRIPCIÓN", cols.desc, y);
  doc.text("CANT.", cols.cant, y, { align: "right" });
  doc.text("DSCTO.", cols.dscto, y, { align: "right" });
  doc.text("P. UNIT.", cols.punit, y, { align: "right" });
  doc.text("TOTAL", cols.total, y, { align: "right" });

  y += 2;
  doc.line(M, y, W - M, y);
  y += lineH;

  factura.items.forEach((it, idx) => {
    const totalConDescuento = it.totalFinal || it.total || 0; // Fallback si no tiene totalFinal
    const itemDiscount = it.descuentoAplicado || 0;

    totalItemsFinal += totalConDescuento;
    totalDescuentoItems += itemDiscount;

    const precioUnitario = it.precio || 0;

    const descLines = doc.splitTextToSize(
      it.descripcion || "",
      cols.cant - cols.desc - 4
    );

    descLines.forEach((line: string, i: number) => {
      ensureSpace(lineH);
      if (i === 0) {
        doc.setFont("helvetica", "normal");
        doc.text(String(idx + 1), cols.num, y);
        doc.text(it.unidad || "UND", cols.uni, y);
        doc.text(String(it.codigo || ""), cols.cod, y);
        doc.text(line, cols.desc, y);
        doc.text(String(it.cantidad || ""), cols.cant, y, { align: "right" });
        doc.text(itemDiscount.toFixed(2), cols.dscto, y, { align: "right" });
        doc.text(precioUnitario.toFixed(2), cols.punit, y, { align: "right" });
        doc.text(totalConDescuento.toFixed(2), cols.total, y, {
          align: "right",
        });
      } else {
        y += lineH;
        doc.text(line, cols.desc, y);
      }
    });
    y += lineH;
  });

  y += 2;
  doc.line(cfg.margin, y, W - cfg.margin, y);
  y += cfg.line;

  const totalFinal = factura.monto?.total || 0;
  const gravado = totalFinal / 1.18;
  const igv = totalFinal - gravado;

  if (totalDescuentoItems > 0) {
    doc.setFont("helvetica", "bold");
    const labelDsctoX = W - 65;
    const valueDsctoX = W - cfg.margin;
    doc.text("DESCUENTO GLOBAL S/", labelDsctoX, y);
    doc.text(money(totalDescuentoItems), valueDsctoX, y, { align: "right" });
    y += cfg.line;
  }

  doc.setFont("helvetica", "italic", "bold").setFontSize(cfg.fs.sm + 2);
  doc.text(`SON: ${amountToWords(totalFinal)}`, W / 2, y, { align: "center" });
  y += cfg.line + 1;
  doc.line(cfg.margin, y, W - cfg.margin, y);
  y += cfg.line;

  doc.setFont("helvetica", "bold").setFontSize(cfg.fs.sm);
  const labelX = W - 65;
  const valueX = W - cfg.margin;

  doc.text("GRAVADO", labelX, y);
  doc.text("S/", labelX + 35, y);
  doc.text(money(gravado), valueX, y, { align: "right" });
  y += cfg.line;

  doc.text("I.G.V. 18%", labelX, y);
  doc.text("S/", labelX + 35, y);
  doc.text(money(igv), valueX, y, { align: "right" });
  y += cfg.line;

  doc.text("TOTAL", labelX, y);
  doc.text("S/", labelX + 35, y);
  doc.text(money(totalFinal), valueX, y, { align: "right" });
  y += cfg.line + 2;

  doc.line(cfg.margin, y, W - cfg.margin, y);
  y += cfg.line;

  doc.setFont("helvetica", "bold").setFontSize(cfg.fs.xs);
  const leftLabelX = cfg.margin;
  const leftValueX = cfg.margin + 45;

  doc.text("USUARIO", leftLabelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${nombreCompleto.toUpperCase()} - ${fmtDateTime()}`, leftValueX, y);
  y += cfg.line;

  doc.setFont("helvetica", "bold");
  doc.text("CONDICIÓN DE PAGO", leftLabelX, y);
  doc.setFont("helvetica", "normal");
  // Ajuste si condicionPago no existe en factura (VentaGenerada)
  // Puedes extender VentaGenerada o acceder con ['condicionPago']
  let condText = "CONTADO";
  const condPago = (factura as any).condicionPago;
  if (condPago?.condicion) {
    condText = `${condPago.condicion}`;
    if (condPago.metodo) condText += ` - ${condPago.metodo}`;
    if (condPago.referencia) condText += ` (Ref: ${condPago.referencia})`;
  }
  doc.text(condText, leftValueX, y);
  y += cfg.line;

  doc.setFont("helvetica", "bold");
  doc.text("CUENTAS BANCARIAS", leftLabelX, y);
  doc.setFont("helvetica", "normal");
  BANKS.forEach((b) => {
    doc.text(b, leftValueX, y);
    y += cfg.line;
  });

  doc.setFont("helvetica", "bold");
  doc.text("RESPUESTA SUNAT", leftLabelX, y);
  doc.setFont("helvetica", "normal");
  doc.text(
    `La Factura numero ${factura.serie}-${String(factura.numero).padStart(
      6,
      "0"
    )}, ha sido aceptada`,
    leftValueX,
    y
  );
  y += cfg.line * 2;

  if (factura.placaVehiculo || (factura as any).ordenCompra) {
    doc.setFont("helvetica", "bold");
    let infoLine = "";
    if (factura.placaVehiculo) infoLine += `PLACA: ${factura.placaVehiculo}   `;
    if ((factura as any).ordenCompra)
      infoLine += `O. COMPRA: ${(factura as any).ordenCompra}`;
    doc.text(infoLine.trim(), cfg.margin, y);
    y += cfg.line;
  }

  // Casting a any para propiedades opcionales extras que no estén en la interfaz base
  const guias = (factura as any).guiasRemision;
  if (guias && guias.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("GUÍAS DE REMISIÓN:", cfg.margin, y);
    y += cfg.line;
    doc.setFont("helvetica", "normal");
    guias.forEach((g: any) => {
      doc.text(`- ${g.tipo}: ${g.serie}-${g.numero}`, cfg.margin + 5, y);
      y += cfg.line;
    });
  }

  if (factura.observaciones) {
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVACIONES:", cfg.margin, y);
    y += cfg.line;
    doc.setFont("helvetica", "normal");
    const obsLines = doc.splitTextToSize(
      factura.observaciones,
      W - 2 * cfg.margin
    );
    obsLines.forEach((line: string) => {
      doc.text(line, cfg.margin + 5, y);
      y += cfg.line;
    });
  }

  const datosAdicionales = (factura as any).datosAdicionales;
  if (datosAdicionales && datosAdicionales.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN ADICIONAL:", cfg.margin, y);
    y += cfg.line;
    doc.setFont("helvetica", "normal");
    datosAdicionales.forEach((d: any) => {
      doc.text(`${d.titulo}: ${d.descripcion}`, cfg.margin + 5, y);
      y += cfg.line;
    });
  }

  y += cfg.line;

  doc.setFont("helvetica", "normal").setFontSize(9);
  doc.text("Autorizado mediante resolución ", cfg.margin, y);
  y += cfg.line;
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text("Gracias por su preferencia.", W / 2, y, { align: "center" });
  y += cfg.line * 2;

  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.text("Studios TKOH™", W / 2, y, { align: "center" });
  y += cfg.line;

  return { y, total: totalFinal };
}

export function renderFactura80mm(
  doc: jsPDF,
  factura: VentaGenerada,
  cfg: LayoutConfig,
  W: number,
  H: number,
  nombreCompleto: string
) {
  const M = cfg.margin;
  const fs = cfg.fs;
  const lineH = cfg.line;
  // Para 80mm usamos una estructura diferente de columnas, aquí simplificado
  const cols = cfg.cols(W, M);

  const punitX = (cols as any).punit;
  const totalX = (cols as any).total;
  const dsctoX = (cols as any).dscto;
  const safeWidth = W - 2 * M;
  const descWidth = dsctoX - M - 14;

  let y = M;
  const ensureSpace = (need = 0) => {
    if (y > H - (cfg.bottomSafe + need)) {
      doc.addPage([W, H], "portrait");
      y = M;
    }
  };

  const printInline = (label: string, value: string | number) => {
    doc.setFont("helvetica", "bold").setFontSize(fs.md);
    doc.text(label, M, y);

    const labelWidth = doc.getTextWidth(label + " ");
    const valStr = String(value || "");

    doc.setFont("helvetica", "normal").setFontSize(fs.sm);

    const spaceLeft = safeWidth - labelWidth;
    const lines = doc.splitTextToSize(valStr, spaceLeft);

    if (lines.length > 0) {
      doc.text(lines[0], M + labelWidth, y);
      for (let i = 1; i < lines.length; i++) {
        y += lineH;
        doc.text(lines[i], M + labelWidth, y);
      }
    }
    y += lineH;
  };

  // Acceso seguro a la empresa
  const empresa = getActiveCompany();
  const rucEmisor = empresa?.ruc || "RUC NO DISPONIBLE";

  y += 5;

  doc.setFont("helvetica", "bold").setFontSize(14);
  const nombreEmpresa = "LUBRICANTES CLAUDIA";

  doc.text(nombreEmpresa, W / 2, y, { align: "center" });
  y += lineH * 0.5;
  y += lineH * 1.5;

  doc.setFont("helvetica", "normal").setFontSize(fs.md);
  doc.text(`DE: ${nombreCompleto.toUpperCase()}`, W / 2, y, {
    align: "center",
  });
  y += lineH;

  doc.setFont("helvetica", "bold").setFontSize(fs.lg);
  doc.text(`RUC ${rucEmisor}`, W / 2, y, { align: "center" });
  y += lineH;

  doc.setFont("helvetica", "normal").setFontSize(fs.xs + 1);
  const direccion =
    "AV. ALFREDO MENDIOLA 6376 ASOC. VIV. FAMILIA UNIDA - S.M.P. LIMA / N° TELEFONO: (01)536-9146";
  doc.splitTextToSize(direccion, safeWidth).forEach((line: string) => {
    doc.text(line, W / 2, y, { align: "center" });
    y += lineH - 1.5;
  });
  y += 2;

  const rubro =
    "Venta de Aceites, Aditivos, Filtros - Mayor y Menor. Cambio de aceite y pulverizado GRATIS";
  doc.splitTextToSize(rubro, safeWidth).forEach((line: string) => {
    doc.text(line, W / 2, y, { align: "center" });
    y += lineH - 1.5;
  });
  y += lineH;

  doc.setFont("helvetica", "bold").setFontSize(fs.md);
  doc.text(`${factura.tDocumento.toUpperCase()}`, W / 2, y, {
    align: "center",
  });
  y += lineH;

  doc.setFontSize(fs.lg);
  doc.text(
    `${factura.serie}-${String(factura.numero).padStart(6, "0")}`,
    W / 2,
    y,
    { align: "center" }
  );
  y += lineH * 1.5;
  doc.setFontSize(fs.sm);

  const printField = (label: string, value: string | number) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, M, y);
    const labelWidth = doc.getTextWidth(label);
    const valStr = String(value || "").toUpperCase();

    const spaceLeft = safeWidth - labelWidth - 2;

    doc.setFont("helvetica", "normal");

    if (doc.getTextWidth(valStr) < spaceLeft) {
      doc.text(valStr, M + labelWidth + 2, y);
      y += lineH;
    } else {
      y += lineH;
      doc.splitTextToSize(valStr, safeWidth).forEach((l: string) => {
        doc.text(l, M, y);
        y += lineH;
      });
    }
  };

  let valorRuc = factura.documento; // Usamos documento en lugar de ruc
  if (typeof valorRuc === "boolean" || !valorRuc) {
    valorRuc = "-";
  }

  const labelDoc = "RUC/DNI:";
  printField(labelDoc, valorRuc);
  printField("CLIENTE:", factura.cliente || "PUBLICO GENERAL");
  printField("DIRECCIÓN:", factura.direccion || "-");
  printField("FECHA EMISIÓN:", fmtDate(factura.fecha));
  y += 2;

  doc.setFont("helvetica", "bold").setFontSize(fs.xs + 1);
  doc.text("DESCRIPCIÓN", (cols as any).desc, y);
  doc.text("DSCTO", dsctoX, y, { align: "right" });
  doc.text("P/U", punitX, y, { align: "right" });
  doc.text("TOTAL", totalX, y, { align: "right" });

  y += 2;
  doc.line(M, y, W - M, y);
  y += lineH;

  let totalItemsFinal = 0;
  let totalDescuentoItems = 0;

  factura.items.forEach((it) => {
    const cantidad = Number(it.cantidad || 0);
    const precioUnitario = it.precio || 0;
    const totalConDescuento = it.totalFinal || it.total || 0;
    const itemDiscount = it.descuentoAplicado || 0;

    totalItemsFinal += totalConDescuento;
    totalDescuentoItems += itemDiscount;

    const desc = `[${cantidad}] ${it.descripcion}`;
    const lines = doc.splitTextToSize(desc, descWidth);

    lines.forEach((line: string, i: number) => {
      ensureSpace(lineH);
      doc.setFont("helvetica", "normal").setFontSize(8);
      if (i === 0) {
        doc.text(line, (cols as any).desc, y);
        doc.text(itemDiscount > 0 ? itemDiscount.toFixed(2) : "", dsctoX, y, {
          align: "right",
        });
        doc.text(precioUnitario.toFixed(2), punitX, y, { align: "right" });
        doc.text(totalConDescuento.toFixed(2), totalX, y, { align: "right" });
      } else {
        doc.text(line, (cols as any).desc, y);
      }
      y += lineH - 1;
    });
    y += 1.5;
  });

  y += 2;
  doc.line(M, y, W - M, y);
  y += lineH;

  const totalFinal = factura.monto?.total || 0;
  const gravado = totalFinal / 1.18;
  const igv = totalFinal - gravado;

  doc.setFont("helvetica", "italic", "bold").setFontSize(fs.md);
  const amountInWords = `SON: ${amountToWords(totalFinal)}`;
  ensureSpace(lineH * 2);
  doc.splitTextToSize(amountInWords, safeWidth).forEach((line: string) => {
    doc.text(line, M, y);
    y += lineH;
  });
  y += 2;

  const printTotalLine = (label: string, val: string) => {
    ensureSpace(lineH);
    doc.setFont("helvetica", "bold").setFontSize(fs.sm);
    doc.text(label, punitX, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(val, totalX, y, { align: "right" });
    y += lineH;
  };

  if (totalDescuentoItems > 0) {
    printTotalLine("DSCTO GBL S/", money(totalDescuentoItems));
  }
  printTotalLine("GRAVADO S/", money(gravado));
  printTotalLine("I.G.V. 18% S/", money(igv));

  doc.setFontSize(fs.md);
  ensureSpace(lineH);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL S/", punitX, y, { align: "right" });
  doc.text(money(totalFinal), totalX, y, { align: "right" });
  y += lineH * 1.5;

  printInline("USUARIO:", nombreCompleto.toUpperCase());

  let condText = "CONTADO";
  const condPago = (factura as any).condicionPago;
  if (condPago?.condicion) {
    condText = `${condPago.condicion}`;
    if (condPago.metodo) condText += ` - ${condPago.metodo}`;
  }
  printInline("CONDICIÓN PAGO:", condText);

  ensureSpace(lineH);
  doc.setFont("helvetica", "bold").setFontSize(fs.md);
  doc.text("CUENTAS BANCARIAS:", M, y);
  y += lineH;
  doc.setFont("helvetica", "normal").setFontSize(fs.sm);
  BANKS.forEach((b) => {
    doc.splitTextToSize(b, safeWidth).forEach((l: string) => {
      doc.text(l, M, y);
      y += lineH;
    });
  });

  ensureSpace(lineH);
  const sunatTxt = `La Factura ${factura.serie}-${factura.numero} ha sido aceptada.`;
  printInline("RESPUESTA SUNAT:", sunatTxt);

  if (factura.placaVehiculo || (factura as any).ordenCompra) {
    if (factura.placaVehiculo) printInline("PLACA:", factura.placaVehiculo);
    if ((factura as any).ordenCompra)
      printInline("O. COMPRA:", (factura as any).ordenCompra);
  }

  if (factura.observaciones) {
    printInline("OBSERVACIONES:", factura.observaciones);
  }

  y += lineH;
  ensureSpace(lineH * 4);
  doc.setFont("helvetica", "normal").setFontSize(fs.md);
  doc.text("Autorizado mediante resolución", W / 2, y, { align: "center" });
  y += lineH;
  doc.setFont("helvetica", "italic").setFontSize(fs.md);
  doc.text("Representación impresa de la F.E.", W / 2, y, { align: "center" });
  y += lineH;
  doc.setFont("helvetica", "normal").setFontSize(fs.md);
  doc.text("Gracias por su preferencia.", W / 2, y, { align: "center" });
  y += lineH * 2;

  doc.setFont("helvetica", "bold").setFontSize(fs.md);
  doc.text("Studios TKOH™", W / 2, y, { align: "center" });

  return { y, total: totalFinal };
}

// Función auxiliar para llamar al render correcto
// Agregamos Partial<VentaGenerada> porque al iniciar la app puede venir vacía
export async function visualizarPDF(
  factura: Partial<VentaGenerada> = {},
  tipo: string = "A4"
) {
  // Validamos que el tipo sea válido, sino fallback a A4
  const validTipo = tipo === "A4" || tipo === "t80mm" ? tipo : "A4";
  const { width: W, height: H } = PAGE_SIZES[validTipo];
  const cfg = LAYOUT[validTipo];

  const doc = new jsPDF({ unit: "mm", format: [W, H] });
  const activeUser = getActiveUser();

  const nombreCompleto =
    (activeUser as any)?.nombreCompleto ||
    `${activeUser?.nombres || ""} ${activeUser?.apellidoPaterno || ""}`.trim();

  // Aseguramos que factura tenga lo mínimo necesario o lanzamos error/retornamos
  // Aquí forzamos el tipo para que renderFactura lo acepte
  if (validTipo === "A4") {
    renderFacturaA4(doc, factura as VentaGenerada, cfg, W, H, nombreCompleto);
  } else {
    renderFactura80mm(doc, factura as VentaGenerada, cfg, W, H, nombreCompleto);
  }

  return doc.output("blob");
}

export async function generarPDF(factura: VentaGenerada, tipo: string = "A4") {
  try {
    const validTipo = tipo === "A4" || tipo === "t80mm" ? tipo : "A4";
    const { width: W, height: H } = PAGE_SIZES[validTipo];
    const cfg = LAYOUT[validTipo];
    const doc = new jsPDF({ unit: "mm", format: [W, H] });

    const activeUser = getActiveUser();
    const nombreCompleto =
      (activeUser as any)?.nombreCompleto ||
      `${activeUser?.nombres} ${activeUser?.apellidoPaterno}`;

    if (validTipo === "A4") {
      renderFacturaA4(doc, factura, cfg, W, H, nombreCompleto);
    } else {
      renderFactura80mm(doc, factura, cfg, W, H, nombreCompleto);
    }

    doc.save(`${factura.tDocumento}_${factura.serie}-${factura.numero}.pdf`);
    const tipolbl = FORMAT_LABELS[validTipo];
    toast.success(`Se genero el PDF ${tipolbl}`);
  } catch (err) {
    console.error(err);
    toast.error("Error al generar PDF");
  }
}
