import { z } from "zod";

export const registerSchema = z
  .object({
    nombres: z.string().min(1, "El nombre es obligatorio"),
    apellidoPa: z.string().min(1, "El apellido paterno es obligatorio"),
    apellidoMa: z.string().min(1, "El apellido materno es obligatorio"),
    email: z.email("Debes ingresar un email válido"),

    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),

    confirmPassword: z.string().min(1, "Por favor confirma tu contraseña"),
    aceptaTerminos: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
