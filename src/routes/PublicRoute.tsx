import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { getActiveUser, AuthUser } from "@/services/auth/authServices";
import PublicLoader from "@/components/feedback/PublicLoader";
import useDelay from "@/utils/navigation/redirectWithDelay";

const PublicRoute = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getActiveUser());
  }, []);

  const TOTAL_MS = 7000;
  const FADE_MS = 2000;
  // Math.max retorna number, así que HOLD_MS es number
  const HOLD_MS = Math.max(0, TOTAL_MS - 2 * FADE_MS);
  const VISIBLE_MS = FADE_MS + HOLD_MS;

  const gateDone = useDelay(VISIBLE_MS);
  const showLoader = !gateDone;

  // Referencia tipada correctamente para un elemento DIV
  const nodeRef = useRef<HTMLDivElement>(null);

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
        {/* Pasamos la ref al componente PublicLoader. 
            PublicLoader debe usar forwardRef para esto. */}
        <PublicLoader ref={nodeRef} />
      </CSSTransition>

      {!showLoader && (user ? <Navigate to="/welcome" replace /> : <Outlet />)}
    </>
  );
};

export default PublicRoute;
