export function registerUser(userData) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const correoNormalizado = String(userData.correo || "").trim().toLowerCase();

    if (users.some(u => u.correo === correoNormalizado)) {
        return { success: false, message: "Correo registrado" };
    }

    users.push({
        correo: correoNormalizado,
        clave: String(userData.clave || "").trim(),
        nombres: userData.nombres || "",
        apellidoPaterno: userData.apellidoPaterno || "",
        apellidoMaterno: userData.apellidoMaterno || ""
    });

    localStorage.setItem("users", JSON.stringify(users));
    return { success: true };
}
export function loginUser(correo, clave) {
    const correoNormalizado = String(correo || "").trim().toLowerCase();
    const claveNormalizada = String(clave || "").trim();

    if (!correoNormalizado || !claveNormalizada) {
        return { success: false};
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.correo === correoNormalizado);

    if (!user) {
        return { success: false, message: "Correo no registrado" };
    }

    if (user.clave !== claveNormalizada) {
        return { success: false, message: "Contraseña incorrecta" };
    }

    localStorage.setItem("activeUser", JSON.stringify(user));
    return { success: true, user };
}
export function loginSunatUser({ ruc, usuarioSol, claveSol }) {
    if (!ruc || !usuarioSol || !claveSol) {
        return { success: false, message: "Todo los campos son requeridos" };
    }
    if (ruc === "20123456789" && usuarioSol === "EQSIOF0C8" && claveSol === "10s3f4al") {
        return { success: true, message: "Empresa registrada" };
    }
    return {success:false,message:"Credenciales invalidas"};
}
export function getActiveUser() {
    return JSON.parse(localStorage.getItem("activeUser"));
}
export function logoutUser() {
    localStorage.removeItem("activeUser");
}
