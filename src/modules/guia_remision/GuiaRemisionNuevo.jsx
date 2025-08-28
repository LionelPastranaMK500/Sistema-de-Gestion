import { Calendar } from "primereact/calendar";
import { configCalendar } from "@utils/configCalendar";
import { useEffect, useState } from "react";
import { guiaTabs } from "@constants/menuItemsConstants";
import { CloseIcon, RemoveCircleIcon } from "@constants/iconsConstants";
import AgregarProductoModal from "./items/AgregarProductoModal";


export default function GuiaRemisionNuevo({ onClose }) {
    const [fechaEnvio, setFechaEnvio] = useState(null);
    const [activeTab, setActiveTab] = useState("infoBasica");
    const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState([]);

    useEffect(() => {
        configCalendar();
    }, []);

    return (
        <div>
            <div>
                <div>
                    <h3>
                        Guia de Remision - Remitente
                    </h3>
                    <CloseIcon onClick={onClose}
                    />

                    <div>
                        {guiaTabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.action}
                                    onClick={() => setActiveTab(tab.action)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        fontWeight: activeTab === tab.action ? "bold" : "normal",
                                    }}
                                >
                                    <Icon />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    {activeTab === "infoBasica" && (
                        <div>
                            <div>
                                <p>Serie</p>
                                <select>
                                    <option value="">T004</option>
                                </select>
                            </div>

                            <div>
                                <p>Fecha de emisión</p>
                                <Calendar
                                    value={fechaEnvio}
                                    onChange={(e) => setFechaEnvio(e.value)}
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                />
                            </div>

                            <div>
                                <input type="search" placeholder="Destinatario" required />
                                <input type="text" placeholder="Observaciones" required />
                            </div>

                            <div>
                                <strong>Origen</strong>
                                <input type="search" placeholder="Ubigeo" required />
                                <input type="text" placeholder="Dirección" required />
                            </div>

                            <div>
                                <strong>Destino</strong>
                                <input type="search" placeholder="Ubigeo" required />
                                <input type="text" placeholder="Dirección" required />
                            </div>

                            <div style={{ marginTop: "1rem" }}>
                                <button>CANCELAR</button>
                                <button>PROCESAR</button>
                            </div>
                        </div>
                    )}

                    {activeTab === "datosEnvio" && (
                        <div>
                            <div>
                                <p>Tipo del envio</p>
                                <select>
                                    <option>OTROS</option>
                                    <option>VENTA SUJETA A CONFIRMACION DEL COMPRADOR</option>
                                    <option value="">TRASLADO EMISOR ITINERANTE DE COMPROBANTES DE PAGO</option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value="">VENTA</option>
                                </select>
                            </div>

                            <div>
                                <p>Fecha de envio</p>
                                <Calendar
                                    value={fechaEnvio}
                                    onChange={(e) => setFechaEnvio(e.value)}
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                />
                            </div>
                            <div>
                                <input type="text" placeholder="Cantidad de bultos" />
                                <input type="text" placeholder="Peso total" />
                                <div>
                                    <p>Peso total(Unidad)</p>
                                    <select>
                                        <option>KILOGRAMOS</option>
                                        <option>TONELADAS</option>
                                    </select>
                                </div>

                                <div>
                                    <p>Traslado</p>
                                    <select>
                                        <option value="">TRANSPORTE PUBLICO</option>
                                        <option value="">TRANSPORTE PRIVADO</option>
                                    </select>

                                    <div>
                                        <label htmlFor="">Traslado en vehiculos de categoria M1 o L (Sin datos del transporte)</label>
                                        <input type="checkbox" name="" />
                                    </div>
                                </div>

                                <div>
                                    <p>TRANSPORTISTA</p>
                                    <input type="search" name="" id="" placeholder="Empresa de transporte" />
                                    <div>
                                        <label htmlFor="">Regisrar vehiculos y conductores del transportista</label>
                                        <input type="checkbox" name="" />
                                    </div>
                                </div>

                                <div style={{ marginTop: "1rem" }}>
                                    <button>CANCELAR</button>
                                    <button>PROCESAR</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "productos" && (
                        <div>
                            <button onClick={() => setMostrarModalProducto(true)}>AGREGAR PRODUCTO</button>

                            {productoSeleccionado.map((producto, index) => (
                                <div key={producto.codigo || index}>
                                    <img src="#" alt="Producto" />
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={producto.descripcion}
                                        readOnly
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cantidad"
                                        value={producto.cantidad}
                                        onChange={(e) => {
                                            const nuevaCantidad = e.target.value;
                                            setProductoSeleccionado((prev) =>
                                                prev.map((p, i) =>
                                                    i === index ? { ...p, cantidad: nuevaCantidad } : p
                                                )
                                            );
                                        }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Detalle adicional"
                                        value={producto.detalle}
                                        onChange={(e) => {
                                            const nuevoDetalle = e.target.value;
                                            setProductoSeleccionado((prev) =>
                                                prev.map((p, i) =>
                                                    i === index ? { ...p, detalle: nuevoDetalle } : p
                                                )
                                            );
                                        }}
                                    />
                                    <RemoveCircleIcon
                                        onClick={() =>
                                            setProductoSeleccionado((prev) =>
                                                prev.filter((_, i) => i !== index)
                                            )
                                        }
                                    />
                                </div>
                            ))}


                            {mostrarModalProducto && (
                                <AgregarProductoModal
                                    onClose={() => setMostrarModalProducto(false)}
                                    onSelect={(productos) => {
                                        const listaProductos = Array.isArray(productos) ? productos : [productos];
                                        const productosConCampos = listaProductos.map((p) => ({
                                            ...p,
                                            cantidad: "",
                                            detalle: ""
                                        }));
                                        setProductoSeleccionado((prev) => [...prev, ...productosConCampos]);
                                        setMostrarModalProducto(false);
                                    }}
                                />

                            )}

                            <div style={{ marginTop: "1rem" }}>
                                <button>CANCELAR</button>
                                <button>PROCESAR</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}