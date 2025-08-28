// import { useState } from "react";
import { CloseIcon } from "@constants/iconsConstants";

export default function GuiaRemisionModal() {
    return (
        <div>
            <div>
                <div>
                    <h3>
                        Comprobante electrónico
                    </h3>
                    <CloseIcon
                    />
                </div>

                <div>
                    {/* Documento */}
                    <div>
                        <p>Guia de Remision Remitente Electronica</p>
                        <p></p>
                    </div>

                    {/* Destinatario */}
                    <div>
                        <p>Destinatario</p>
                        <p></p>
                        <p></p>
                    </div>

                    {/* Origen / Destino */}
                    <div>
                        <p>Origen / Destino</p>
                        <p></p>
                        <p></p>
                    </div>

                    {/* Usuario*/}
                    <div>
                        <p>Usuario</p>
                        <p></p>
                        <p></p>
                    </div>
                    {/* Estado SUNAT */}
                    <div>
                        <strong>ESTADO SUNAT</strong>
                        <p>Aceptado</p>
                    </div>

                    <div>
                        <button>
                            ENVIAR POR EMAIL
                        </button>
                        <button>
                            ENVIAR POR WHATSAPP
                        </button>
                        <button>
                            VISUALIZAR PDF
                        </button>

                        <div>
                            <button
                            //onClick={() => setMostrarFormatos(!mostrarFormatos)}
                            >
                                DESCARGAR PDF
                            </button>

                            {/* {mostrarFormatos && (
                                <ul className="right-0 left-0 z-50 absolute bg-white shadow-lg mt-1 border border-gray-200 rounded">
                                    {formatos.map((formato) => (
                                        <li key={formato.id}>
                                            <button
                                                className="hover:bg-gray-100 px-4 py-2 w-full text-left"
                                                onClick={() => handleSeleccionFormato(formato.id)}
                                            >
                                                {formato.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )} */}
                        </div>

                        <button>
                            DESCARGAR XML
                        </button>
                        <button >
                            DESCARGAR CDR
                        </button>
                    </div>

                    <button>
                        ANULAR
                    </button>
                </div>
            </div>
        </div>
    );
}