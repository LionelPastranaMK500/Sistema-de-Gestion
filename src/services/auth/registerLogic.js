import { registerUser } from "../authServices";

export const handleRegister = (form, navigate) =>{
    const payload ={
        correo: String(form.correo || "").trim().toLowerCase(),
        clave: String(form.clave || "").trim(),
        nombres: String(form.nombres || "").trim(),
        apellidoPaterno: String(form.apellidoPaterno || "").trim(),
        apellidoMaterno: String(form.apellidoMaterno || "").trim(),
    };

    const res = registerUser(payload);

    if(!res.success){
        return res;
    }
    navigate("/");
}