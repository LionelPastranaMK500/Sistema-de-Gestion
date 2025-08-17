import { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { configCalendar } from "../../utils/configCalendar";

export default function VentasModal() {
    const [fechaEmision, setFechaEmision] = useState(null);
    const [fechaVencimiento, setFechaVencimiento] = useState(null);
    useEffect(()=>{
        configCalendar();
    },[]);
    return (
        <div>
            <h2>Nueva Venta</h2>
            <div>

                <div>
                    <input type="text" placeholder="Cliente" />
                    <label>
                        <input type="checkbox" name="" id="" />
                        Proforma
                    </label>
                </div>

                <div>
                    <Calendar value={fechaEmision} onChange={(e) => setFechaEmision(e.value)} placeholder="Fecha de Emision" showIcon/>
                    <Calendar value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.value)} placeholder="Fecha de Vcto" showIcon/>
                </div>

                <div>
                    <label htmlFor="">
                        Tipo de comprobante
                        <select name="" id="">
                            <option>BOLETA DE VENTA ELECTRONICA</option>
                        </select>
                    </label>
                    <label htmlFor="">
                        Serie
                        <select>
                            <option>BB04</option>
                        </select>
                    </label>
                    <label htmlFor="">
                        Tipo de operacion
                        <select>
                            <option>VENTA INTERNA</option>
                        </select>
                    </label>
                    <input type="" placeholder="Dscto. global (%)" />
                </div>

                <div>
                    <button>PLACA</button>
                    <button>O. COMPRA</button>
                    <button>G. REMISIÓN</button>
                    <button>OBSERVACIONES</button>
                    <button>COND. PAGO</button>
                    <button>OTROS</button>
                </div>
            </div>

            <div>
                <p>Zona Productos</p>
            </div>

            <div>
                <input type="text" placeholder="Buscar producto...." />

                <div>
                    <p>TOTAL 0.00</p>
                    <button>VISTA PREVIA</button>
                    <button>PROCESAR</button>
                </div>
            </div>
        </div>
    )
};