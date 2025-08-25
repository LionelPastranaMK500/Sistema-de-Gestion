import jsPDF from "jspdf";
import { toast } from "react-toastify";

const LOGO = "/images/Logo_WolfFur.jpg";

const PAGE_SIZES = {
    ticket80mm: { width: 80, height: 150 },
    A4: { width: 210, height: 297 },
};

const fetchBase64 = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            toast.error(`Error al cargar imagen del logo (HTTP ${response.status})`);
            return null;
        }
        const blob = await response.blob();

        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => {
                toast.error("Error al convertir la imagen a Base64");
                reject(new Error("Error al convertir a base64"));
            };
            reader.readAsDataURL(blob);
        });
    } catch {
        toast.error("No se pudo cargar la imagen del logo");
        return null;
    }
};

export async function generarPDFT80(factura, tipo = "ticket80mm") {
    try {
        const { width, height } = PAGE_SIZES[tipo] || PAGE_SIZES.A4;

        const doc = new jsPDF({
            unit: "mm",
            format: [width, height],
        });

        const logoBase64 = await fetchBase64(LOGO);
        const margin = 10;
        let y = margin;

        if (logoBase64) {
            const logoWidth = 40;
            const logoHeight = 20;
            doc.addImage(logoBase64, "JPEG", (width - logoWidth) / 2, y, logoWidth, logoHeight);
            y += logoHeight + 5;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("BOLETA DE VENTA", width / 2, y, { align: "center" });
        y += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Lubricantes Claudia", margin, y);
        y += 5;
        doc.text("RUC: 99999999999", margin, y);
        y += 5;
        doc.text("Dirección: Av. Chihuaha  :v", margin, y);
        y += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Cliente:", margin, y);
        doc.setFont("helvetica", "normal");
        y += 5;
        doc.text(`Nombre: ${factura.cliente}`, margin, y);
        y += 5;
        doc.text(`RUC/DNI: ${factura.ruc}`, margin, y);
        y += 5;
        doc.text(`Comprobante: ${factura.tDocumento} N° ${factura.numero}`, margin, y);
        y += 5;

        const fecha = new Date(factura.fecha).toLocaleString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        doc.text(`Fecha: ${fecha}`, margin, y);
        y += 8;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Cant.", margin, y);
        doc.text("Descripción", margin + 20, y);
        doc.text("P. Unit", width - 45, y, { align: "left" });
        doc.text("Total", width - margin, y, { align: "right" });
        y += 4;
        doc.setDrawColor(0);
        doc.line(margin, y, width - margin, y);
        y += 3;

        doc.setFont("helvetica", "normal");

        let total = 0;
        if (Array.isArray(factura.items)) {
            factura.items.forEach((item) => {
                const itemTotal = item.cantidad * item.precio;
                total += itemTotal;

                doc.text(String(item.cantidad), margin, y);
                doc.text(item.descripcion, margin + 20, y);
                doc.text(`S/ ${item.precio.toFixed(2)}`, width - 45, y, { align: "left" });
                doc.text(`S/ ${itemTotal.toFixed(2)}`, width - margin, y, { align: "right" });

                y += 6;
            });
        } else {
            toast.warn("No se encontraron productos en la factura.");
            doc.text("Sin productos", margin, y);
            y += 6;
        }

        y += 2;
        doc.line(margin, y, width - margin, y);
        y += 4;

        doc.setFont("helvetica", "bold");
        doc.text("Total:", width - 45, y, { align: "left" });
        doc.text(`S/ ${total.toFixed(2)}`, width - margin, y, { align: "right" });
        y += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("¡Gracias por su preferencia!", width / 2, y, { align: "center" });

        doc.save(`${factura.tDocumento}_${factura.numero}.pdf`);
    } catch {
        toast.error("Ocurrió un error al generar el PDF");
    }
}

export async function generarPDFA4(factura, tipo = "A4") {
    try {
        const { width, height } = PAGE_SIZES[tipo] || PAGE_SIZES.A4;

        const doc = new jsPDF({
            unit: "mm",
            format: [width, height],
        });

        const logoBase64 = await fetchBase64(LOGO);
        const margin = 10;
        let y = margin;

        if (logoBase64) {
            const logoWidth = 40;
            const logoHeight = 20;
            doc.addImage(logoBase64, "JPEG", (width - logoWidth) / 2, y, logoWidth, logoHeight);
            y += logoHeight + 5;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("BOLETA DE VENTA", width / 2, y, { align: "center" });
        y += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Lubricantes Claudia", margin, y);
        y += 5;
        doc.text("RUC: 99999999999", margin, y);
        y += 5;
        doc.text("Dirección: Av. Chihuaha  :v", margin, y);
        y += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Cliente:", margin, y);
        doc.setFont("helvetica", "normal");
        y += 5;
        doc.text(`Nombre: ${factura.cliente}`, margin, y);
        y += 5;
        doc.text(`RUC/DNI: ${factura.ruc}`, margin, y);
        y += 5;
        doc.text(`Comprobante: ${factura.tDocumento} N° ${factura.numero}`, margin, y);
        y += 5;

        const fecha = new Date(factura.fecha).toLocaleString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        doc.text(`Fecha: ${fecha}`, margin, y);
        y += 8;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Cant.", margin, y);
        doc.text("Descripción", margin + 20, y);
        doc.text("P. Unit", width - 45, y, { align: "left" });
        doc.text("Total", width - margin, y, { align: "right" });
        y += 4;
        doc.setDrawColor(0);
        doc.line(margin, y, width - margin, y);
        y += 3;

        doc.setFont("helvetica", "normal");

        let total = 0;
        if (Array.isArray(factura.items)) {
            factura.items.forEach((item) => {
                const itemTotal = item.cantidad * item.precio;
                total += itemTotal;

                doc.text(String(item.cantidad), margin, y);
                doc.text(item.descripcion, margin + 20, y);
                doc.text(`S/ ${item.precio.toFixed(2)}`, width - 45, y, { align: "left" });
                doc.text(`S/ ${itemTotal.toFixed(2)}`, width - margin, y, { align: "right" });

                y += 6;
            });
        } else {
            toast.warn("No se encontraron productos en la factura.");
            doc.text("Sin productos", margin, y);
            y += 6;
        }

        y += 2;
        doc.line(margin, y, width - margin, y);
        y += 4;

        doc.setFont("helvetica", "bold");
        doc.text("Total:", width - 45, y, { align: "left" });
        doc.text(`S/ ${total.toFixed(2)}`, width - margin, y, { align: "right" });
        y += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("¡Gracias por su preferencia!", width / 2, y, { align: "center" });

        doc.save(`${factura.tDocumento}_${factura.numero}.pdf`);
    } catch {
        toast.error("Ocurrió un error al generar el PDF");
    }
}
