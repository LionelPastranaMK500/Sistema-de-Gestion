export function registerUser(userData) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const correoNormalizado = String(userData.correo || "").trim().toLowerCase();

    if (!correoNormalizado || !userData.clave) {
        return { success: false, message: "Correo y clave son obligatorios" };
    }

    if (users.some(u => u.correo === correoNormalizado)) {
        return { success: false, message: "El correo ya está registrado" };
    }
    users.push({
        correo: correoNormalizado,
        clave: String(userData.clave || "").trim(),
        nombres: userData.nombres || "",
        apellidoPaterno: userData.apellidoPaterno || "",
        apellidoMaterno: userData.apellidoMaterno || "",
        empresa: null
    });

    localStorage.setItem("users", JSON.stringify(users));
    return { success: true, message: "Usuario registrado correctamente" };
}
export function loginUser(correo, clave) {
    const correoNormalizado = String(correo || "").trim().toLowerCase();
    const claveNormalizada = String(clave || "").trim();

    if (!correoNormalizado || !claveNormalizada) {
        return { success: false, message: "Correo y clave son obligatorios" };
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.correo === correoNormalizado);

    if (!user) {
        return { success: false, message: "Usuario no encontrado" };
    }

    if (user.clave !== claveNormalizada) {
        return { success: false, message: "Clave incorrecta" };
    }

    localStorage.setItem("activeUser", JSON.stringify(user));

    if (user.empresa) {
        localStorage.setItem("activeCompany", JSON.stringify(user.empresa));
    }

    return { success: true, message: `Bienvenido ${user.nombres.split(" ")[0]} ${user.apellidoPaterno}`, user };
}
export function loginSunatUser({ ruc, usuarioSol, claveSol }) {
    if (!ruc || !usuarioSol || !claveSol) {
        return { success: false, message: "Todos los campos son requeridos" };
    }
    if (ruc === "20123456789" && usuarioSol === "EQSIOF0C8" && claveSol === "10s3f4al") {
        const empresa = {
            ruc,
            usuarioSol,
            razonSocial: "Juan Santos Pimentel",
            sucursal: "Lubricantes Claudia"
        };

        localStorage.setItem("activeCompany", JSON.stringify(empresa));

        const activeUser = JSON.parse(localStorage.getItem("activeUser")) || null;
        if (activeUser) {
            activeUser.empresa = empresa;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const idx = users.findIndex(u => u.correo === activeUser.correo);
            if (idx !== -1) {
                users[idx] = activeUser;
                localStorage.setItem("users", JSON.stringify(users));
                console.log(users[idx]);
            }

            localStorage.setItem("activeUser", JSON.stringify(activeUser));
        }

        return { success: true, message: "Empresa registrada correctamente", empresa };
    }
    return { success: false, message: "Credenciales de SUNAT inválidas" };
}
export function getActiveUser() {
    return JSON.parse(localStorage.getItem("activeUser"));
}
export function logoutUser() {
    localStorage.removeItem("activeUser");
    localStorage.removeItem("activeCompany");
    return { success: true, message: "Sesión cerrada" };
}
export function getActiveCompany() {
    return JSON.parse(localStorage.getItem("activeCompany"));
}
export function syncActiveCompany() {
    const activeUser = JSON.parse(localStorage.getItem("activeUser")) || null;
    const activeCompany = JSON.parse(localStorage.getItem("activeCompany")) || null;

    if (activeUser?.empresa && !activeCompany) {
        localStorage.setItem("activeCompany", JSON.stringify(activeUser.empresa));
        return activeUser.empresa;
    }
    return activeCompany;
}
export function requestResetPassword(correo) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const correoNormalizado = String(correo).trim().toLowerCase();

    const user = users.find(u => u.correo === correoNormalizado);
    if (!user) {
        return { success: false, message: "Correo electronico no registrado" };
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetCode = code;
    localStorage.setItem("users", JSON.stringify(users));

    console.log(`Codigo ${correoNormalizado}: ${code}`);
    return { success: true, message: "Se envió un código de recuperación a tu correo" };
}
export function verifyResetCode(correo, code) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.correo === String(correo).trim().toLowerCase());

    if (!user || user.resetCode !== code) {
        return { success: false, message: "Codigo incorrecto o expirado" };
    }
    return { success: true, message: "Codigo valido" };
}
export function resetPassword(correo, code, nuevaClave) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const idx = users.findIndex(u => u.correo === String(correo).trim().toLowerCase());

    if (idx === -1 || users[idx].resetCode !== code) {
        return { success: false, message: "Codigo incorrecto o expirado" };
    }

    users[idx].clave = String(nuevaClave).trim();
    delete users[idx].resetCode;
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, message: "Contraseña actualizada correctamente" };
}