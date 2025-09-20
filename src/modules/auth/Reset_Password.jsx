import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormHandler } from "@hooks/useFormHandler";
import { requestResetPassword, verifyResetCode, resetPassword } from "@services/auth/authServices";
import { validateResetPassword } from "@services/auth/validations";
import { InputOtp } from "primereact/inputotp";
import { notifyError, notifySuccess } from "@utils/notify";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");

    const { values, setValues, err, handleChange, resetForm } = useFormHandler(
        { correo: "", codigo: "", nuevaClave: "" },
        (form) => validateResetPassword(form, step)
    );

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        if (err?.correo) return notifyError(err.correo);

        const res = await requestResetPassword(values.correo.trim().toLowerCase());
        if (res.success) {
            notifySuccess(res.message);
            setEmail(values.correo.trim().toLowerCase());
            setStep(2);
        } else {
            notifyError(res.message);
        }
    };

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        if (err?.codigo) return notifyError(err.codigo);

        const res = await verifyResetCode(email, values.codigo.trim());
        if (res.success) {
            notifySuccess(res.message);
            setStep(3);
        } else {
            notifyError(res.message);
        }
    };

    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();
        if (err?.nuevaClave) return notifyError(err.nuevaClave);

        const res = await resetPassword(email, values.codigo.trim(), values.nuevaClave.trim());
        if (res.success) {
            notifySuccess(res.message);
            resetForm();
            navigate("/");
        } else {
            notifyError(res.message);
        }
    };

    return (
        <main>
            <aside>
                <main className="relative flex min-h-screen overflow-hidden">
                    {/* Lado izquierdo con curva (igual al Login) */}
                    <aside className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-blue-700 text-white md:flex">
                        {/* Logo */}
                        <div className="absolute left-6 top-6 z-10">
                            <img src="/images/Logo_WolfFur.webp" alt="Logo" className="h-20" />
                        </div>

                        {/* Contenido */}
                        <div className="z-10 -translate-x-6 px-10 text-center">
                            <h2 className="mb-3 text-3xl font-bold">¿Recordaste tu contraseña?</h2>
                            <Link
                                to="/"
                                className="rounded border border-white px-6 py-2 transition hover:bg-white hover:text-blue-700"
                            >
                                VOLVER A INICIAR SESIÓN
                            </Link>
                        </div>

                        {/* Curva de separación */}
                        <div
                            className="pointer-events-none absolute right-0 top-0 h-full w-24 md:w-20 bg-white"
                            style={{ clipPath: "ellipse(80% 60% at 90% 50%)" }}
                        />
                    </aside>

                    {/* Lado derecho (form por pasos) */}
                    <section className="flex w-full items-center justify-center bg-white p-8 md:w-1/2">
                        <div className="w-full max-w-sm">
                            {/* Título */}
                            <h2 className="mb-2 text-center text-2xl font-semibold text-blue-800">
                                Recuperar contraseña
                            </h2>

                            {/* Indicador de pasos */}
                            <div className="mb-6 flex items-center justify-center gap-2 text-xs">
                                {[1, 2, 3].map((s) => (
                                    <span
                                        key={s}
                                        className={`h-2.5 w-2.5 rounded-full ${step >= s ? "bg-blue-600" : "bg-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* PASO 1: correo */}
                            {step === 1 && (
                                <form onSubmit={handleSubmitEmail} noValidate className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            name="correo"
                                            placeholder="Correo electrónico"
                                            value={values.correo}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {err?.correo && (
                                            <p className="mt-1 text-sm text-red-500">{err.correo}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700"
                                    >
                                        Enviar código
                                    </button>

                                    <Link
                                        to="/"
                                        className="block text-center text-sm text-gray-500 hover:text-blue-600"
                                    >
                                        Volver al inicio de sesión
                                    </Link>
                                </form>
                            )}

                            {/* PASO 2: código */}
                            {step === 2 && (
                                <form onSubmit={handleSubmitCode} noValidate className="space-y-5">
                                    <div className="text-center text-sm text-gray-600">
                                        Hemos enviado un código a <span className="font-semibold">{email}</span>
                                    </div>

                                    <div className="flex justify-center">
                                        <InputOtp
                                            value={values.codigo || ""}
                                            length={6}
                                            autoFocus
                                            inputTemplate={({ events, props }) => (
                                                <input
                                                    {...events}
                                                    {...props}
                                                    type="tel"
                                                    inputMode="numeric"
                                                    autoComplete="one-time-code"
                                                    className="mx-1 h-12 w-10 rounded-md border text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            )}
                                            onChange={(code) =>
                                                setValues((prev) => ({
                                                    ...prev,
                                                    codigo:
                                                        typeof code === "string" ? code : (code?.value || ""),
                                                }))
                                            }
                                        />
                                    </div>

                                    {err?.codigo && (
                                        <p className="mt-1 text-center text-sm text-red-500">{err.codigo}</p>
                                    )}

                                    <div className="space-y-3">
                                        <button
                                            type="submit"
                                            disabled={(values.codigo || "").length !== 6}
                                            className="w-full rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Validar código
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="w-full rounded-lg border p-3 text-gray-700 transition hover:bg-gray-50"
                                        >
                                            Cambiar correo
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* PASO 3: nueva clave */}
                            {step === 3 && (
                                <form onSubmit={handleSubmitNewPassword} noValidate className="space-y-4">
                                    <div>
                                        <input
                                            type="password"
                                            name="nuevaClave"
                                            placeholder="Nueva contraseña"
                                            value={values.nuevaClave}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {err?.nuevaClave && (
                                            <p className="mt-1 text-sm text-red-500">{err.nuevaClave}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700"
                                    >
                                        Actualizar contraseña
                                    </button>
                                </form>
                            )}
                        </div>
                    </section>
                </main>
            </aside>
        </main>
    );
}
