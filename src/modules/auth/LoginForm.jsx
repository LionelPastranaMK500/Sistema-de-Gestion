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

        if(Object.keys(errVal).length === 0){
            console.log(form);
        }
    };

    return(
        <form onSubmit={handleShipping} > 
            <h2>Iniciar Sesion</h2>
            <div>
                <input type="email" name="" id="" />
                {err.correo && <ErrorText>{err.correo}</ErrorText> }
            </div>

            <div>
                <input type="password" name="" id="" />
                {err.clave && <ErrorText>{err.clave}</ErrorText>}
            </div>
            <button>
                
            </button>
        </form>
    );
}