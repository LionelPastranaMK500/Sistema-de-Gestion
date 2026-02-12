import { z } from "zod";

export const guiaVentaSchema = z.object({
  serie: z.string().length(4, "La serie debe tener 4 caracteres (ej: T001)"),
  numero: z.string().min(1, "El número es obligatorio"),
  tipoGuia: z.enum(["REMITENTE", "TRANSPORTISTA"]),
  fechaEmision: z.string(), // ISO String
});

export type GuiaVentaSchemaType = z.infer<typeof guiaVentaSchema>;
