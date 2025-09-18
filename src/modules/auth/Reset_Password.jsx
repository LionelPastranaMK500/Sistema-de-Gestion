import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const customInput = ({ events, props }) => {
        return <><input {...events}{...props} type="text" className=""/>

        </>
    }

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
        <div>
            {step === 1 && (
                <form onSubmit={handleSubmitEmail}>
                    <input
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        value={values.correo}
                        onChange={handleChange}
                    />
                    {err?.correo && <p>{err.correo}</p>}
                    <button type="submit">Enviar código</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmitCode}>
                    <InputOtp
                        value={values.codigo || ""}
                        length={6}
                        autoFocus
                        inputTemplate={({ events, props }) => <input {...events} {...props} type="text" />}
                        onChange={(e) =>
                            setValues((prev) => ({ ...prev, codigo: e.value || "" }))
                        }
                    />
                    {err?.codigo && <p>{err.codigo}</p>}
                    <button type="submit" disabled={values.codigo.length !== 6}>
                        Validar código
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleSubmitNewPassword}>
                    <input
                        type="password"
                        name="nuevaClave"
                        placeholder="Nueva contraseña"
                        value={values.nuevaClave}
                        onChange={handleChange}
                    />
                    {err?.nuevaClave && <p>{err.nuevaClave}</p>}
                    <button type="submit">Actualizar contraseña</button>
                </form>
            )}
        </div>
    );
}
