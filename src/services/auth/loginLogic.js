import { loginUser } from "../authServices";
import { toast } from "react-toastify";
import { redirectWithDelay } from "../../utils/redirectWithDelay";

export const handleLogin = async (form, navigate) => {
    const correo = String(form.correo || "").trim().toLowerCase();
    const clave = String(form.clave || "").trim();

    console.log({correo,clave})

    const res = loginUser(correo, clave);

    if (!res.success) {
        toast.error(res.message || "Error al iniciar sesion",{autoClose:1500});
        return { success: false, message: res.message };
    }

    const primerNombre = res.user.nombres.split(" ")[0];
    const aPaterno = res.user.apellidoPaterno;

    toast.success(`Bienvenido ${primerNombre} ${aPaterno}`,{autoClose: 1500},{hideProgressBar:false});
    redirectWithDelay(navigate, "/dashboard");
    return { success: true, user: res.user};
};
