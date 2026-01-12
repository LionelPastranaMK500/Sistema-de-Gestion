import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthMutations } from "@/hooks/auth/useAuthMutations";
import {
  registerSchema,
  RegisterSchemaType,
} from "@/schemas/auth/Register.schema";
import ErrorText from "@/components/common/ErrorText";

const RegisterForm = () => {
  const { registerUser, isRegisterPending } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombres: "",
      apellidoPa: "",
      apellidoMa: "",
      email: "",
      password: "",
      confirmPassword: "",
      aceptaTerminos: false,
    },
  });

  const onSubmit = (data: RegisterSchemaType) => {
    registerUser({
      nombres: data.nombres,
      apellidoPa: data.apellidoPa,
      apellidoMa: data.apellidoMa,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden">
      {/* --- ASIDE (Sin cambios visuales) --- */}
      <aside className="hidden relative md:flex flex-col justify-center items-center bg-blue-700 w-1/2 overflow-hidden text-white">
        <div className="top-6 left-6 z-10 absolute">
          <img
            src="/images/Logo_WolfFur.webp"
            alt="Logo"
            className="h-20 object-contain"
          />
        </div>

        <div className="z-10 relative px-10 text-center -translate-x-6 transform">
          <h2 className="mb-4 font-bold text-3xl">¿Ya tienes cuenta?</h2>
          <Link
            to="/"
            className="hover:bg-white px-6 py-2 border border-white rounded hover:text-blue-700 transition"
          >
            INICIA SESIÓN
          </Link>
        </div>

        <div
          className="top-0 right-0 absolute bg-white w-24 md:w-20 h-full pointer-events-none"
          style={{
            clipPath: "ellipse(80% 60% at 90% 50%)",
          }}
        />
      </aside>

      {/* --- FORM SECTION --- */}
      <section className="flex flex-col justify-center items-center bg-white p-8 w-full md:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="mb-6 font-semibold text-blue-800 text-2xl text-center">
            Crear cuenta
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {/* Nombres */}
            <div>
              <input
                type="text"
                placeholder="Nombres"
                {...register("nombres")}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                  errors.nombres
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {errors.nombres && (
                <ErrorText>{errors.nombres.message}</ErrorText>
              )}
            </div>

            {/* Apellido Paterno */}
            <div>
              <input
                type="text"
                placeholder="Apellido paterno"
                {...register("apellidoPa")}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                  errors.apellidoPa
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {errors.apellidoPa && (
                <ErrorText>{errors.apellidoPa.message}</ErrorText>
              )}
            </div>

            {/* Apellido Materno */}
            <div>
              <input
                type="text"
                placeholder="Apellido materno"
                {...register("apellidoMa")}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                  errors.apellidoMa
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {errors.apellidoMa && (
                <ErrorText>{errors.apellidoMa.message}</ErrorText>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                {...register("password")}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {errors.password && (
                <ErrorText>{errors.password.message}</ErrorText>
              )}
            </div>

            {/* Confirm Password (Nuevo campo visual) */}
            <div>
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                {...register("confirmPassword")}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {errors.confirmPassword && (
                <ErrorText>{errors.confirmPassword.message}</ErrorText>
              )}
            </div>

            {/* Términos y Condiciones */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("aceptaTerminos")}
                id="terms"
                className="w-4 h-4"
              />
              <label htmlFor="terms" className="text-gray-600 text-sm">
                Acepto los términos y condiciones
              </label>
            </div>
            {errors.aceptaTerminos && (
              <ErrorText>{errors.aceptaTerminos.message}</ErrorText>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isRegisterPending}
              className={`w-full p-3 rounded-lg text-white transition ${
                isRegisterPending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRegisterPending ? "REGISTRANDO..." : "REGISTRARSE"}
            </button>

            <div className="text-gray-500 text-sm text-center">
              <span>¿Ya tienes una cuenta? </span>
              <Link to="/" className="hover:text-blue-600">
                Iniciar Sesión
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default RegisterForm;
