export const validarLogin = (datos) => {
    const err = {};

    if (!datos.correo.trim()) err.correo = "El correo es obligatorio";
    if (!datos.clave.trim()) err.clave = "La clave es obligatoria";

    return err;
};

export const validarRegister = (datos) => {
    const err = {};

    if (!datos.nombres?.trim()) err.nombres = "El nombre es obligatorio";

    if (!datos.apellidoPaterno?.trim()) err.apellidoPaterno = "El apellido paterno es obligatorio";

    if (!datos.apellidoMaterno?.trim()) err.apellidoMaterno = "El apellido materno es obligatorio";

    if (!datos.correo?.trim()) {
        err.correo = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(datos.correo)) {
        err.correo = "Formato incorrecto";
    }

    if (!datos.clave?.trim()) {
        err.clave = "La clave es obligatoria";
    } else if (datos.clave.length < 6) {
        err.clave = "La clave debe tener al menos 6 caracteres";
    }

    if (!datos.aceptaTerminos) {
        err.aceptaTerminos = "Debes aceptar los terminos y condiciones";
    }

    return err;
};