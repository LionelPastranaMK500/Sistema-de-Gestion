// src/routes/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { getActiveUser } from "@services/auth/authServices";
import PublicLoader from "@components/Loaders/PublicLoader";
import useDelay from "@utils/redirectWithDelay.js"; // o @utils/useDelay.js

const PublicRoute = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const activeUser = getActiveUser();
        setUser(activeUser);
    }, []);

    const TOTAL_MS = 7000;     // tiempo total deseado
    const FADE_MS = 2000;     // mismo para aparecer/desaparecer (ajústalo si quieres)
    const HOLD_MS = Math.max(0, TOTAL_MS - 2 * FADE_MS);

    const gateDone = useDelay(HOLD_MS);
    const showLoader = !gateDone;

    const nodeRef = useRef(null);

    return (
        <>
            <CSSTransition
                in={showLoader}
                timeout={FADE_MS}      // coincide con CSS
                classNames="fade"
                unmountOnExit
                appear
                nodeRef={nodeRef}
            >
                <PublicLoader ref={nodeRef} />
            </CSSTransition>

            {!showLoader && (user ? <Navigate to="/welcome" replace /> : <Outlet />)}
        </>
    );
};

export default PublicRoute;
