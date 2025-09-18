import { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { configCalendar } from "@utils/configCalendar";
import { getClientes, getTiposComprobante, getSeries, getProductos, mapTipo } from "@services/generadorData";
import { visualizarPDF } from "@utils/pdfViewer";
import { generarRuc, generarDni } from "@services/generadorDocumentos";
import VentasModal from "./VentasModal";

export default function VentasView() {
    const [fechaEmision, setFechaEmision] = useState(new Date());
    const [fechaVencimiento, setFechaVencimiento] = useState(null);

    const clientes = getClientes();
    const productos = getProductos();
    const comprobantes = getTiposComprobante();

    const [cliente, setCliente] = useState(null);
    const [producto, setProducto] = useState(null);
    const [comprobante, setComprobante] = useState("");

    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [proformaChecked, setProformaChecked] = useState(false);

    const [seriesDisponibles, setSeriesDisponibles] = useState([]);
    const [serie, setSerie] = useState("");

    const [productosAgregados, setProductoAgregados] = useState([]);

    const [visiblePreview, setVisiblePreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [tipoPdf, setTipoPdf] = useState("A4");

    useEffect(() => {
        configCalendar();
    }, []);

    useEffect(() => {
        if (mapTipo[comprobante]) {
            const nuevasSeries = getSeries(mapTipo[comprobante]);
            setSeriesDisponibles(nuevasSeries);
            setSerie(nuevasSeries[0] || "");
        }
    }, [comprobante]);

    const handleProformaChange = (e) => {
        const checked = e.target.checked;
        setProformaChecked(checked);

        if (checked) {
            setComprobante("PROFORMA ELECTRÓNICA");
            const nuevasSeries = getSeries("PROFORMA");
            setSeriesDisponibles(nuevasSeries);
            setSerie(nuevasSeries[0] || "");
        } else {
            setComprobante("");
            setSerie("");
            setSeriesDisponibles([]);
        }
    };

    const handleVistaPrevia = async () => {
        let docCliente = cliente?.documento;
        if (!docCliente) {
            if (comprobante.includes("FACTURA ELECTRÓNICA")) {
                docCliente = generarRuc();
            } else if (comprobante.includes("BOLETA DE VENTA ELECTRÓNICA")) {
                docCliente = generarDni();
            } else {
                docCliente = generarRuc();
            }
        }

        const facturaPreview = {
            ruc: docCliente,
            cliente: cliente?.razonSocial || "",
            direccion: cliente?.direccion || "",
            tDocumento: comprobante,
            serie,
            numero: Date.now() % 10000,//solo temporal pastranin
            items: productosAgregados || [],
            fecha: fechaEmision,
            fechaVencimiento,
            total: totalGeneral,
        };

        if (pdfUrl) URL.revokeObjectURL(pdfUrl);

        const blob = await visualizarPDF(facturaPreview, tipoPdf);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setVisiblePreview(true);
    };

    const buscarClientes = (event) => {
        const query = event.query.toLowerCase();
        const _clientes = clientes.filter(
            (c) =>
                c.razonSocial.toLowerCase().includes(query) ||
                c.direccion.toLowerCase().includes(query)
        );
        console.log(_clientes);
        setClientesFiltrados(_clientes);
    };

    const buscarProductos = (event) => {
        const query = event.query.toLowerCase();
        const _productos = productos.filter((p) =>
            p.descripcion.toLowerCase().includes(query)
        );
        setProductosFiltrados(_productos);
    };

    const agregarProducto = (prod = null) => {
        const productoSeleccionado = prod || producto;
        if (!productoSeleccionado) return;

        const idProd = productoSeleccionado.codigo;
        const existe = productosAgregados.find(p => p.codigo === idProd);

        if (existe) {
            setProductoAgregados(productosAgregados.map(p =>
                p.codigo === idProd
                    ? { ...p, cantidad: p.cantidad + 1, total: (p.cantidad + 1) * p.precio }
                    : p
            ));
        } else {
            setProductoAgregados([
                ...productosAgregados,
                { ...productoSeleccionado, cantidad: 1, total: productoSeleccionado.precio }
            ]);
        }

        setProducto(null);
        setProductosFiltrados([]);
    };

    const totalGeneral = productosAgregados.reduce((sum, p) => sum + p.total, 0);

    const actualizarCantidad = (codigo, cantidad) => {
        if (cantidad < 1) return;
        setProductoAgregados(productosAgregados.map(p =>
            p.codigo === codigo ? { ...p, cantidad, total: cantidad * p.precio } : p
        ));
    };

    const eliminarProducto = (codigo) => {
        setProductoAgregados(prev => prev.filter(p => p.codigo !== codigo));
    };

    const handleKeyEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            agregarProducto();
        }
    }

    return (
        <div className="flex flex-col bg-white shadow-md p-6 rounded-lg w-full h-full">
            {/* ENCABEZADO */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="ml-5 font-bold text-gray-800 text-xl">Nueva venta</h2>
                <label className="flex items-center gap-2 text-gray-700 text-sm">
                    <input type="checkbox" className="w-4 h-4"
                        checked={proformaChecked}
                        onChange={handleProformaChange} />
                    PROFORMA
                </label>
            </div>

            {/* PRIMERA FILA */}
            <div className="gap-4 grid grid-cols-4 mb-4">
                <div className="col-span-2">
                    <label className="block mb-1 text-gray-500 text-xs">Cliente</label>
                    <AutoComplete
                        value={cliente}
                        suggestions={clientesFiltrados}
                        completeMethod={buscarClientes}
                        field="razonSocial"
                        onChange={(e) => setCliente(e.value)}
                        placeholder="Escriba Nombre - RUC/DNI"
                        className="w-full"
                        inputClassName="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:ring-2 focus:ring-blue-400"
                        itemTemplate={(item) => (
                            <div>
                                <span>{item.documento}</span>
                                <br />
                                <span>{item.razonSocial}</span>
                            </div>
                        )}
                        selectedItemTemplate={(item) =>
                            item ? `${item.documento} -> ${item.razonSocial}` : ""
                        }
                        emptyMessage="No se encontraron resultados"
                        panelHeaderTemplate={() => (
                            <div>
                                <span>Resultado de la búsqueda</span>
                                <button
                                    type="button"
                                >
                                    Registrar nuevo
                                </button>
                            </div>
                        )}
                        panelFooterTemplate={() => {
                            const query = cliente?.razonSocial || cliente?.documento || "";
                            return !query || query.length < 3 ? (
                                <div>
                                    <p>TIP: Escribe <strong>3 o más caracteres</strong> para comenzar a buscar</p>
                                    <p>TIP: Para un <strong>DNI o RUC</strong>, escribe el número y presiona <kbd>ENTER</kbd></p>
                                    <p>TIP: ¿Sin documentos? Escribe el nombre y presiona <kbd>ENTER</kbd></p>
                                    <p>TIP: Para una venta sin datos, puede dejar el campo vacío</p>
                                </div>
                            ) : null;
                        }}
                    />
                </div>

                {/* Fecha emisión */}
                <div>
                    <label className="block mb-1 text-gray-500 text-xs">Fecha de emisión</label>
                    <Calendar
                        value={fechaEmision}
                        onChange={(e) => setFechaEmision(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className="w-full"
                        inputClassName="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Fecha vcto */}
                <div>
                    <label className="block mb-1 text-gray-500 text-xs">Fecha de vencimiento</label>
                    <Calendar
                        value={fechaVencimiento}
                        onChange={(e) => setFechaVencimiento(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className="w-full"
                        inputClassName="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            {/* SEGUNDA FILA */}
            <div className="gap-4 grid grid-cols-4 mb-4">
                <div>
                    <label className="block mb-1 text-gray-500 text-xs">Tipo de comprobante</label>
                    <select
                        value={comprobante}
                        onChange={(e) => setComprobante(e.target.value)}
                        className="px-2 py-2 border border-gray-300 rounded-md w-full text-sm">
                        <option value="">---Seleccionar---</option>
                        {comprobantes.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-gray-500 text-xs">Serie</label>
                    <select value={serie} onChange={(e) => setSerie(e.target.value)}
                        className="px-2 py-2 border border-gray-300 rounded-md w-full text-sm">
                        <option>---Seleccionar---</option>
                        {seriesDisponibles.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-gray-500 text-xs">Tipo de operación</label>
                    <select className="px-2 py-2 border border-gray-300 rounded-md w-full text-sm">
                        <option>VENTA INTERNA</option>
                    </select>
                </div>

                {/* Dscto global */}
                <div>
                    <label className="block mb-1 text-gray-500 text-xs">Dscto. global (%)</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        className="px-2 py-2 border border-gray-300 rounded-md w-full text-sm"
                    />
                </div>
            </div>

            {/* BOTONES DE OPCIONES */}
            <div className="gap-2 grid grid-cols-4 mb-6">
                <VentasModal />
            </div>

            {/* ZONA DE PRODUCTOS */}
            <div className="flex-1 bg-gray-50 mb-6 p-6 border border-gray-300 rounded-md overflow-auto text-gray-500 text-sm text-center">
                {productosAgregados.length === 0 ? (
                    <div className="p-6 text-gray-500 text-sm text-center">
                        Escanea un producto con un lector de código de barras o búscalo
                    </div>
                ) : (
                    <table className="w-full text-gray-700 text-sm">
                        <thead className="bg-gray-100 border-b text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-2 text-left">Producto</th>
                                <th className="px-4 py-2">Precio Unit.</th>
                                <th className="px-4 py-2">Descuento</th>
                                <th className="px-4 py-2">Total</th>
                                <th className="px-4 py-2">Cantidad</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosAgregados.map((p) => (
                                <tr key={p.codigo} className="border-b">
                                    <td className="px-4 py-2 text-left">{p.descripcion}</td>
                                    <td className="px-4 py-2 text-center">S/ {p.precio.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-center">S/ 0.00</td>
                                    <td className="px-4 py-2 text-center">S/ {p.total.toFixed(2)}</td>
                                    <td className="flex justify-center items-center gap-2 px-4 py-2">
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                                            onClick={() => actualizarCantidad(p.codigo, p.cantidad - 1)}
                                        >
                                            -
                                        </button>
                                        <span>{p.cantidad}</span>
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                                            onClick={() => actualizarCantidad(p.codigo, p.cantidad + 1)}
                                        >
                                            +
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                                            onClick={() => eliminarProducto(p.codigo)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* FOOTER */}
            <div className="bottom-0 sticky bg-white pt-4 border-gray-300 border-t">
                {/* Buscar producto */}
                <div className="mb-4">
                    <AutoComplete
                        value={producto}
                        suggestions={productosFiltrados}
                        completeMethod={buscarProductos}
                        field="descripcion"
                        onChange={(e) => setProducto(e.value)}
                        onSelect={(e) => agregarProducto(e.value)}
                        placeholder="Escriba nombre del producto..."
                        className="w-full"
                        onKeyDown={handleKeyEnter}
                        inputClassName="px-3 py-2 border border-gray-300 rounded-md text-sm w-full focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* TOTAL + BOTONES */}
                <div className="flex justify-between items-center gap-4">
                    <div className="group relative flex-[22] text-center cursor-pointer">
                        <p className="font-bold text-gray-700 text-lg">
                            <strong>
                                TOTAL <span className="text-black">S/. {totalGeneral}</span>
                            </strong>
                        </p>
                        <div className="hidden group-hover:block bottom-full left-1/2 absolute bg-white shadow-lg mb-2 p-4 border rounded-lg w-52 text-gray-700 text-sm -translate-x-1/2">
                            {[
                                "Anticipios", "DSCTO", "Gravado", "Exonerado", "Inafecto",
                                "Exportación", "Gratuito", "I.S.C", "I.G.V", "R.C", "I.C.B.P.E.R",
                            ].map((item) => (
                                <div key={item} className="flex justify-between">
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleVistaPrevia}
                        className="flex-[9] bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-semibold text-gray-700"
                    >
                        VISTA PREVIA
                    </button>

                    <button className="flex-[9] bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-white">
                        PROCESAR
                    </button>
                </div>


                <Dialog
                    header="Vista previa PDF"
                    visible={visiblePreview}
                    maximized
                    className="w-screen h-screen"
                    onHide={() => setVisiblePreview(false)}
                >
                    <div className="flex gap-10 mb-3">
                        <select
                            value={tipoPdf}
                            onChange={(e) => setTipoPdf(e.target.value)}
                            className="px-2 py-1 border rounded text-sm"
                        >
                            <option value="A4">Formato A4</option>
                            <option value="t80mm">Ticket 80mm</option>
                        </select>
                        <button
                            onClick={handleVistaPrevia}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                        >
                            Actualizar
                        </button>
                    </div>

                    {pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            title="Vista previa PDF"
                            className="border-0 w-full h-[calc(100vh-100px)]"
                        />
                    )}


                </Dialog>
            </div>
        </div>
    );
}
