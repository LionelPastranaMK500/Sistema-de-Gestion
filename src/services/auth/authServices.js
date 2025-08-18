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
    return { success: true, message: "Usuario registrado" };
}
export function loginUser(correo, clave) {
    const correoNormalizado = String(correo || "").trim().toLowerCase();
    const claveNormalizada = String(clave || "").trim();

    if (!correoNormalizado || !claveNormalizada) {
        return { success: false, message: "Campos requeridos" };
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
export function getActiveUser() {
    return JSON.parse(localStorage.getItem("activeUser"));
}
export function logoutUser() {
    localStorage.removeItem("activeUser");
}
