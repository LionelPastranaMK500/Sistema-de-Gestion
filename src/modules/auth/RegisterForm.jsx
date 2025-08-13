import { useState } from "react";
import { validarRegister} from "../../utils/validations";
import { Link } from "react-router-dom";
import ErrorText from "../../components/ErrorText";

export function RegisterForm() {
    const[form, setForm] = useState({
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno:"",
        correo: "",
        clave: "",
        aceptaTerminos: false
    });

    const [err, setErr] = useState({});

    const handleChange = (e) =>{
        const{name, value, type, checked} = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value}));
        setErr((prev) => ({ ...prev, [name]: undefined}));
    };

    const handleSubmit = (e) =>{
        e.preventDefault();
        const errVal = validarRegister(form);
        setErr(errVal);

        if(Object.keys(errVal).length === 0){
            console.log(form);
        }       
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2>Crear cuenta</h2>
            {/* Nombres */}
            <div>
                <input
                    type="text"
                    name="nombres"
                    placeholder="Nombres"
                    onChange={handleChange}
                    value={form.nombres} 
                />
                {err.nombres && <ErrorText>{err.nombres}</ErrorText>}
            </div>

            {/* A.Paterno */}
            <div>
                <input 
                    type="text"
                    name="apellidoPaterno"
                    placeholder="Apellido paterno"
                    onChange={handleChange}
                    value={form.apellidoPaterno} 
                />
                {err.apellidoPaterno && <ErrorText>{err.apellidoPaterno}</ErrorText>}
            </div>

            {/* A.Materno */}
            <div>
                <input 
                    type="text"
                    name="apellidoMaterno"
                    placeholder="Apellido materno"
                    onChange={handleChange}
                    value={form.apellidoMaterno} 
                />
                {err.apellidoMaterno && <ErrorText>{err.apellidoMaterno}</ErrorText>}
            </div>

            {/* Email */}
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

            {/* Contraseña */}
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

            <div>
                <label>
                    <input 
                        type="checkbox"
                        name="aceptaTerminos"
                        checked={form.aceptaTerminos}
                        onChange={handleChange}
                    />
                    {" "}Acepto los términos y condiciones
                </label>
                {err.aceptaTerminos && <ErrorText>{err.aceptaTerminos}</ErrorText>}
            </div>

            <button type="submit">Registrarse</button>

            <div>
                <span>¿Ya tienes una cuenta? </span>
                <Link to="/">Iniciar Sesión</Link>
            </div>
        </form>
    );
}

export default RegisterForm;