import { loginUser, registerUser, loginSunatUser } from "@services/auth/authServices";
import { toast } from "react-toastify";
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

        if (!payload.correo || !payload.clave) {
            toast.error("Correo y clave son obligatorios", { autoClose: 1500 });
            return { success: false, message: "Correo y clave son obligatorios" };
        }

        const res = await registerUser(payload);

        if (!res.success) {
            toast.error(res.message || "Error al registrar", { autoClose: 1500 });
            return { success: false, message: res.message };
        }

        toast.success("Usuario registrado correctamente", { autoClose: 1500 });
        redirectWithDelay(navigate, "/");
        return { success: true, message: "Usuario registrado" };
    } catch {
        toast.error("Error inesperado", { autoClose: 1500 });
        return { success: false, message: "Error inesperado" };
    }
};

export const handleLogin = async (form, navigate) => {
    const correo = String(form.correo || "").trim().toLowerCase();
    const clave = String(form.clave || "").trim();

    if (!correo || !clave) {
        toast.error("Correo y clave son obligatorios", { autoClose: 1500 });
        return { success: false, message: "Correo y clave son obligatorios" };
    }

    try {
        const res = await loginUser(correo, clave);

        if (!res.success) {
            toast.error(res.message || "Error al iniciar sesión", { autoClose: 1500 });
            return { success: false, message: res.message };
        }

        const primerNombre = res.user.nombres.split(" ")[0];
        const aPaterno = res.user.apellidoPaterno;

        toast.success(`Bienvenido ${primerNombre} ${aPaterno}`, { autoClose: 1500 });
        redirectWithDelay(navigate, "/welcome");

        return { success: true, user: res.user };
    } catch {
        toast.error("Error inesperado", { autoClose: 1500 });
        return { success: false, message: "Error inesperado" };
    }
};


export const handleSunatAuth = async (form, navigate) => {
    try {
        const ruc = String(form.ruc || "").trim();
        const usuarioSol = String(form.usuarioSol || "").trim();
        const claveSol = String(form.claveSol || "").trim();

        if (!ruc || !usuarioSol || !claveSol) {
            toast.error("Todos los campos son requeridos", { autoClose: 1500 });
            return { success: false, message: "Todos los campos son requeridos" };
        }

        const res = await loginSunatUser({ ruc, usuarioSol, claveSol });

        if (!res.success) {
            toast.error(res.message || "Error de autenticación", { autoClose: 1500 });
            return { success: false, message: res.message };
        }

        toast.success(res.message || "Se registró exitosamente la empresa", { autoClose: 1500 });
        redirectWithDelay(navigate, "/dashboard");
        return { success: true, data: res };
    } catch {
        toast.error("Error inesperado", { autoClose: 1500 });
        return { success: false, message: "Error inesperado" };
    }
};