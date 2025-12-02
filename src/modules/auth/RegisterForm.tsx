import { validarRegister, RegisterData } from "@/services/auth/validations";
import { Link } from "react-router-dom";
import ErrorText from "@/components/common/ErrorText";
import { useRegisterLogic } from "@/services/auth/authLogic";
import { useFormHandler } from "@/hooks/useFormHandler";

const RegisterForm = () => {
  const { mutate: register, isPending } = useRegisterLogic();

  const initialValues: RegisterData = {
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    clave: "",
    aceptaTerminos: false,
  };

  const { values, err, handleChange, handleSubmit } =
    useFormHandler<RegisterData>(
      initialValues,
      validarRegister,
      async (form) => {
        register({
          nombres: (form.nombres || "").trim(),
          apellidoPa: (form.apellidoPaterno || "").trim(),
          apellidoMa: (form.apellidoMaterno || "").trim(),
          email: (form.correo || "").trim().toLowerCase(),
          password: (form.clave || "").trim(),
        });
      }
    );

  return (
    <main className="relative flex min-h-screen overflow-hidden">
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

      <section className="flex flex-col justify-center items-center bg-white p-8 w-full md:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="mb-6 font-semibold text-blue-800 text-2xl text-center">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <input
                type="text"
                name="nombres"
                placeholder="Nombres"
                onChange={handleChange}
                value={values.nombres}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              {err.nombres && <ErrorText>{err.nombres}</ErrorText>}
            </div>

            <div>
              <input
                type="text"
                name="apellidoPaterno"
                placeholder="Apellido paterno"
                onChange={handleChange}
                value={values.apellidoPaterno}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              {err.apellidoPaterno && (
                <ErrorText>{err.apellidoPaterno}</ErrorText>
              )}
            </div>

            <div>
              <input
                type="text"
                name="apellidoMaterno"
                placeholder="Apellido materno"
                onChange={handleChange}
                value={values.apellidoMaterno}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              {err.apellidoMaterno && (
                <ErrorText>{err.apellidoMaterno}</ErrorText>
              )}
            </div>

            <div>
              <input
                type="email"
                name="correo"
                placeholder="Email"
                onChange={handleChange}
                value={values.correo}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              {err.correo && <ErrorText>{err.correo}</ErrorText>}
            </div>

            <div>
              <input
                type="password"
                name="clave"
                placeholder="Contraseña"
                onChange={handleChange}
                value={values.clave}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              {err.clave && <ErrorText>{err.clave}</ErrorText>}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="aceptaTerminos"
                checked={values.aceptaTerminos}
                onChange={handleChange}
              />
              <label className="text-gray-600 text-sm">
                Acepto los términos y condiciones
              </label>
            </div>
            {err.aceptaTerminos && <ErrorText>{err.aceptaTerminos}</ErrorText>}

            <button
              type="submit"
              disabled={isPending}
              className={`w-full p-3 rounded-lg text-white transition ${
                isPending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending ? "REGISTRANDO..." : "REGISTRARSE"}
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
