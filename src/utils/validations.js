const validarLogin = (datos) =>{
    const err = {};

    if(!datos.correo.trim()) err.correo = "El correo es obligatorio";
    if(!datos.clave.trim()) err.clave= "La clave es obligatoria";

    return err;
};