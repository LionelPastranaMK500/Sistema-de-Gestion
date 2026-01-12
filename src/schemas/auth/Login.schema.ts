import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Formato de correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
