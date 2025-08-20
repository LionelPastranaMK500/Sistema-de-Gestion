import { handleSunatAuth } from "@services/auth/authLogic";
import { useFormHandler } from "@hooks/useFormHandler";
import ErrorText from "@components/ErrorText";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validarSunat } from "@services/auth/validations";
import { useSidebar } from "@utils/sidebarState";

export default function SunatForm() {
    const navigate = useNavigate();
    const {setSidebarReady} = useSidebar();
    const { values, err, handleChange, handleSubmit } = useFormHandler(
        { ruc: "", usuarioSol: "", claveSol: "" },
        validarSunat,
        (form) => {
            handleSunatAuth(form, navigate).then((res) => {
                if(res.success){
                    toast.success(res.message);
                    setSidebarReady(true);
                }else{
                    toast.error(res.message);
                }
            });
        }
    );

    return(
        <div>
            <div>
                <h2>Ingresa tu clave SOL</h2>
                <p>
                    Al ingresar la <strong>CLAVE SOL</strong>....
                </p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <input 
                            type="text" 
                            name="ruc"
                            value={values.ruc}
                            onChange={handleChange}
                            placeholder="RUC"
                        />
                        {err.ruc && <ErrorText>{err.ruc}</ErrorText>}
                    </div>
                    <div>
                        <input 
                            type="text" 
                            name="usuarioSol"
                            value={values.usuarioSol}
                            onChange={handleChange}
                            placeholder="Usuario SOL"
                        />
                        {err.usuarioSol && <ErrorText>{err.usuarioSol}</ErrorText>}
                    </div>
                    <div>
                        <input 
                            type="password" 
                            name="claveSol"
                            value={values.claveSol}
                            onChange={handleChange}
                            placeholder="Clave SOL"
                        />
                        {err.claveSol && <ErrorText>{err.claveSol}</ErrorText>}
                    </div>
                    <div>
                        <button type="submit">Registrar</button>
                        <button type="button" onClick={() => navigate(-1)}>Regresar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}