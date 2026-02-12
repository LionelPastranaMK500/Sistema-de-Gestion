import { z } from "zod";

// Schema para el detalle (Items)
export const detalleVentaSchema = z.object({
  productoID: z.number().positive("Debe seleccionar un producto"),
  cantidadVenta: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
  precioVenta: z.number().min(0, "El precio no puede ser negativo"),
  totalVenta: z.number().min(0),
});

// Schema Maestro (Espejo de DocumentoCreateDto)
export const ventaCreateSchema = z.object({
  fechaEmision: z.string().min(1, "La fecha de emisión es obligatoria"),
  fechaVencimiento: z.string().optional(),
  total: z.number().min(0),

  // IDs obligatorios
  clienteID: z.number().positive("Debe seleccionar un cliente"),
  monedaID: z.number().positive("Seleccione una moneda"),
  tipoDocumentoID: z.number().positive("Seleccione tipo de comprobante"),

  // Campos que persisten en Zustand y se mapean al DTO
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional(),

  // Lista de detalles
  listaDetallesVenta: z
    .array(detalleVentaSchema)
    .min(1, "Debe agregar al menos un producto"),
});

export type VentaCreateSchemaType = z.infer<typeof ventaCreateSchema>;
