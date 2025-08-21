import { handleSunatAuth } from "@services/auth/authLogic";
import { useFormHandler } from "@hooks/useFormHandler";
import ErrorText from "@components/ErrorText";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validarSunat } from "@services/auth/validations";
import { useSidebar } from "@utils/sidebarState";

export default function SunatForm() {
    const navigate = useNavigate();
    const { setSidebarReady } = useSidebar();

    const { values, err, handleChange, handleSubmit } = useFormHandler(
        { ruc: "", usuarioSol: "", claveSol: "" },
        validarSunat,
        (form) => {
            handleSunatAuth(form, navigate).then((res) => {
                if (res.success) {
                    toast.success(res.message);
                    setSidebarReady(true);
                } else {
                    toast.error(res.message);
                }
            });
        }
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            {/* Card principal */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
                {/* Título */}
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    INGRESE SU CLAVE SOL
                </h2>
                {/* Texto aclaratorio */}
                <p className="text-sm text-gray-500 text-center mb-6">
                    Al ingresar tu <strong>CLAVE SOL</strong> se está autorizando su uso
                    para dar de alta automáticamente a{" "}
                    <span className="font-semibold">WOLFFUR</span> como su PSE en SUNAT.
                </p>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="ruc"
                            value={values.ruc}
                            onChange={handleChange}
                            placeholder="RUC"
                            className="w-full border rounded-lg px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full border rounded-lg px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full border rounded-lg px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {err.claveSol && <ErrorText>{err.claveSol}</ErrorText>}
                    </div>

                    {/* Botones */}
                    <div className="flex justify-between gap-4 pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Registrar
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
                        >
                            Regresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
