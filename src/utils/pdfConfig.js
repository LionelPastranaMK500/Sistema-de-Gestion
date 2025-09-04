import jsPDF from "jspdf";
import { toast } from "react-toastify";
import n2words from "n2words";
import { getActiveUser } from "@services/auth/authServices";

const BANKS = [
    "Cta. BCP:",
    "CCI. BCP:",
    "Cta. INTERBANK:",
    "CCI. INTERBANK:",
    "Cta. BBVA:"
];

const PAGE_SIZES = {
    A4: { width: 210, height: 297 },
    t80mm: { width: 80, height: 297 },
};

const FORMAT_LABELS = {
    A4: "A4",
    t80mm: "80mm"
};

const LAYOUT = {
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
            cant: w - 75,
            punit: w - 45,
            total: w - m - 2,
        }),
    },
    t80mm: {
        margin: 5,
        fs: { xs: 6, sm: 8, md: 9, lg: 11, xl: 14 },
        cols: (w, m) => ({
            desc: m + 2,
            punit: w - 32,
            total: w - m,
        }),
        line: 5.5,
        bottomSafe: 25,
    },
};

const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;
const amountToWords = (amount) => {
    const abs = Math.abs(Number(amount || 0));
    const entero = Math.floor(abs);
    const cent = Math.round((abs - entero) * 100);
    const letras = n2words(entero, { lang: "es" }).toUpperCase();
    const centTexto = cent.toString().padStart(2, "0");
    return `${letras} CON ${centTexto}/100 SOLES`;
};
const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
const fmtDateTime = (d = new Date()) =>
    new Date(d).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

function renderFacturaA4(doc, factura, cfg, W, H, nombreCompleto) {
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

    //dato empresa
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
    doc.text(`RUC ${factura.emisorRuc || "20043553445"}`, centerX, yBox, { align: "center" });
    yBox += lineH + 2;
    doc.setFont("helvetica", "normal").setFontSize(11);
    doc.text(`${factura.tDocumento}`, centerX, yBox, { align: "center" });
    yBox += lineH;
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text(`${factura.serie}-${String(factura.numero).padStart(6, "0")}`, centerX, yBox, { align: "center" });

    doc.rect(boxX, boxY, boxWidth, (yBox - boxY) + 10);
    y = Math.max(y, boxY + 50);

    //dato cliente
    doc.setFont("helvetica", "normal").setFontSize(fs.sm);
    doc.text(`DOCUMENTO RUC ${factura.ruc || ""}`, M, y); y += lineH;
    doc.text(`CLIENTE ${factura.cliente || ""}`, M, y); y += lineH;
    doc.text(`DIRECCIÓN ${factura.direccion || ""}`, M, y);
    let yRight = y - 2 * lineH;
    doc.text(`FECHA EMISIÓN ${fmtDate(factura.fecha)}`, W - M, yRight, { align: "right" });
    doc.text("FECHA VENCIMIENTO -", W - M, yRight + lineH, { align: "right" });
    doc.text("MONEDA SOLES", W - M, yRight + 2 * lineH, { align: "right" });
    y = Math.max(y, yRight + 3 * lineH) + lineH + 2;

    //items
    let total = 0;
    doc.setFont("helvetica", "bold").setFontSize(fs.sm);
    doc.text("Nº", cols.num, y);
    doc.text("UNIDAD", cols.uni, y);
    doc.text("CÓDIGO", cols.cod, y);
    doc.text("DESCRIPCIÓN", cols.desc, y);
    doc.text("CANT.", cols.cant, y, { align: "right" });
    doc.text("P. UNIT.", cols.punit, y, { align: "right" });
    doc.text("TOTAL", cols.total, y, { align: "right" });

    y += 2; doc.line(M, y, W - M, y); y += lineH;

    factura.items.forEach((it, idx) => {
        const subtotal = (it.cantidad || 0) * (it.precio || 0);
        total += subtotal;
        const descLines = doc.splitTextToSize(it.descripcion || "", cols.cant - cols.desc - 4);

        descLines.forEach((line, i) => {
            ensureSpace(lineH);
            if (i === 0) {
                doc.setFont("helvetica", "normal");
                doc.text(String(idx + 1), cols.num, y);
                doc.text(it.unidad || "", cols.uni, y);
                doc.text(it.codigo || "", cols.cod, y);
                doc.text(line, cols.desc, y);
                doc.text(String(it.cantidad || ""), cols.cant, y, { align: "right" });
                doc.text(Number(it.precio || 0).toFixed(2), cols.punit, y, { align: "right" });
                doc.text(subtotal.toFixed(2), cols.total, y, { align: "right" });
            } else {
                y += lineH;
                doc.text(line, cols.desc, y);
            }
        });
        y += lineH;
    });

    y += 2; doc.line(cfg.margin, y, W - cfg.margin, y); y += cfg.line;

    const gravado = total / 1.18;
    const igv = total - gravado;

    //totales
    doc.setFont("helvetica", "italic", "bold").setFontSize(cfg.fs.sm + 2);
    doc.text(`SON: ${amountToWords(total)}`, W / 2, y, { align: "center" });
    y += cfg.line + 1;
    doc.line(cfg.margin, y, W - cfg.margin, y); y += cfg.line;

    doc.setFont("helvetica", "bold");
    const labelX = W - 65;
    const valueX = W - cfg.margin;
    doc.text("GRAVADO S/", labelX, y);
    doc.text(money(gravado), valueX, y, { align: "right" }); y += cfg.line;
    doc.text("IGV (18%) S/", labelX, y);
    doc.text(money(igv), valueX, y, { align: "right" }); y += cfg.line;
    doc.text("TOTAL S/", labelX, y);
    doc.text(money(total), valueX, y, { align: "right" }); y += cfg.line + 2;

    doc.setFont("helvetica", "normal").setFontSize(cfg.fs.xs);
    doc.text(`USUARIO ${nombreCompleto.toUpperCase()} - ${fmtDateTime()}`, cfg.margin, y); y += cfg.line;
    doc.text("CONDICIÓN DE PAGO: ", cfg.margin, y); y += cfg.line;
    doc.setFont("helvetica", "bold").text("CUENTAS BANCARIAS:", cfg.margin, y); y += cfg.line;
    // Aumentar un poco el tamaño y poner en negrita las cuentas bancarias
    doc.setFont("helvetica", "bold").setFontSize(cfg.fs.xs + 1);
    BANKS.forEach((b) => { doc.text(b, cfg.margin + 2, y); y += cfg.line; });

    return { y, total };
}

function renderFactura80mm(doc, factura, cfg, W, H, nombreCompleto) {
    const M = cfg.margin;
    const fs = cfg.fs;
    const lineH = cfg.line;
    const cols = cfg.cols(W, M);


    // Mueve la columna "P/U" un poquito a la derecha y recalcula el ancho de la descripción
    const PUNIT_BUMP_MM = 4;                   // <--- ajusta aquí si lo quieres más/menos
    const punitX = cols.punit + PUNIT_BUMP_MM; // nueva X para "P/U" (para totales al pie)
    const totalX = cols.total;                 // mantenemos TOTAL en su borde derecho
    // Coordenada efectiva para P/U en la tabla de items (alineado con TOTAL pero sin superposición)
    const PUX = totalX - 14;                    // P/U a 14mm a la izquierda del TOTAL
    const DESC_SAFE_GAP = 5;                    // separación mínima entre descripción y P/U
    const descWidthOriginal = PUX - DESC_SAFE_GAP - cols.desc; // ancho máximo de la descripción (original)
    const DESC_WIDTH_FACTOR = 0.8;              // usar 4/5 partes del ancho original
    const descWidth = descWidthOriginal * DESC_WIDTH_FACTOR;   // ancho efectivo reducido
    // ============================

    let y = M;
    const ensureSpace = (need = 0) => {
        if (y > H - (cfg.bottomSafe + need)) {
            doc.addPage([W, H], "portrait");
            y = M;
        }
    };

    y += 5;
    doc.setFont("helvetica", "bold").setFontSize(16); // Set to 14 as requested

    //datos empresa
    const empresa = "LUBRICANTES CLAUDIA";
    const safeWidth = W - 2 * M;
    doc.text(empresa, W / 2, y, { align: "center", charSpace: -0.3, renderingMode: "fill" });
    // Duplicar texto con offset para simular bold más exagerado
    doc.text(empresa, W / 2 + 0.1, y + 0.1, { align: "center", charSpace: -0.3, renderingMode: "fill" });
    y += lineH * 1.5;

    doc.setFont("helvetica", "normal").setFontSize(fs.md);
    doc.text(`DE: ${nombreCompleto.toUpperCase()}`, W / 2, y, { align: "center" });
    y += lineH;

    doc.setFont("helvetica", "bold").setFontSize(fs.lg + 2);
    doc.text(`RUC ${factura.emisorRuc || "20043553445"}`, W / 2, y, { align: "center", charSpace: -0.3, renderingMode: "fill" });
    y += lineH;

    doc.setFont("helvetica", "normal").setFontSize(fs.sm + 1);
    const direccion = "AV. ALFREDO MENDIOLA 6376 ASOC. VIV. FAMILIA UNIDA - S.M.P. LIMA / N° TELEFONO: (01)536-9146";
    doc.splitTextToSize(direccion, safeWidth).forEach(line => {
        doc.text(line, W / 2, y, { align: "center" });
        y += lineH;
    });

    const rubro = "Venta de Aceites, Aditivos, Filtros y Ventas al por Mayor y Menor Cambio de aceite y pulverizado GRATIS";
    doc.splitTextToSize(rubro, safeWidth).forEach(line => {
        doc.text(line, W / 2, y, { align: "center" });
        y += lineH;
    });

    doc.setFont("helvetica", "bold").setFontSize(fs.sm + 3);
    doc.text(`${(factura.tDocumento || "").toUpperCase()}`, W / 2, y, { align: "center", charSpace: -0.0, renderingMode: "fill" });
    y += lineH;

    doc.setFont("helvetica", "bold").setFontSize(fs.lg + 2);
    doc.text(`${factura.serie}-${String(factura.numero).padStart(6, "0")}`, W / 2 + 0.1, y + 0.1, { align: "center", charSpace: -0.3, renderingMode: "fill" });
    y += lineH * 2;

    //dato cliente
    doc.setFont("helvetica", "bold").setFontSize(fs.sm + 2);
    const clientLeftWidth = (W / 2) - M;           // Ancho aproximado para la columna izquierda (constantes)
    const clientRightStart = M + clientLeftWidth + 2; // Inicio de la columna derecha (info dinámica)
    const clientRightWidth = W - clientRightStart - M; // Ancho disponible para la info dinámica

    // DOCUMENTO RUC
    doc.text("DOCUMENTO RUC:", M, y);
    doc.setFont("helvetica", "normal");
    const rucText = `${factura.ruc || ""}`;
    const rucLines = doc.splitTextToSize(rucText, clientRightWidth);
    rucLines.forEach((line, i) => {
        doc.text(line, clientRightStart, y + (i * lineH));
    });
    y += Math.max(1, rucLines.length) * lineH * 1.5;

    // CLIENTE
    doc.setFont("helvetica", "bold");
    doc.text("CLIENTE:", M, y);
    doc.setFont("helvetica", "normal");
    const clienteText = `${factura.cliente || ""}`;
    const clienteLines = doc.splitTextToSize(clienteText, clientRightWidth);
    clienteLines.forEach((line, i) => {
        doc.text(line, clientRightStart, y + (i * lineH));
    });
    y += Math.max(1, clienteLines.length) * lineH * 1.5;

    // DIRECCIÓN
    doc.setFont("helvetica", "bold");
    doc.text("DIRECCIÓN:", M, y);
    doc.setFont("helvetica", "normal");
    const direccionText = `${factura.direccion || ""}`;
    const direccionLines = doc.splitTextToSize(direccionText, clientRightWidth);
    direccionLines.forEach((line, i) => {
        doc.text(line, clientRightStart, y + (i * lineH));
    });
    y += Math.max(1, direccionLines.length) * lineH * 1.5;

    // FECHA EMISIÓN
    doc.setFont("helvetica", "bold");
    doc.text("FECHA EMISIÓN:", M, y);
    doc.setFont("helvetica", "normal");
    const fechaText = `${fmtDate(factura.fecha)}`;
    const fechaLines = doc.splitTextToSize(fechaText, clientRightWidth);
    fechaLines.forEach((line, i) => {
        doc.text(line, clientRightStart, y + (i * lineH));
    });
    y += Math.max(1, fechaLines.length) * lineH * 1.5;

    //items
    let total = 0;

    // Encabezado de tabla (ligeramente más grande)
    doc.setFont("helvetica", "bold").setFontSize(fs.sm + 1);
    doc.text("DESCRIPCIÓN", cols.desc, y, { charSpace: -0.3, renderingMode: "fill" });
    // P/U alineado con coordenada PUX; TOTAL queda al borde derecho
    doc.text("P/U", PUX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
    doc.text("TOTAL", totalX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
    y += 2; doc.line(M, y, W - M, y); y += lineH;

    factura.items.forEach((it) => {
        const cantidad = Number(it.cantidad || 0);
        const precio = Number(it.precio || 0);
        const subtotal = cantidad * precio;
        total += subtotal;

        const desc = `[${cantidad.toFixed(2)}] ${it.descripcion}`;
        // usar el ancho definido que respeta un gap con P/U
        const lines = doc.splitTextToSize(desc, descWidth);

        lines.forEach((line, i) => {
            ensureSpace(lineH);
            if (i === 0) {
                // Contenido de la tabla un poco más grande
                doc.setFont("helvetica", "normal").setFontSize(fs.xs + 3);
                doc.text(line, cols.desc, y);
                // P/U alineado en PUX (sin invadir TOTAL ni descripción)
                doc.text(precio.toFixed(2), PUX, y, { align: "right" });
                doc.text(subtotal.toFixed(2), totalX - 2, y, { align: "right" }); // pequeño respiro al borde
            } else {
                y += lineH;
                doc.text(line, cols.desc, y);
            }
        });
        y += lineH;
    });
    y += 2; doc.line(M, y, W - M, y); y += lineH;

    //totales
    doc.setFont("helvetica", "italic", "bold").setFontSize(fs.xs + 2);
    const amountInWords = `SON ${amountToWords(total)}`;
    ensureSpace(lineH);
    doc.text(amountInWords, M, y, { charSpace: -0.3, renderingMode: "fill" });
    y += lineH + 1;

    const gravado = total / 1.18;
    const igv = total - gravado;

    doc.setFont("helvetica", "bold").setFontSize(fs.sm);
    const totales = [
        ["GRAVADO S/", money(gravado)],
        ["I.G.V. 18% S/", money(igv)],
    ];
    totales.forEach(([label, value]) => {
        ensureSpace(lineH);
        doc.text(label, punitX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
        doc.text(value, totalX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
        y += lineH;
    });

    doc.setFontSize(fs.md);
    ensureSpace(lineH);
    doc.text("TOTAL S/", punitX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
    doc.text(money(total), totalX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
    y += lineH * 2;

    doc.setFont("helvetica", "normal").setFontSize(fs.xs + 1);
    doc.text(`USUARIO ${(nombreCompleto).toUpperCase()} ${fmtDateTime()}`, M, y);
    y += lineH;

    return { y, total };
}

export async function generarPDF(factura, tipo = "A4") {
    try {
        const { width: W, height: H } = PAGE_SIZES[tipo] || PAGE_SIZES.A4;
        const cfg = LAYOUT[tipo] || LAYOUT.A4;
        const doc = new jsPDF({ unit: "mm", format: [W, H] });

        const activeUser = getActiveUser();
        const nombreCompleto = activeUser.nombreCompleto || `${activeUser.nombres} ${activeUser.apellidoPaterno}`;

        if (tipo === "A4") {
            renderFacturaA4(doc, factura, cfg, W, H, nombreCompleto);
        } else if (tipo === "t80mm") {
            renderFactura80mm(doc, factura, cfg, W, H, nombreCompleto);
        }

        doc.save(`${factura.tDocumento}_${factura.serie}-${factura.numero}.pdf`);
        const tipolbl = FORMAT_LABELS[tipo] || tipo;
        toast.success(`Se genero el PDF ${tipolbl}`);
    } catch (err) {
        console.error(err);
        toast.error("Error al generar PDF");
    }
}
