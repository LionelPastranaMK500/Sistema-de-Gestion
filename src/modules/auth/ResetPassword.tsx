import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorText from "@/components/common/ErrorText";
import { useAuthMutations } from "@/hooks/auth/useAuthMutations";
import {
  requestResetSchema,
  resetPasswordSchema,
  RequestResetSchemaType,
  ResetPasswordSchemaType,
} from "@/schemas/auth/ResetPassword.schema";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [savedEmail, setSavedEmail] = useState("");

  const { requestReset, confirmReset, isRequestPending, isConfirmPending } =
    useAuthMutations();

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm<RequestResetSchemaType>({
    resolver: zodResolver(requestResetSchema),
  });

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
    setValue: setValueStep2,
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmitStep1 = (data: RequestResetSchemaType) => {
    requestReset(data.email, {
      onSuccess: () => {
        setSavedEmail(data.email);
        setValueStep2("email", data.email);
        setStep(2);
      },
    });
  };

  const onSubmitStep2 = (data: ResetPasswordSchemaType) => {
    confirmReset(data); // Ejecuta la mutación de cambio de contraseña
  };

  const isLoading = isRequestPending || isConfirmPending;

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-gray-50">
      {/* Aside decorativo con Logo y Link (Igual a Login/Register) */}
      <aside className="hidden relative md:flex flex-col justify-center items-center bg-blue-700 w-1/2 overflow-hidden text-white">
        <div className="top-6 left-6 z-10 absolute">
          <img
            src="/images/Logo_WolfFur.webp"
            alt="Logo"
            className="h-20 object-contain"
          />
        </div>
        <div className="z-10 relative px-10 text-center">
          <h2 className="mb-4 font-bold text-3xl">Recuperación de Cuenta</h2>
          <p className="mb-6">
            Sigue los pasos para restablecer tu acceso al sistema.
          </p>
        </div>
        <div
          className="top-0 right-0 absolute bg-white w-24 md:w-20 h-full pointer-events-none"
          style={{ clipPath: "ellipse(80% 60% at 90% 50%)" }}
        />
      </aside>

      {/* Sección del Formulario */}
      <section className="flex flex-col justify-center items-center bg-white p-8 w-full md:w-1/2">
        <div className="w-full max-w-sm">
          <h2 className="mb-6 font-semibold text-blue-800 text-2xl text-center">
            {step === 1 ? "Restablecer Contraseña" : "Nueva Contraseña"}
          </h2>

          {step === 1 ? (
            <form
              onSubmit={handleSubmitStep1(onSubmitStep1)}
              noValidate
              className="space-y-4"
            >
              <p className="text-gray-600 text-sm text-center">
                Ingresa tu correo electrónico y te enviaremos un código de
                recuperación.
              </p>
              <div>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  {...registerStep1("email")}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                    errorsStep1.email
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
                {errorsStep1.email && (
                  <ErrorText>{errorsStep1.email.message}</ErrorText>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-lg text-white transition ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Enviando..." : "Enviar Código"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitStep2(onSubmitStep2)}
              noValidate
              className="space-y-4"
            >
              <p className="text-gray-600 text-sm text-center">
                Ingresa el código enviado a <strong>{savedEmail}</strong>.
              </p>
              <input type="hidden" {...registerStep2("email")} />

              <div>
                <input
                  type="text"
                  placeholder="Código de verificación"
                  {...registerStep2("code")}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
                {errorsStep2.code && (
                  <ErrorText>{errorsStep2.code.message}</ErrorText>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  {...registerStep2("newPassword")}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
                {errorsStep2.newPassword && (
                  <ErrorText>{errorsStep2.newPassword.message}</ErrorText>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  {...registerStep2("confirmPassword")}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
                {errorsStep2.confirmPassword && (
                  <ErrorText>{errorsStep2.confirmPassword.message}</ErrorText>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-lg text-white transition ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Procesando..." : "Cambiar Contraseña"}
              </button>
            </form>
          )}

          {/* Uso de Link para volver al inicio */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-blue-600 transition"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
