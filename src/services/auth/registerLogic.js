import { registerUser } from "../authServices";
import { toast } from "react-toastify";
import { redirectWithDelay } from "../../utils/redirectWithDelay";

export const handleRegister = async (form, navigate) =>{
    const payload ={
        nombres: String(form.nombres || "").trim(),
        apellidoPaterno: String(form.apellidoPaterno || "").trim(),
        apellidoMaterno: String(form.apellidoMaterno || "").trim(),
        correo: String(form.correo || "").trim().toLowerCase(),
        clave: String(form.clave || "").trim(),
    };

    const res = registerUser(payload);

    if(!res.success){
        toast.error(res.message || "Error al registrar",{autoClose:1500});
        return { success: false, message: res.message };
    }

    toast.success("Usuario registrado correctamente",{autoClose:1500});
    redirectWithDelay(navigate,"/");
    return {success:true,message: "Usuario registrado"};
}