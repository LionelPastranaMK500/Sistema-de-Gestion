import { useState } from "react"
import { generarPDF } from "@utils/pdfConfig"
import { CloseIcon } from "@constants/iconsConstants";
import { getActiveUser } from "@services/auth/authServices";

export default function FacturaModal({ f, onClose }) {
    const [mostrarFormatos, setMostrarFormatos] = useState(false);
    if (!f) return null;
    const usuario = getActiveUser();
    const formatos = [
        { id: "ticket80mm", label: "80mm" },
        { id: "A4", label: "A4" }
    ];
    const handleSeleccionFormato = (formato) => {
        generarPDF(f, formato);
        setMostrarFormatos(false);
    };
    return (
        <div>
            <div>
                <h3>Comprobante Electronico</h3>
                <CloseIcon onClick={onClose} />
            </div>

            <div>
                <strong>{f.tDocumento}</strong>
                <p>{f.numero}</p>
                <strong>S/ {f.monto.toFixed(2)}</strong>
            </div>

            <hr />

            <div>
                <strong>Cliente</strong>
                <p>{f.cliente}</p>
                <p>RUC {f.ruc}</p>
            </div>

            <div>
                <strong>Usuario</strong>
                <p>{usuario ? `${usuario.nombres} ${usuario.apellidoPaterno}` : "Usuario no disponible"}</p>
                <p>{new Date(f.fecha).toLocaleString("es-ES")}</p>
            </div>

            <div>
                <button onClick={() => setMostrarFormatos(!mostrarFormatos)}>
                    Generar PDF
                </button>
                {mostrarFormatos && (
                    <ul>
                        {formatos.map((f) => (
                            <li key={f.id}>
                                <button onClick={() => handleSeleccionFormato(f.id)}>
                                    {f.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}