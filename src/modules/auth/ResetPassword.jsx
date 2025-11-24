import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormHandler } from "@hooks/useFormHandler";
import {
    handleRequestReset,
    handleVerifyResetCode,
    handleResetPassword
} from "@services/auth/authLogic";
import { validateResetPassword } from "@services/auth/validations";
import { InputOtp } from "primereact/inputotp";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");

    const { values, setValues, err, handleChange, resetForm } = useFormHandler(
        { correo: "", codigo: "", nuevaClave: "" },
        (form) => validateResetPassword(form, step)
    );

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        if (err?.correo) return;

        const res = await handleRequestReset(values.correo.trim().toLowerCase());
        if (res.success) {
            setEmail(values.correo.trim().toLowerCase());
            setStep(2);
        }
    };

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        if (err?.codigo) return;

        const res = await handleVerifyResetCode(email, values.codigo.trim());
        if (res.success) {
            setStep(3);
        }
    };

    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();
        if (err?.nuevaClave) return;

        await handleResetPassword(
            email,
            values.codigo.trim(),
            values.nuevaClave.trim(),
            navigate
        );
    };

    return (
        <main className="relative flex min-h-screen overflow-hidden">
            <aside className="hidden relative md:flex justify-center items-center bg-blue-700 w-1/2 overflow-hidden text-white">
                <div className="top-6 left-6 z-10 absolute">
                    <img src="/images/Logo_WolfFur.webp" alt="Logo" className="h-20" />
                </div>

                <div className="z-10 px-10 text-center -translate-x-6">
                    <h2 className="mb-3 font-bold text-3xl">¿Recordaste tu contraseña?</h2>
                    <Link
                        to="/"
                        className="hover:bg-white px-6 py-2 border border-white rounded hover:text-blue-700 transition"
                    >
                        VOLVER A INICIAR SESIÓN
                    </Link>
                </div>

                <div
                    className="top-0 right-0 absolute bg-white w-24 md:w-20 h-full pointer-events-none"
                    style={{ clipPath: "ellipse(80% 60% at 90% 50%)" }}
                />
            </aside>

            <section className="flex justify-center items-center bg-white p-8 w-full md:w-1/2">
                <div className="w-full max-w-sm">
                    <h2 className="mb-2 font-semibold text-blue-800 text-2xl text-center">
                        Recuperar contraseña
                    </h2>

                    <div className="flex justify-center items-center gap-2 mb-6 text-xs">
                        {[1, 2, 3].map((s) => (
                            <span
                                key={s}
                                className={`h-2.5 w-2.5 rounded-full ${step >= s ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleSubmitEmail} noValidate className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    name="correo"
                                    placeholder="Correo electrónico"
                                    value={values.correo}
                                    onChange={handleChange}
                                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                />
                                {err?.correo && (
                                    <p className="mt-1 text-red-500 text-sm">{err.correo}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg w-full text-white transition"
                            >
                                Enviar código
                            </button>

                            <Link
                                to="/"
                                className="block text-gray-500 hover:text-blue-600 text-sm text-center"
                            >
                                Volver al inicio de sesión
                            </Link>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmitCode} noValidate className="space-y-5">
                            <div className="text-gray-600 text-sm text-center">
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
                                            className="mx-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-10 h-12 text-lg text-center"
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
                                <p className="mt-1 text-red-500 text-sm text-center">{err.codigo}</p>
                            )}

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={(values.codigo || "").length !== 6}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 p-3 rounded-lg w-full text-white transition disabled:cursor-not-allowed"
                                >
                                    Validar código
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="hover:bg-gray-50 p-3 border rounded-lg w-full text-gray-700 transition"
                                >
                                    Cambiar correo
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleSubmitNewPassword} noValidate className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    name="nuevaClave"
                                    placeholder="Nueva contraseña"
                                    value={values.nuevaClave}
                                    onChange={handleChange}
                                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                />
                                {err?.nuevaClave && (
                                    <p className="mt-1 text-red-500 text-sm">{err.nuevaClave}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg w-full text-white transition"
                            >
                                Actualizar contraseña
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}

export default ResetPassword;
