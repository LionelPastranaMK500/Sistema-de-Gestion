import { z } from "zod";

export const clienteSchema = z.object({
  numeroRuc: z
    .string()
    .min(8, "El documento debe tener al menos 8 dígitos")
    .max(11, "El documento no puede exceder 11 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),

  nombreRazonSocial: z.string().min(1, "La razón social es obligatoria"),

  telefonoCelular: z.string().optional().or(z.literal("")),

  email: z.email("Correo inválido").optional().or(z.literal("")),

  direccionPrincipal: z.string().min(1, "La dirección es obligatoria"),

  observaciones: z.string().optional().or(z.literal("")),

  tipoClienteID: z.number().min(1, "Debes seleccionar un tipo de cliente"),

  ubigeoID: z.number().min(1, "Debes seleccionar un ubigeo"),
});

export type ClienteSchemaType = z.infer<typeof clienteSchema>;
