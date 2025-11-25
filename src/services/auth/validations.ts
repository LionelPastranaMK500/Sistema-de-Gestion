import { patternEmail, patternClave } from "@constants/patterns";

export const validarLogin = (datos) => {
    const err = {};

    if (!datos.correo?.trim()) {
        err.correo = "El correo es obligatorio";
    } else if (!new RegExp(patternEmail).test(datos.correo)) {
        err.correo = "correo invalido";
    }

    if (!datos.clave?.trim()) {
        err.clave = "La clave es obligatoria";
    } else if (!new RegExp(patternClave).test(datos.clave)) {
        err.clave = "La clave debe tener al menos 6 caracteres, incluyendo letras y numeros";
    }

    return err;
};

export const validarRegister = (datos) => {
    const err = {};

    if (!datos.nombres?.trim()) err.nombres = "nombre es obligatorio";
    if (!datos.apellidoPaterno?.trim()) err.apellidoPaterno = "apellido paterno es obligatorio";
    if (!datos.apellidoMaterno?.trim()) err.apellidoMaterno = "apellido materno es obligatorio";

    if (!datos.correo?.trim()) {
        err.correo = "correo es obligatorio";
    } else if (!new RegExp(patternEmail).test(datos.correo)) {
        err.correo = "correo invalido";
    }

    if (!datos.clave?.trim()) {
        err.clave = "La clave es obligatoria";
    } else if (!new RegExp(patternClave).test(datos.clave)) {
        err.clave = "La clave debe tener al menos 6 caracteres, incluyendo letras y numeros";
    }

    if (!datos.aceptaTerminos) {
        err.aceptaTerminos = "Debes aceptar los terminos y condiciones";
    }

    return err;
};

export const validarSunat = (datos) => {
    const err = {};

    if (!datos.ruc?.trim()) {
        err.ruc = "El RUC es obligatorio";
    } else if (!/^\d{11}$/.test(datos.ruc)) {
        err.ruc = "El RUC debe tener 11 dígitos numéricos";
    }

    if (!datos.usuarioSol?.trim()) {
        err.usuarioSol = "El usuario SOL es obligatorio";
    }

    if (!datos.claveSol?.trim()) {
        err.claveSol = "La clave SOL es obligatoria";
    }

    return err;
};

export const validateResetPassword = (form, step) => {
    const errors = {};
    if (step === 1) {
        if (!form.correo) errors.correo = "El correo es obligatorio";
        else if (!new RegExp(patternEmail).test(form.correo)) errors.correo = "Correo invalido";
    } else {
        if (!form.codigo) errors.codigo = "El codigo es obligatorio";
        if (!form.nuevaClave) errors.nuevaClave = "La nueva contraseña es obligatoria";
        else if (form.nuevaClave.length < 6) errors.nuevaClave = "La contraseña debe tener al menos 6 caracteres";
    }
    return Object.keys(errors).length ? errors : null;
};
