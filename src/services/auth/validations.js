import { patternEmail, patternClave } from "@constants/patternConstants";

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
