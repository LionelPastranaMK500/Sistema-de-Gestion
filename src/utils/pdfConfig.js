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

export const PAGE_SIZES = {
    A4: { width: 210, height: 297 },
    t80mm: { width: 80, height: 297 },
};

const FORMAT_LABELS = {
    A4: "A4",
    t80mm: "80mm"
};

export const LAYOUT = {
    A4: {
        margin: 12,
        fs: { xs: 10, sm: 12, md: 14, lg: 16, xl: 22 },
        line: 8,
        bottomSafe: 50,
        // MODIFICADO: Ajuste de columnas para incluir DSCTO
        cols: (w, m) => ({
            num: m + 2,
            uni: m + 15,
            cod: m + 35,
            desc: m + 60,
            cant: w - 95,      // Reducido espacio
            dscto: w - 75,     // Nueva columna DSCTO
            punit: w - 50,     // Movido P. UNIT.
            total: w - m - 2, // Mantenido TOTAL
        }),
    },
    t80mm: {
        margin: 5,
        fs: { xs: 6, sm: 8, md: 9, lg: 11, xl: 14 },
        // MODIFICADO: Ajuste de columnas para incluir DSCTO en 80mm
        cols: (w, m) => ({
            desc: m + 2,
            dscto: w - 38,     // Nueva columna DSCTO
            punit: w - 24,     // Movido P. UNIT.
            total: w - m,
        }),
        line: 5.5,
        bottomSafe: 25,
    },
};

const money = (n) => ` ${Number(n || 0).toFixed(2)}`;
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

export function renderFacturaA4(doc, factura, cfg, W, H, nombreCompleto) {
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
    doc.text(`RUC ${factura.emisorRuc}`, centerX, yBox, { align: "center" });
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
    doc.text(`DOCUMENTO RUC/DNI ${factura.ruc || ""}`, M, y); y += lineH;
    doc.text(`CLIENTE ${factura.cliente || ""}`, M, y); y += lineH;
    doc.text(`DIRECCIÓN ${factura.direccion || ""}`, M, y);
    let yRight = y - 2 * lineH;
    doc.text(`FECHA EMISIÓN ${fmtDate(factura.fecha)}`, W - M, yRight, { align: "right" });
    doc.text("FECHA VENCIMIENTO -", W - M, yRight + lineH, { align: "right" });
    doc.text("MONEDA SOLES", W - M, yRight + 2 * lineH, { align: "right" });
    y = Math.max(y, yRight + 3 * lineH) + lineH + 2;

    //items
    let totalItemsFinal = 0; 
    let totalDescuentoItems = 0; 
    
    doc.setFont("helvetica", "bold").setFontSize(fs.sm);
    doc.text("Nº", cols.num, y);
    doc.text("UNIDAD", cols.uni, y);
    doc.text("CÓDIGO", cols.cod, y);
    doc.text("DESCRIPCIÓN", cols.desc, y);
    doc.text("CANT.", cols.cant, y, { align: "right" });
    // NUEVA COLUMNA
    doc.text("DSCTO.", cols.dscto, y, { align: "right" }); 
    doc.text("P. UNIT.", cols.punit, y, { align: "right" }); 
    doc.text("TOTAL", cols.total, y, { align: "right" });

    y += 2; doc.line(M, y, W - M, y); y += lineH;

    factura.items.forEach((it, idx) => {
        // Usamos los campos precalculados del hook
        const totalConDescuento = it.totalFinal || 0; // Total final por item
        const itemDiscount = it.descuentoAplicado || 0;

        totalItemsFinal += totalConDescuento;
        totalDescuentoItems += itemDiscount;

        const precioUnitario = (it.precio || 0); // Precio original para la columna P.UNIT.
        
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
                // NUEVA COLUMNA: Descuento Aplicado al ítem
                doc.text(itemDiscount.toFixed(2), cols.dscto, y, { align: "right" });
                // Muestra precio unitario original (sin dscto)
                doc.text(precioUnitario.toFixed(2), cols.punit, y, { align: "right" }); 
                // Muestra total ya con descuento
                doc.text(totalConDescuento.toFixed(2), cols.total, y, { align: "right" }); 
            } else {
                y += lineH;
                doc.text(line, cols.desc, y);
            }
        });
        y += lineH;
    });

    y += 2; doc.line(cfg.margin, y, W - cfg.margin, y); y += cfg.line;

    // Calculamos el gravado e IGV basado en el total final (ya descontado)
    const totalFinal = factura.total; // Usamos el total final que ya viene de VentasView
    const gravado = totalFinal / 1.18; // Gravado (asumiendo todo gravado)
    const igv = totalFinal - gravado;
    
    // Si hay descuento global, lo mostramos
    if (totalDescuentoItems > 0) {
        doc.setFont("helvetica", "bold");
        const labelDsctoX = W - 65;
        const valueDsctoX = W - cfg.margin;
        doc.text("DESCUENTO GLOBAL S/", labelDsctoX, y);
        doc.text(money(totalDescuentoItems), valueDsctoX, y, { align: "right" }); y += cfg.line;
    }


    //totales
    doc.setFont("helvetica", "italic", "bold").setFontSize(cfg.fs.sm + 2);
    doc.text(`SON: ${amountToWords(totalFinal)}`, W / 2, y, { align: "center" });
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
    doc.text(money(totalFinal), valueX, y, { align: "right" }); y += cfg.line + 2;

    doc.setFont("helvetica", "normal").setFontSize(cfg.fs.xs);
    doc.text(`USUARIO ${nombreCompleto.toUpperCase()} - ${fmtDateTime()}`, cfg.margin, y); y += cfg.line;
    doc.text("CONDICIÓN DE PAGO: ", cfg.margin, y); y += cfg.line;
    doc.setFont("helvetica", "bold").text("CUENTAS BANCARIAS:", cfg.margin, y); y += cfg.line;
    // Aumentar un poco el tamaño y poner en negrita las cuentas bancarias
    doc.setFont("helvetica", "bold").setFontSize(cfg.fs.xs + 1);
    BANKS.forEach((b) => { doc.text(b, cfg.margin + 2, y); y += cfg.line; });

    return { y, total: totalFinal };
}

export function renderFactura80mm(doc, factura, cfg, W, H, nombreCompleto) {
    const M = cfg.margin;
    const fs = cfg.fs;
    const lineH = cfg.line;
    const cols = cfg.cols(W, M);

    const PUNIT_BUMP_MM = 4;                    
    const punitX = cols.punit; // Usando el valor de cols.punit modificado
    const totalX = cols.total;                 
    // Usando el valor de cols.dscto modificado
    const dsctoX = cols.dscto;
    
    // Ajuste para que el texto de descripción no pise las nuevas columnas
    const PUX = totalX - 14;                    
    const DESC_SAFE_GAP = 5;                    
    // La descripción debe terminar antes de DSCTO
    const descWidth = dsctoX - cols.desc - DESC_SAFE_GAP;   
    

    let y = M;
    const ensureSpace = (need = 0) => {
        if (y > H - (cfg.bottomSafe + need)) {
            doc.addPage([W, H], "portrait");
            y = M;
        }
    };

    y += 5;
    doc.setFont("helvetica", "bold").setFontSize(16); 

    const empresa = "LUBRICANTES CLAUDIA";
    const safeWidth = W - 2 * M;
    doc.text(empresa, W / 2, y, { align: "center", charSpace: -0.3, renderingMode: "fill" });
    doc.text(empresa, W / 2 + 0.1, y + 0.1, { align: "center", charSpace: -0.3, renderingMode: "fill" });
    y += lineH * 1.5;

    doc.setFont("helvetica", "normal").setFontSize(fs.md);
    doc.text(`DE: ${nombreCompleto.toUpperCase()}`, W / 2, y, { align: "center" });
    y += lineH;

    doc.setFont("helvetica", "bold").setFontSize(fs.lg + 2);
    doc.text(`RUC ${factura.emisorRuc}`, W / 2, y, { align: "center", charSpace: -0.3, renderingMode: "fill" });
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
    doc.text(`${(factura.tDocumento).toUpperCase()}`, W / 2, y, { align: "center", charSpace: -0.0, renderingMode: "fill" });
    y += lineH;

    doc.setFont("helvetica", "bold").setFontSize(fs.lg + 2);
    doc.text(`${factura.serie}-${String(factura.numero).padStart(6, "0")}`, W / 2 + 0.1, y + 0.1, { align: "center", charSpace: -0.3, renderingMode: "fill" });
    y += lineH * 2;

    doc.setFont("helvetica", "bold").setFontSize(fs.sm + 2);
    const clientLeftWidth = (W / 2) - M;        
    const clientRightStart = M + clientLeftWidth + 2; 
    const clientRightWidth = W - clientRightStart - M;

    doc.text("DOCUMENTO RUC:", M, y);
    doc.setFont("helvetica", "normal");
    const rucText = `${factura.ruc || ""}`;
    const rucLines = doc.splitTextToSize(rucText, clientRightWidth);
    rucLines.forEach((line, i) => {
        doc.text(line, clientRightStart, y + (i * lineH));
    });
    y += Math.max(1, rucLines.length) * lineH * 1.5;

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
    let totalItemsFinal = 0; 
    let totalDescuentoItems = 0; 
    
    doc.setFont("helvetica", "bold").setFontSize(fs.sm + 1);
    doc.text("DESCRIPCIÓN", cols.desc, y, { charSpace: -0.3, renderingMode: "fill" });
    // NUEVA COLUMNA
    doc.text("DSCTO.", dsctoX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
    doc.text("P/U", punitX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
    doc.text("TOTAL", totalX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
    y += 2; doc.line(M, y, W - M, y); y += lineH;

    factura.items.forEach((it) => {
        // Usamos los campos precalculados del hook
        const cantidad = Number(it.cantidad || 0);
        const precioUnitario = (it.precio || 0); // Precio original
        const totalConDescuento = it.totalFinal || 0; 
        const itemDiscount = it.descuentoAplicado || 0;
        
        totalItemsFinal += totalConDescuento;
        totalDescuentoItems += itemDiscount;
        
        // La descripción ahora ocupa menos espacio y termina antes de DSCTO.
        const desc = `[${cantidad.toFixed(2)}] ${it.descripcion}`;
        const lines = doc.splitTextToSize(desc, descWidth);

        lines.forEach((line, i) => {
            ensureSpace(lineH);
            doc.setFont("helvetica", "normal").setFontSize(fs.xs + 3);
            if (i === 0) {
                doc.text(line, cols.desc, y);
                // NUEVA COLUMNA: Descuento Aplicado al ítem
                doc.text(itemDiscount.toFixed(2), dsctoX, y, { align: "right" }); 
                // Muestra precio unitario original
                doc.text(precioUnitario.toFixed(2), punitX, y, { align: "right" }); 
                // Muestra total ya con descuento
                doc.text(totalConDescuento.toFixed(2), totalX - 2, y, { align: "right" }); 
            } else {
                doc.text(line, cols.desc, y);
            }
            y += lineH; // El incremento de línea va después de cada línea de descripción
        });
    });
    y += 2; doc.line(M, y, W - M, y); y += lineH;

    //totales
    const totalFinal = factura.total; // Usamos el total final que ya viene de VentasView
    const gravado = totalFinal / 1.18; // Gravado (asumiendo todo gravado)
    const igv = totalFinal - gravado;

    doc.setFont("helvetica", "italic", "bold").setFontSize(fs.xs + 2);
    const amountInWords = `SON ${amountToWords(totalFinal)}`;
    ensureSpace(lineH);
    doc.splitTextToSize(amountInWords, safeWidth).forEach(line => {
        doc.text(line, M, y, { charSpace: -0.3, renderingMode: "fill" });
        y += lineH;
    });

    if (totalDescuentoItems > 0) {
        doc.setFont("helvetica", "bold").setFontSize(fs.sm);
        ensureSpace(lineH);
        doc.text("DESCUENTO GLOBAL S/:", punitX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
        doc.text(money(totalDescuentoItems), totalX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
        y += lineH;
    }

    doc.setFont("helvetica", "bold").setFontSize(fs.sm);
    const totales = [
        ["GRAVADO S/:", money(gravado)],
        ["I.G.V. 18% S/:", money(igv)],
    ];
    totales.forEach(([label, value]) => {
        ensureSpace(lineH);
        doc.text(label, punitX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
        doc.text(value, totalX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
        y += lineH;
    });

    doc.setFontSize(fs.md);
    ensureSpace(lineH);
    doc.text("TOTAL S/:", punitX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
    doc.text(money(totalFinal), totalX, y, { align: "right", charSpace: -0.3, renderingMode: "fill" });
    y += lineH * 2;

    doc.setFont("helvetica", "normal").setFontSize(fs.xs + 1);
    doc.text(`USUARIO ${(nombreCompleto).toUpperCase()} ${fmtDateTime()}`, M, y);
    y += lineH;

    return { y, total: totalFinal };
}

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

export async function generarPDF(factura, tipo = "A4") {
    try {
        const { width: W, height: H } = PAGE_SIZES[tipo] || PAGE_SIZES.A4;
        const cfg = LAYOUT[tipo] || LAYOUT.A4;
        const doc = new jsPDF({ unit: "mm", format: [W, H] });

        const activeUser = getActiveUser();
        const nombreCompleto = activeUser.nombreCompleto || `${activeUser.nombres} ${activeUser.apellidoPaterno}`;

        if (tipo === "A4") {
            renderFacturaA4(doc, factura, cfg, W, H, nombreCompleto);
            console.log(doc, factura, cfg, W, H, nombreCompleto)
        } else if (tipo === "t80mm") {
            renderFactura80mm(doc, factura, cfg, W, H, nombreCompleto);
            console.log(doc, factura, cfg, W, H, nombreCompleto)
        }

        doc.save(`${factura.tDocumento}_${factura.serie}-${factura.numero}.pdf`);
        const tipolbl = FORMAT_LABELS[tipo] || tipo;
        toast.success(`Se genero el PDF ${tipolbl}`);
    } catch (err) {
        console.error(err);
        toast.error("Error al generar PDF");
    }
}