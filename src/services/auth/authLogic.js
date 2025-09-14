import { loginUser, registerUser, loginSunatUser, logoutUser, requestResetPassword, verifyResetCode, resetPassword } from "@services/auth/authServices";
import { notifySuccess, notifyError } from "@utils/notify";
import { redirectWithDelay } from "@utils/redirectWithDelay";
// import axios from "axios";

export const handleRegister = async (form, navigate) => {
    try {
        const payload = {
            nombres: String(form.nombres || "").trim(),
            apellidoPaterno: String(form.apellidoPaterno || "").trim(),
            apellidoMaterno: String(form.apellidoMaterno || "").trim(),
            correo: String(form.correo || "").trim().toLowerCase(),
            clave: String(form.clave || "").trim(),
        };

        const res = await registerUser(payload);

        if (!res.success) {
            notifyError(res.message)
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

export const handleLogin = async (form, navigate) => {
    const correo = String(form.correo || "").trim().toLowerCase();
    const clave = String(form.clave || "").trim();

    try {
        const res = await loginUser(correo, clave);

        if (!res.success) {
            notifyError(res.message);
            return { success: false };
        }

        notifySuccess(res.message);
        redirectWithDelay(navigate, "/welcome");

        return { success: true, user: res.user };
    } catch {
        notifyError("Error inesperado");
        return { success: false };
    }
};

export const handleSunatAuth = async (form, navigate) => {
    try {
        const ruc = String(form.ruc || "").trim();
        const usuarioSol = String(form.usuarioSol || "").trim();
        const claveSol = String(form.claveSol || "").trim();

        const res = await loginSunatUser({ ruc, usuarioSol, claveSol });

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

export const handleLogout = (navigate) => {
    const res = logoutUser();
    if (res.success) {
        notifySuccess(res.message);
        redirectWithDelay(navigate, "/");
    } else {
        notifyError(res.message);
    }
    return res;
};

export const handleRequestReset = async (correo) => {
    try {
        const res = await requestResetPassword(correo);
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

export const handleVerifyResetCode = async (correo, code) => {
    try {
        const res = await verifyResetCode(correo, code);
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

export const handleResetPassword = async (correo, code, nuevaClave, navigate) => {
    try {
        const res = await resetPassword(correo, code, nuevaClave);
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