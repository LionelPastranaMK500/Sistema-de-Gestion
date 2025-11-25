import { handleSunatAuth, handleLogout } from "@/services/auth/authLogic";
import { useFormHandler } from "@hooks/useFormHandler";
import ErrorText from "@/components/common/ErrorText";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validarSunat } from "@/services/auth/validations";
import { useSidebar } from "@utils/navigation/sidebarState";
import { getActiveCompany, getActiveUser } from "@services/auth/authServices";
import { useEffect, useState } from "react";

const SunatForm = () => {
  const navigate = useNavigate();
  const { setSidebarReady } = useSidebar();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const user = getActiveUser();
    const company = getActiveCompany();

    if (user?.empresa || company) {
      navigate("/welcome");
    } else {
      setShouldRender(true);
    }
  }, [navigate]);

  const { values, err, handleChange, handleSubmit } = useFormHandler(
    { ruc: "", usuarioSol: "", claveSol: "" },
    validarSunat,
    async (form) => {
      const res = await handleSunatAuth(form, navigate);
      if (res.success) {
        setSidebarReady(true);
      }
    }
  );

  if (!shouldRender) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60">
      <div className="relative bg-white shadow-2xl p-8 rounded-2xl w-full max-w-lg">
        <h2 className="mb-2 font-bold text-gray-800 text-2xl text-center">
          INGRESE SU CLAVE SOL
        </h2>
        <p className="mb-6 text-gray-500 text-sm text-center">
          Al ingresar tu <strong>CLAVE SOL</strong> se está autorizando su uso
          para dar de alta automáticamente a{" "}
          <span className="font-semibold">WOLFFUR</span> como su PSE en SUNAT.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="ruc"
              value={values.ruc}
              onChange={handleChange}
              placeholder="RUC"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-600 placeholder-gray-400"
            />
            {err.ruc && <ErrorText>{err.ruc}</ErrorText>}
          </div>
          <div>
            <input
              type="text"
              name="usuarioSol"
              value={values.usuarioSol}
              onChange={handleChange}
              placeholder="Usuario SOL"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-600 placeholder-gray-400"
            />
            {err.usuarioSol && <ErrorText>{err.usuarioSol}</ErrorText>}
          </div>
          <div>
            <input
              type="password"
              name="claveSol"
              value={values.claveSol}
              onChange={handleChange}
              placeholder="Clave SOL"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-600 placeholder-gray-400"
            />
            {err.claveSol && <ErrorText>{err.claveSol}</ErrorText>}
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg w-full font-medium text-white transition"
            >
              Registrar
            </button>
            <button
              type="button"
              onClick={() => handleLogout(navigate)}
              className="hover:bg-blue-50 py-2 border border-blue-600 rounded-lg w-full font-medium text-blue-600 transition"
            >
              Regresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SunatForm;
