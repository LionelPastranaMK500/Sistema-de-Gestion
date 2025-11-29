import { VentaGenerada } from "@/services/generadorData";
import { ConteoComprobantes } from "@/types/utils/documents";

export function contarComprobantes(
  data: VentaGenerada[],
  fechaInicio: Date | null = null,
  fechaFin: Date | null = null
): ConteoComprobantes {
  const conteo: ConteoComprobantes = {
    total: 0,
    facturas: 0,
    boletas: 0,
    notasCredito: 0,
    notasDebito: 0,
    proformas: 0,
    guiasRemision: 0,
  };

  const hoy = new Date();

  data.forEach((doc) => {
    if (fechaInicio && fechaFin) {
      const fechaDoc = new Date(doc.fecha);
      const fechaLimite = fechaFin > hoy ? hoy : fechaFin;

      if (fechaDoc < fechaInicio || fechaDoc > fechaLimite) return;
    }

    conteo.total++;
    const tipo = doc.tDocumento.toLowerCase();

    if (tipo.includes("factura")) conteo.facturas++;
    else if (tipo.includes("boleta")) conteo.boletas++;
    else if (tipo.includes("nota de crédito")) conteo.notasCredito++;
    else if (tipo.includes("nota de débito")) conteo.notasDebito++;
    else if (tipo.includes("proforma")) conteo.proformas++;
    else if (tipo.includes("guía de remisión")) conteo.guiasRemision++;
  });

  return conteo;
}
