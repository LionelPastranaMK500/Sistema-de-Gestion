import { z } from "zod";

export const detalleVentaSchema = z.object({
  cantidadVenta: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
  precioVenta: z.number().min(0, "El precio no puede ser negativo"),
  totalVenta: z.number().min(0),
  productoID: z.number().positive("Debe seleccionar un producto"),
  codigoProducto: z.string().optional(),
  nombreProducto: z.string().optional(),
});

export type DetalleVentaSchemaType = z.infer<typeof detalleVentaSchema>;
