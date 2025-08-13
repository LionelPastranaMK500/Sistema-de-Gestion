import { useState } from "react";
import { validarLogin} from "../../utils/validations"
import ErrorText from "../../components/ErrorText";

function LoginForm(){
    const [from, setForm] = useState({ correo: "", clave: ""});
    const [err, setErr] = useState({});

    const handleChange = (e) =>{
        setForm({ ...from, [e.target.name]: e.target.value});
    };

    const handleShipping = (e) =>{
        e.preventDefault();
        const errVal = validarLogin(from);
        setErr(errVal);

        //Api
        if(Object.keys(errVal).length === 0){
            console.log(form);
        }
    };

    return(
        <form onSubmit={handleShipping} > 
            <h2>Iniciar Sesion</h2>
            <div>
                <input 
                    type="email" 
                    name="correo"
                    placeholder="Email" 
                    id="" 
                    onChange={handleChange} 
                    value={form.correo}
                />
                {err.correo && <ErrorText>{err.correo}</ErrorText> }
            </div>

            <div>
                <input 
                    type="password" 
                    name="clave" 
                    id=""
                    placeholder="Ckave" 
                    onChange={handleChange} 
                    value={form.clave}
                    />
                {err.clave && <ErrorText>{err.clave}</ErrorText>}
            </div>

            <button type="submit">
                Iniciar Sesión
            </button>
        </form>
    );
}