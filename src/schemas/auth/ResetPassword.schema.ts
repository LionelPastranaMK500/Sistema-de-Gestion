import { z } from "zod";

// --- PASO 1: Solicitar Código ---
// Refleja: InitiateRecoveryRequest
export const requestResetSchema = z.object({
  email: z.email("Debes ingresar un email válido"),
});

export type RequestResetSchemaType = z.infer<typeof requestResetSchema>;

// --- PASO 2: Cambiar Contraseña ---
// Refleja: ResetPasswordRequest
export const resetPasswordSchema = z
  .object({
    email: z.email("Email inválido"),
    code: z.string().min(1, "El código de verificación es obligatorio"),
    newPassword: z
      .string()
      .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Debes confirmar la contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
