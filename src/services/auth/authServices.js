function safeParse(key) {
    const raw = localStorage.getItem(key);
    if (!raw || raw === "undefined") return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error(`Error al parsear localStorage[${key}]`, e);
        return null;
    }
}

function setAuthToken(token) {
    localStorage.setItem("authToken", token);
}

export function getAuthToken() {
    return localStorage.getItem("authToken");
}

export function registerUser(userData) {
    const users = safeParse("users") || [];
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

    const users = safeParse("users") || [];
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

    const fakeToken = btoa(`${user.correo}:${Date.now()}`);
    setAuthToken(fakeToken);

    return { success: true, message: `Bienvenido ${user.nombres.split(" ")[0]} ${user.apellidoPaterno}`, user, token: fakeToken };
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

        const activeUser = safeParse("activeUser") || null;
        if (activeUser) {
            activeUser.empresa = empresa;

            const users = safeParse("users") || [];
            const idx = users.findIndex(u => u.correo === activeUser.correo);
            if (idx !== -1) {
                users[idx] = activeUser;
                localStorage.setItem("users", JSON.stringify(users));
            }

            localStorage.setItem("activeUser", JSON.stringify(activeUser));
        }

        const fakeToken = btoa(`${ruc}:${Date.now()}`);
        setAuthToken(fakeToken);

        return { success: true, message: "Empresa registrada correctamente", empresa, token: fakeToken };
    }
    return { success: false, message: "Credenciales de SUNAT inválidas" };
}

export function getActiveUser() {
    return safeParse("activeUser");
}

export function logoutUser() {
    localStorage.removeItem("activeUser");
    localStorage.removeItem("activeCompany");
    return { success: true, message: "Sesión cerrada" };
}

export function getActiveCompany() {
    return safeParse("activeCompany");
}

export function syncActiveCompany() {
    const activeUser = safeParse("activeUser");
    const activeCompany = safeParse("activeCompany");

    if (!activeUser) return null;
    if (!activeCompany || JSON.stringify(activeCompany) !== JSON.stringify(activeUser.empresa)) {
        localStorage.setItem("activeCompany", JSON.stringify(activeUser.empresa));
        return activeUser.empresa;
    }
    return activeCompany;
}

export function requestResetPassword(correo) {
    const correoNormalizado = String(correo || "").trim().toLowerCase();

    if (!correoNormalizado) {
        return { success: false, message: "El correo es obligatorio" };
    }

    const users = safeParse("users") || [];
    const user = users.find(u => u.correo === correoNormalizado);

    if (!user) {
        return { success: false, message: "Correo electronico no registrado" };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    localStorage.setItem("users", JSON.stringify(users));

    console.log(`Código ${correoNormalizado}: ${code}`);
    return { success: true, message: "Se envio un código de recuperación a tu correo" };
}

export function verifyResetCode(correo, code) {
    const users = safeParse("users") || [];
    const user = users.find(u => u.correo === String(correo).trim().toLowerCase());

    if (!user || user.resetCode !== code) {
        return { success: false, message: "Codigo incorrecto o expirado" };
    }
    return { success: true, message: "Codigo valido" };
}

export function resetPassword(correo, code, nuevaClave) {
    const users = safeParse("users") || [];
    const idx = users.findIndex(u => u.correo === String(correo).trim().toLowerCase());

    if (idx === -1 || users[idx].resetCode !== code) {
        return { success: false, message: "Codigo incorrecto o expirado" };
    }

    users[idx].clave = String(nuevaClave).trim();
    delete users[idx].resetCode;
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, message: "Contraseña actualizada correctamente" };
}
