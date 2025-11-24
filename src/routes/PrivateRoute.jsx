import { Navigate, Outlet } from "react-router-dom";
import { getActiveUser, syncActiveCompany } from "@services/auth/authServices";

const PrivateRoute = () => {
    const user = getActiveUser();
    if (!user) {
        return <Navigate to="/" replace />
    }
    syncActiveCompany();
    return <Outlet />
}

export default PrivateRoute;
