import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Imports de infraestructura existente
import useAuthStore from "@/stores/authStore";
import { useSidebar } from "@/utils/navigation/sidebarState";
import ErrorText from "@/components/common/ErrorText";

// =============================================================================
// 1. ZONA DE DEFINICIÓN LOCAL (DTOs y Schemas Mock)
// =============================================================================
// Mantenemos esto aquí para no ensuciar la arquitectura global hasta que el Backend responda.

const sunatSchema = z.object({
  ruc: z
    .string()
    .length(11, "El RUC debe tener 11 dígitos")
    .regex(/^(10|20)\d{9}$/, "RUC inválido (debe empezar con 10 o 20)"),
  usuarioSol: z.string().min(3, "El usuario SOL es obligatorio"),
  claveSol: z.string().min(3, "La clave SOL es obligatoria"),
});

type SunatSchemaType = z.infer<typeof sunatSchema>;

// =============================================================================
// 2. COMPONENTE PRINCIPAL
// =============================================================================

const SunatForm = () => {
  const navigate = useNavigate();
  const { setSidebarReady } = useSidebar();
  const [shouldRender, setShouldRender] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store de Auth
  const { user, logout: logoutAction } = useAuthStore();

  // --- Lógica de Protección de Ruta ---
  useEffect(() => {
    // Si no hay usuario, devolver al login
    if (!useAuthStore.getState().isAuthenticated) {
      navigate("/");
      return;
    }

    // Si ya tuviera empresa configurada (hipotético), saltar al dashboard
    if (user && (user as any).empresa) {
      navigate("/dashboard");
    } else {
      setShouldRender(true);
    }
  }, [navigate, user]);

  // --- React Hook Form + Zod ---
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SunatSchemaType>({
    resolver: zodResolver(sunatSchema),
    defaultValues: {
      ruc: "",
      usuarioSol: "",
      claveSol: "",
    },
  });

  // --- Handler del Submit (MOCK) ---
  const onSubmit = async (data: SunatSchemaType) => {
    setIsSubmitting(true);

    // SIMULACIÓN DE LLAMADA AL BACKEND
    // Aquí "guardaríamos" las credenciales y habilitaríamos la empresa
    console.log("⚡ [MOCK] Enviando credenciales SUNAT al backend:", data);

    setTimeout(() => {
      // 1. Simulamos éxito
      // 2. Habilitamos el Sidebar (estado global de navegación)
      setSidebarReady(true);

      // 3. Redirigimos al Dashboard
      navigate("/dashboard");
      setIsSubmitting(false);
    }, 1500); // Pequeño delay para realismo
  };

  // --- Handler de Logout ---
  const handleLogout = () => {
    logoutAction();
    navigate("/");
  };

  if (!shouldRender) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white shadow-2xl p-8 rounded-2xl w-full max-w-lg">
        {/* Encabezado */}
        <h2 className="mb-2 font-bold text-gray-800 text-2xl text-center">
          INGRESE SU CLAVE SOL
        </h2>
        <p className="mb-6 text-gray-500 text-sm text-center">
          Al ingresar tu <strong>CLAVE SOL</strong> se está autorizando su uso
          para dar de alta automáticamente a{" "}
          <span className="font-semibold text-blue-600">WOLFFUR</span> como su
          PSE en SUNAT.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* RUC */}
          <div>
            <input
              type="text"
              placeholder="RUC"
              maxLength={11}
              {...register("ruc")}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 w-full text-gray-600 placeholder-gray-400 transition-all ${
                errors.ruc
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.ruc && <ErrorText>{errors.ruc.message}</ErrorText>}
          </div>

          {/* Usuario SOL */}
          <div>
            <input
              type="text"
              placeholder="Usuario SOL"
              {...register("usuarioSol")}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 w-full text-gray-600 placeholder-gray-400 transition-all ${
                errors.usuarioSol
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.usuarioSol && (
              <ErrorText>{errors.usuarioSol.message}</ErrorText>
            )}
          </div>

          {/* Clave SOL */}
          <div>
            <input
              type="password"
              placeholder="Clave SOL"
              {...register("claveSol")}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 w-full text-gray-600 placeholder-gray-400 transition-all ${
                errors.claveSol
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.claveSol && (
              <ErrorText>{errors.claveSol.message}</ErrorText>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-between gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-2 rounded-lg w-full font-medium text-white transition ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Validando..." : "Registrar"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isSubmitting}
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
