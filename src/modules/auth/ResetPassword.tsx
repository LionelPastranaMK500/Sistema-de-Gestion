import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorText from "@/components/common/ErrorText";
import {
  validateResetPassword,
  ResetPassData,
} from "@/services/auth/validations";
import { useFormHandler } from "@/hooks/useFormHandler";
import {
  useRequestResetLogic,
  useResetPasswordLogic,
} from "@/services/auth/authLogic";

const ResetPassword = () => {
  const [step, setStep] = useState(1);

  const { mutate: requestReset, isPending: loadingRequest } =
    useRequestResetLogic();
  const { mutate: resetPass, isPending: loadingReset } =
    useResetPasswordLogic();

  const initialValues: ResetPassData = {
    correo: "",
    codigo: "",
    nuevaClave: "",
  };

  const { values, err, handleChange, handleSubmit } =
    useFormHandler<ResetPassData>(
      initialValues,
      (form) => validateResetPassword(form, step),
      async (form) => {
        if (step === 1) {
          requestReset(form.correo || "", {
            onSuccess: () => setStep(2),
          });
        } else {
          resetPass({
            email: form.correo || "",
            code: form.codigo || "",
            nuevaClave: form.nuevaClave || "",
          });
        }
      }
    );

  return (
    <main className="relative flex flex-col justify-center items-center bg-gray-50 min-h-screen overflow-hidden">
      {/* Aside decorativo (Oculto en móvil) */}
      <aside className="hidden md:flex absolute inset-y-0 left-0 w-1/2 bg-blue-700 flex-col justify-center items-center text-white overflow-hidden">
        <div className="absolute top-6 left-6 z-10">
          <img
            src="/images/Logo_WolfFur.webp"
            alt="Logo"
            className="h-20 object-contain"
          />
        </div>
        <div
          className="absolute top-0 right-0 w-24 md:w-20 h-full bg-white pointer-events-none"
          style={{ clipPath: "ellipse(80% 60% at 90% 50%)" }}
        />
      </aside>

      {/* Sección del Formulario */}
      <section className="relative w-full md:w-1/2 md:ml-auto flex flex-col justify-center items-center p-8 bg-white h-full">
        <div className="w-full max-w-sm">
          <h2 className="mb-6 font-semibold text-blue-800 text-2xl text-center">
            Restablecer Contraseña
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {step === 1 && (
              <div>
                <p className="mb-4 text-gray-600 text-sm text-center">
                  Ingresa tu correo electrónico y te enviaremos un código de
                  recuperación.
                </p>
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo electrónico"
                  onChange={handleChange}
                  value={values.correo}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                {err.correo && <ErrorText>{err.correo}</ErrorText>}
              </div>
            )}

            {step === 2 && (
              <>
                <p className="mb-4 text-gray-600 text-sm text-center">
                  Ingresa el código enviado a <strong>{values.correo}</strong> y
                  tu nueva contraseña.
                </p>
                <div>
                  <input
                    type="text"
                    name="codigo"
                    placeholder="Código de verificación"
                    onChange={handleChange}
                    value={values.codigo}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  {err.codigo && <ErrorText>{err.codigo}</ErrorText>}
                </div>
                <div>
                  <input
                    type="password"
                    name="nuevaClave"
                    placeholder="Nueva contraseña"
                    onChange={handleChange}
                    value={values.nuevaClave}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                  {err.nuevaClave && <ErrorText>{err.nuevaClave}</ErrorText>}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loadingRequest || loadingReset}
              className={`w-full p-3 rounded-lg text-white transition ${
                loadingRequest || loadingReset
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loadingRequest || loadingReset
                ? "Procesando..."
                : step === 1
                ? "Enviar Código"
                : "Cambiar Contraseña"}
            </button>

            <div className="text-gray-500 text-sm text-center">
              <Link to="/" className="hover:text-blue-600">
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
