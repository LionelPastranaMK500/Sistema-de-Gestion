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

  // --- FORMULARIO PASO 1 ---
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm<RequestResetSchemaType>({
    resolver: zodResolver(requestResetSchema),
  });

  // --- FORMULARIO PASO 2 ---
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
    setValue: setValueStep2,
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handler Paso 1: Solicitar Código
  const onSubmitStep1 = (data: RequestResetSchemaType) => {
    requestReset(data.email, {
      onSuccess: () => {
        setSavedEmail(data.email);
        // Pre-llenamos el email para el paso 2
        setValueStep2("email", data.email);
        setStep(2);
      },
    });
  };

  const onSubmitStep2 = (data: ResetPasswordSchemaType) => {
    confirmReset(data);
  };

  const isLoading = isRequestPending || isConfirmPending;

  return (
    <main className="relative flex flex-col justify-center items-center bg-gray-50 min-h-screen overflow-hidden">
      {/* Aside decorativo */}
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

          {/* Renderizado Condicional del Formulario */}
          {step === 1 ? (
            <form
              onSubmit={handleSubmitStep1(onSubmitStep1)}
              noValidate
              className="space-y-4"
            >
              <div>
                <p className="mb-4 text-gray-600 text-sm text-center">
                  Ingresa tu correo electrónico y te enviaremos un código de
                  recuperación.
                </p>
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
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
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
              <p className="mb-4 text-gray-600 text-sm text-center">
                Ingresa el código enviado a <strong>{savedEmail}</strong> y tu
                nueva contraseña.
              </p>

              {/* Input Oculto de Email */}
              <input type="hidden" {...registerStep2("email")} />

              {/* Código */}
              <div>
                <input
                  type="text"
                  placeholder="Código de verificación"
                  {...registerStep2("code")}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                    errorsStep2.code
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
                {errorsStep2.code && (
                  <ErrorText>{errorsStep2.code.message}</ErrorText>
                )}
              </div>

              {/* Nueva Contraseña */}
              <div>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  {...registerStep2("newPassword")}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                    errorsStep2.newPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
                {errorsStep2.newPassword && (
                  <ErrorText>{errorsStep2.newPassword.message}</ErrorText>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <input
                  type="password"
                  placeholder="Confirmar nueva contraseña"
                  {...registerStep2("confirmPassword")}
                  className={`p-3 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                    errorsStep2.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                />
                {errorsStep2.confirmPassword && (
                  <ErrorText>{errorsStep2.confirmPassword.message}</ErrorText>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-lg text-white transition ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Procesando..." : "Cambiar Contraseña"}
              </button>
            </form>
          )}

          <div className="text-gray-500 text-sm text-center mt-4">
            <Link to="/" className="hover:text-blue-600">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
