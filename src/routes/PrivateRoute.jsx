import { Navigate, Outlet } from "react-router-dom";
import { getActiveUser, syncActiveCompany } from "@services/auth/authServices";

export default function PrivateRoute() {
    const user = getActiveUser();
    if (!user) {
        return <Navigate to="/" replace />
    }
    syncActiveCompany();
    return <Outlet />
}