import { loginUser } from "../authServices";

export const handleLogin = (form, navigate) => {
    const payload = {
        correo: String(form.correo || "").trim().toLowerCase(),
        clave: String(form.clave || "").trim(),
    };

    const res = loginUser(payload);

    if (!res.success) {
        return res;
    }
    navigate("/dashboard");
};
