import {
  loginUser,
  registerUser,
  loginSunatUser,
  logoutUser,
  requestResetPassword,
  verifyResetCode,
  resetPassword,
  AuthUser,
} from "@/services/auth/authServices";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";
import { redirectWithDelay } from "@/utils/navigation/redirectWithDelay";
import { NavigateFunction } from "react-router-dom";

interface LogicResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  data?: any;
}

export const handleRegister = async (
  form: any,
  navigate: NavigateFunction
): Promise<LogicResponse> => {
  try {
    const payload: AuthUser = {
      nombres: String(form.nombres || "").trim(),
      apellidoPaterno: String(form.apellidoPaterno || "").trim(),
      apellidoMaterno: String(form.apellidoMaterno || "").trim(),
      correo: String(form.correo || "")
        .trim()
        .toLowerCase(),
      clave: String(form.clave || "").trim(),
    };

    const res = registerUser(payload);

    if (!res.success) {
      notifyError(res.message);
      return { success: false };
    }

    notifySuccess(res.message);
    redirectWithDelay(navigate, "/");
    return { success: true };
  } catch {
    notifyError("Error inesperado");
    return { success: false };
  }
};

export const handleLogin = async (
  form: any,
  navigate: NavigateFunction
): Promise<LogicResponse> => {
  const correo = String(form.correo || "")
    .trim()
    .toLowerCase();
  const clave = String(form.clave || "").trim();

  try {
    const res = loginUser(correo, clave);

    if (!res.success) {
      notifyError(res.message);
      return { success: false };
    }

    notifySuccess(res.message);
    redirectWithDelay(navigate, "/dashboard");

    return { success: true, user: res.user };
  } catch {
    notifyError("Error inesperado");
    return { success: false };
  }
};

export const handleSunatAuth = async (
  form: any,
  navigate: NavigateFunction
): Promise<LogicResponse> => {
  try {
    const ruc = String(form.ruc || "").trim();
    const usuarioSol = String(form.usuarioSol || "").trim();
    const claveSol = String(form.claveSol || "").trim();

    const res = loginSunatUser({ ruc, usuarioSol, claveSol });

    if (!res.success) {
      notifyError(res.message);
      return { success: false, message: res.message };
    }

    notifySuccess(res.message);
    redirectWithDelay(navigate, "/dashboard");
    return { success: true, data: res };
  } catch {
    notifyError("Error inesperado");
    return { success: false };
  }
};

export const handleLogout = (navigate: NavigateFunction) => {
  const res = logoutUser();
  if (res.success) {
    notifySuccess(res.message);
    redirectWithDelay(navigate, "/");
  } else {
    notifyError(res.message);
  }
  return res;
};

export const handleRequestReset = async (
  correo: string
): Promise<LogicResponse> => {
  try {
    const res = requestResetPassword(correo);
    if (!res.success) {
      notifyError(res.message);
      return { success: false };
    }
    notifySuccess(res.message);
    return { success: true };
  } catch {
    notifyError("Error inesperado");
    return { success: false };
  }
};

export const handleVerifyResetCode = async (
  correo: string,
  code: string
): Promise<LogicResponse> => {
  try {
    const res = verifyResetCode(correo, code);
    if (!res.success) {
      notifyError(res.message);
      return { success: false };
    }
    notifySuccess(res.message);
    return { success: true };
  } catch {
    notifyError("Error inesperado");
    return { success: false };
  }
};

export const handleResetPassword = async (
  correo: string,
  code: string,
  nuevaClave: string,
  navigate: NavigateFunction
): Promise<LogicResponse> => {
  try {
    const res = resetPassword(correo, code, nuevaClave);
    if (!res.success) {
      notifyError(res.message);
      return { success: false };
    }
    notifySuccess(res.message);
    redirectWithDelay(navigate, "/");
    return { success: true };
  } catch {
    notifyError("Error inesperado");
    return { success: false };
  }
};
