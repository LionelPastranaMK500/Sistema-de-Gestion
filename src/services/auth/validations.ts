import { patternEmail, patternClave } from "@/constants/patterns";
import {
  LoginData,
  RegisterData,
  SunatData,
  ResetPassData,
  ValidationErrors,
} from "@/types/services/auth";

export type { LoginData, RegisterData, SunatData, ResetPassData };

export const validarLogin = (datos: LoginData): ValidationErrors => {
  const err: ValidationErrors = {};

  if (!datos.correo?.trim()) {
    err.correo = "El correo es obligatorio";
  } else if (!new RegExp(patternEmail).test(datos.correo)) {
    err.correo = "Correo inválido";
  }

  if (!datos.clave?.trim()) {
    err.clave = "La clave es obligatoria";
  } else if (!new RegExp(patternClave).test(datos.clave)) {
    err.clave =
      "La clave debe tener al menos 6 caracteres, incluyendo letras y números";
  }

  return err;
};

export const validarRegister = (datos: RegisterData): ValidationErrors => {
  const err: ValidationErrors = {};

  if (!datos.nombres?.trim()) err.nombres = "Nombre es obligatorio";
  if (!datos.apellidoPaterno?.trim())
    err.apellidoPaterno = "Apellido paterno es obligatorio";
  if (!datos.apellidoMaterno?.trim())
    err.apellidoMaterno = "Apellido materno es obligatorio";

  if (!datos.correo?.trim()) {
    err.correo = "Correo es obligatorio";
  } else if (!new RegExp(patternEmail).test(datos.correo)) {
    err.correo = "Correo inválido";
  }

  if (!datos.clave?.trim()) {
    err.clave = "La clave es obligatoria";
  } else if (!new RegExp(patternClave).test(datos.clave)) {
    err.clave =
      "La clave debe tener al menos 6 caracteres, incluyendo letras y números";
  }

  if (!datos.aceptaTerminos) {
    err.aceptaTerminos = "Debes aceptar los términos y condiciones";
  }

  return err;
};

export const validarSunat = (datos: SunatData): ValidationErrors => {
  const err: ValidationErrors = {};

  if (!datos.ruc?.trim()) {
    err.ruc = "El RUC es obligatorio";
  } else if (!/^\d{11}$/.test(datos.ruc)) {
    err.ruc = "El RUC debe tener 11 dígitos numéricos";
  }

  if (!datos.usuarioSol?.trim()) {
    err.usuarioSol = "El usuario SOL es obligatorio";
  }

  if (!datos.claveSol?.trim()) {
    err.claveSol = "La clave SOL es obligatoria";
  }

  return err;
};

export const validateResetPassword = (
  form: ResetPassData,
  step: number
): ValidationErrors | null => {
  const errors: ValidationErrors = {};
  if (step === 1) {
    if (!form.correo) errors.correo = "El correo es obligatorio";
    else if (!new RegExp(patternEmail).test(form.correo))
      errors.correo = "Correo inválido";
  } else {
    if (!form.codigo) errors.codigo = "El código es obligatorio";
    if (!form.nuevaClave)
      errors.nuevaClave = "La nueva contraseña es obligatoria";
    else if (form.nuevaClave.length < 6)
      errors.nuevaClave = "La contraseña debe tener al menos 6 caracteres";
  }
  return Object.keys(errors).length ? errors : null;
};
