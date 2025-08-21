import { loginUser,registerUser, loginSunatUser} from "@services/auth/authServices";
import { toast } from "react-toastify";
import { redirectWithDelay } from "@utils/redirectWithDelay";

export const handleRegister = async (form, navigate) =>{
    const payload ={
        nombres: String(form.nombres || "").trim(),
        apellidoPaterno: String(form.apellidoPaterno || "").trim(),
        apellidoMaterno: String(form.apellidoMaterno || "").trim(),
        correo: String(form.correo || "").trim().toLowerCase(),
        clave: String(form.clave || "").trim(),
    };

    const res = await registerUser(payload);

    if(!res.success){
        toast.error(res.message || "Error al registrar",{autoClose:1500});
        return { success: false, message: res.message };
    }

    toast.success("Usuario registrado correctamente",{autoClose:1500});
    redirectWithDelay(navigate,"/");
    return {success:true,message: "Usuario registrado"};
}

export const handleLogin = async (form, navigate) => {
    const correo = String(form.correo || "").trim().toLowerCase();
    const clave = String(form.clave || "").trim();

    console.log({correo,clave})

    const res = await loginUser(correo, clave);

    if (!res.success) {
        toast.error(res.message || "Error al iniciar sesion",{autoClose:1500});
        return { success: false, message: res.message };
    }

    const primerNombre = res.user.nombres.split(" ")[0];
    const aPaterno = res.user.apellidoPaterno;

    toast.success(`Bienvenido ${primerNombre} ${aPaterno}`,{autoClose: 1500,hideProgressBar:false});
    redirectWithDelay(navigate, "/welcome");
    return { success: true, user: res.user};
};

export const handleSunatAuth = async (form,navigate) =>{
    const ruc = String(form.ruc || "").trim();
    const usuarioSol = String(form.usuarioSol || "").trim();
    const claveSol = String(form.claveSol || "").trim();
    const res = await loginSunatUser({ruc,usuarioSol,claveSol});

    if(!res.success){
        toast.error(res.message || "Error de autenticacion",{autoClose: 1500});
        return{success:false,message: res.message};
    }
    toast.success(res.message || "Se registro exitosamente la empresa",{autoClose: 1500});
    redirectWithDelay(navigate,"/dashboard");
    return{success: true,data: res};
}
