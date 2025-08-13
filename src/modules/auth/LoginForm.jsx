import { useState } from "react";
import { validarLogin } from "../../utils/validations"
import ErrorText from "../../components/ErrorText";

export function LoginForm() {
    const [form, setForm] = useState({ correo: "", clave: "" });
    const [err, setErr] = useState({});

    const handleChange = (e) => {
        const{name,value} = e.target;
        setForm((prev) => ({ ...prev, [name]: value}));
        setErr((prev) => ({ ...prev,[name]: undefined}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errVal = validarLogin(form);
        setErr(errVal);

        //Api
        if (Object.keys(errVal).length === 0) {
            console.log(form);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2>Iniciar Sesion</h2>
            <div>
                <input
                    type="email"
                    name="correo"
                    placeholder="Email"
                    onChange={handleChange}
                    value={form.correo}
                />
                {err.correo && <ErrorText>{err.correo}</ErrorText>}
            </div>

            <div>
                <input
                    type="password"
                    name="clave"
                    placeholder="Contraseña"
                    onChange={handleChange}
                    value={form.clave}
                />
                {err.clave && <ErrorText>{err.clave}</ErrorText>}
            </div>

            <button type="submit">
                Ingresar
            </button>

            <a href="http://">¿Olvidaste tu contraseña?</a>
        </form>
    );
}

export default LoginForm;
