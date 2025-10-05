// src/routes/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { getActiveUser } from "@services/auth/authServices";
import PublicLoader from "@components/Loaders/PublicLoader";
import useDelay from "@utils/redirectWithDelay.js";

const PublicRoute = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getActiveUser());
    }, []);

    const TOTAL_MS = 7000;
    const FADE_MS = 2000;
    const HOLD_MS = Math.max(0, TOTAL_MS - 2 * FADE_MS); // = 3000
    const VISIBLE_MS = FADE_MS + HOLD_MS;                  // = 5000  (2s in + 3s hold)

    // ⬅️ el loader estará montado VISIBLE_MS y luego hará fade-out por FADE_MS
    const gateDone = useDelay(VISIBLE_MS);
    const showLoader = !gateDone;

    const nodeRef = useRef(null);

    return (
        <>
            <CSSTransition
                in={showLoader}
                timeout={{ appear: FADE_MS, enter: FADE_MS, exit: FADE_MS }}
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
