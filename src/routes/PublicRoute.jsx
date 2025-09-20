import { Navigate, Outlet } from "react-router-dom";
import { getActiveUser } from "@services/auth/authServices";

export default function PublicRoute() {
    const user = getActiveUser();
    if (user) {
        return <Navigate to="/welcome" replace />;
    }
    return <Outlet />;
}