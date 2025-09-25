import { Navigate, Outlet } from "react-router-dom";
import { getActiveUser } from "@services/auth/authServices";
import PublicLoader from "@components/Loaders/PublicLoader";
import { useEffect, useState } from "react";

export default function PublicRoute() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const activeUser = getActiveUser();
        setUser(activeUser);
        setLoading(false);
    }, []);
    if (loading) {
        return <PublicLoader />;
    }
    if (user) {
        return <Navigate to="/welcome" replace />;
    }
    return <Outlet />;
}