import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthMutations } from "@/hooks/auth/useAuthMutations";
import { loginSchema, LoginSchemaType } from "@/schemas/auth/Login.schema";
import ErrorText from "@/components/common/ErrorText";

const LoginForm = () => {
  const { login, isLoginPending } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchemaType) => {
    login(data);
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden">
      <aside className="hidden relative md:flex flex-col justify-center items-center bg-blue-700 w-1/2 overflow-hidden text-white">
        <div className="top-6 left-6 z-10 absolute">
          <img src="/images/Logo_WolfFur.webp" alt="Logo" className="h-20" />
        </div>
        <div className="z-10 relative px-10 text-center -translate-x-6 transform">
          <h2 className="mb-4 font-bold text-3xl">¿No tienes una cuenta?</h2>
          <Link
            to="/register"
            className="hover:bg-white px-6 py-2 border border-white rounded hover:text-blue-700 transition"
          >
            CREA UNA CUENTA AHORA
          </Link>
        </div>
        <div
          className="top-0 right-0 absolute bg-white w-24 md:w-20 h-full pointer-events-none"
          style={{ clipPath: "ellipse(80% 60% at 90% 50%)" }}
        />
      </aside>

      <section className="flex flex-col justify-center items-center bg-white p-8 w-full md:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="mb-6 font-semibold text-blue-800 text-2xl text-center">
            Iniciar Sesión
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
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
            <button
              type="submit"
              disabled={isLoginPending}
              className={`w-full p-3 rounded-lg text-white transition ${
                isLoginPending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoginPending ? "INGRESANDO..." : "INGRESA"}
            </button>
            <Link
              to="/reset-password"
              className="block text-gray-500 hover:text-blue-600 text-sm text-center"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginForm;
