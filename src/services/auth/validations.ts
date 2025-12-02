import { z } from "zod";
import { patternEmail, patternClave } from "@/constants/patterns";
import {
  LoginData,
  RegisterData,
  SunatData,
  ResetPassData,
  ValidationErrors,
} from "@/types/services/auth";

export type { LoginData, RegisterData, SunatData, ResetPassData };

const validateWithZod = (schema: any, data: any): ValidationErrors => {
  const result = schema.safeParse(data);

  if (result.success) {
    return {};
  }

  const errors: ValidationErrors = {};
  result.error.issues.forEach((issue: any) => {
    const key = issue.path[0];
    errors[key] = issue.message;
  });

  return errors;
};

// --- SCHEMAS DE ZOD ---

const loginSchema = z.object({
  correo: z
    .string()
    .min(1, "El correo es obligatorio")
    .regex(new RegExp(patternEmail), "Correo inválido"),
  clave: z
    .string()
    .min(1, "La clave es obligatoria")
    .regex(
      new RegExp(patternClave),
      "La clave debe tener al menos 6 caracteres, letras y números"
    ),
});

const registerSchema = z.object({
  nombres: z.string().min(1, "Nombre es obligatorio"),
  apellidoPaterno: z.string().min(1, "Apellido paterno es obligatorio"),
  apellidoMaterno: z.string().min(1, "Apellido materno es obligatorio"),
  correo: z
    .string()
    .min(1, "Correo es obligatorio")
    .regex(new RegExp(patternEmail), "Correo inválido"),
  clave: z
    .string()
    .min(1, "La clave es obligatoria")
    .regex(
      new RegExp(patternClave),
      "La clave debe tener al menos 6 caracteres, letras y números"
    ),
  // [CORREGIDO] Usamos boolean().refine() en lugar de literal(true)
  // Esto acepta el tipo 'boolean' de tu interfaz, pero da error si es false.
  aceptaTerminos: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
});

const sunatSchema = z.object({
  ruc: z
    .string()
    .min(1, "El RUC es obligatorio")
    .regex(/^\d{11}$/, "El RUC debe tener 11 dígitos numéricos"),
  usuarioSol: z.string().min(1, "El usuario SOL es obligatorio"),
  claveSol: z.string().min(1, "La clave SOL es obligatoria"),
});

const resetStep1Schema = z.object({
  correo: z
    .string()
    .min(1, "El correo es obligatorio")
    .regex(new RegExp(patternEmail), "Correo inválido"),
});

const resetStep2Schema = z.object({
  codigo: z.string().min(1, "El código es obligatorio"),
  nuevaClave: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// --- FUNCIONES EXPORTABLES ---

export const validarLogin = (datos: LoginData): ValidationErrors => {
  return validateWithZod(loginSchema, datos);
};

export const validarRegister = (datos: RegisterData): ValidationErrors => {
  return validateWithZod(registerSchema, datos);
};

export const validarSunat = (datos: SunatData): ValidationErrors => {
  return validateWithZod(sunatSchema, datos);
};

export const validateResetPassword = (
  form: ResetPassData,
  step: number
): ValidationErrors | null => {
  const schema = step === 1 ? resetStep1Schema : resetStep2Schema;
  const errors = validateWithZod(schema, form);
  return Object.keys(errors).length ? errors : null;
};
