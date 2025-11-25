import { Calendar } from "primereact/calendar";
import { configCalendar } from "@/utils/calendar/configCalendar";
import { useEffect, useState } from "react";
import { guiaTabsGuiaRemision } from "@constants/menuItems";
import { CloseIcon, RemoveCircleIcon } from "@constants/icons";
import AgregarProductoModal from "./components/AgregarProductoModal";

const GuiaRemisionNuevo = ({ onClose }) => {
    const [fechaEnvio, setFechaEnvio] = useState(null);
    const [activeTab, setActiveTab] = useState("infoBasica");
    const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState([]);

    useEffect(() => {
        configCalendar();
    }, []);

    return (
        <div className="z-10 fixed inset-0 flex justify-center items-center">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/50" />
            {/* modal */}
            <div className="relative flex flex-col bg-white shadow-2xl rounded-xl w-[min(980px,95vw)] max-h-[92vh] overflow-hidden">
                {/* header */}
                <div className="flex justify-between items-center bg-blue-700 px-5 py-4 text-white">
                    <h3 className="font-semibold text-lg">Guía de Remisión - Remitente</h3>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/10 p-1 rounded focus:outline-none focus:ring-2 focus:ring-white/40"
                        aria-label="Cerrar"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* tabs */}
                <div className="bg-blue-700 px-3">
                    <div className="flex gap-2 overflow-x-auto">
                        {guiaTabsGuiaRemision.map((tab) => {
                            const Icon = tab.icon;
                            const active = activeTab === tab.action;
                            return (
                                <button
                                    key={tab.action}
                                    onClick={() => setActiveTab(tab.action)}
                                    className={`relative flex items-center gap-2 px-4 py-3 text-sm uppercase tracking-wide text-white/90
                    hover:text-white transition ${active ? "font-semibold" : ""}`}
                                >
                                    <Icon />
                                    {tab.name}
                                    {active && (
                                        <span className="right-0 bottom-0 left-0 absolute bg-white rounded-t h-[3px]"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* body (scrollable) */}
                <div className="flex-1 bg-white px-5 py-5 overflow-y-auto">
                    {/* INFO BÁSICA */}
                    {activeTab === "infoBasica" && (
                        <div className="gap-4 grid grid-cols-12">
                            {/* Serie */}
                            <div className="col-span-12 md:col-span-6">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Serie *</label>
                                <select className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm">
                                    <option value="T004">T004</option>
                                </select>
                            </div>
                            {/* Fecha emisión */}
                            <div className="col-span-12 md:col-span-6">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Fecha de emisión</label>
                                <Calendar
                                    value={fechaEnvio}
                                    onChange={(e) => setFechaEnvio(e.value)}
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    className="w-full"
                                    inputClassName="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            {/* Destinatario */}
                            <div className="col-span-12">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Destinatario *</label>
                                <input
                                    type="search"
                                    placeholder="Destinatario"
                                    required
                                    className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                />
                            </div>

                            {/* Observaciones */}
                            <div className="col-span-12">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Observaciones</label>
                                <input
                                    type="text"
                                    placeholder="Observaciones"
                                    required
                                    className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                />
                            </div>

                            {/* Origen / Destino títulos */}
                            <div className="col-span-12 md:col-span-6">
                                <p className="mb-2 font-semibold text-gray-500 text-xs tracking-wide">ORIGEN</p>
                                <div className="space-y-3">
                                    <input
                                        type="search"
                                        placeholder="Ubigeo *"
                                        required
                                        className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dirección *"
                                        required
                                        className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                    />
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <p className="mb-2 font-semibold text-gray-500 text-xs tracking-wide">DESTINO</p>
                                <div className="space-y-3">
                                    <input
                                        type="search"
                                        placeholder="Ubigeo *"
                                        required
                                        className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dirección *"
                                        required
                                        className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "datosEnvio" && (
                        <div className="gap-4 grid grid-cols-12">
                            {/* Tipo del envío */}
                            <div className="col-span-12 md:col-span-6">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Tipo del envío *</label>
                                <select className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm">
                                    <option>OTROS</option>
                                    <option>VENTA SUJETA A CONFIRMACION DEL COMPRADOR</option>
                                    <option>TRASLADO EMISOR ITINERANTE DE COMPROBANTES DE PAGO</option>
                                    <option>VENTA</option>
                                </select>
                            </div>

                            {/* Fecha del envío */}
                            <div className="col-span-12 md:col-span-6">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Fecha del envío</label>
                                <Calendar
                                    value={fechaEnvio}
                                    onChange={(e) => setFechaEnvio(e.value)}
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    className="w-full"
                                    inputClassName="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            {/* Bultos / Peso / Unidad */}
                            <div className="col-span-12 md:col-span-4">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Cantidad de bultos *</label>
                                <input
                                    type="text"
                                    placeholder="0"
                                    className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Peso total *</label>
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Peso total (Unidad) *</label>
                                <select className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm">
                                    <option>KILOGRAMOS</option>
                                    <option>TONELADAS</option>
                                </select>
                            </div>

                            {/* ---------- TRASLADO ---------- */}
                            <div className="col-span-12">
                                <p className="mb-2 font-semibold text-gray-500 text-xs tracking-wide">TRASLADO</p>
                                <div className="gap-4 grid grid-cols-12">
                                    {/* Modalidad */}
                                    <div className="col-span-12">
                                        <label className="block mb-1 font-medium text-gray-500 text-xs">Modalidad *</label>
                                        <select className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm">
                                            <option>TRANSPORTE PUBLICO</option>
                                            <option>TRANSPORTE PRIVADO</option>
                                        </select>
                                    </div>

                                    {/* Switch M1 o L */}
                                    <div className="col-span-12">
                                        <label className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md w-full text-gray-700 text-sm">
                                            <span>Traslado en vehículos de categoría M1 o L (Sin datos del transporte)</span>
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                            />
                                            {/* simple switch */}
                                            <span className="inline-flex items-center bg-gray-300 peer-checked:bg-blue-600 ml-3 rounded-full w-10 h-6 transition">
                                                <span className="inline-block bg-white shadow ml-1 rounded-full w-5 h-5 transition peer-checked:translate-x-4"></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* ---------- TRANSPORTISTA ---------- */}
                            <div className="col-span-12">
                                <p className="mb-2 font-semibold text-gray-500 text-xs tracking-wide">TRANSPORTISTA</p>
                                <div className="gap-4 grid grid-cols-12">
                                    <div className="col-span-12">
                                        <label className="block mb-1 font-medium text-gray-500 text-xs">Empresa de transporte *</label>
                                        <div className="relative">
                                            <input
                                                type="search"
                                                placeholder="Empresa de transporte"
                                                className="px-3 py-2 pr-10 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                            />
                                            <i className="top-1/2 right-3 absolute text-gray-400 -translate-y-1/2 pointer-events-none pi pi-search" />
                                        </div>
                                    </div>

                                    {/* Registrar vehículos/conductores */}
                                    <div className="col-span-12">
                                        <label className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md w-full text-gray-700 text-sm">
                                            <span>Registrar vehículos y conductores del transportista</span>
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                            />
                                            <span className="inline-flex items-center bg-gray-300 peer-checked:bg-blue-600 ml-3 rounded-full w-10 h-6 transition">
                                                <span className="inline-block bg-white shadow ml-1 rounded-full w-5 h-5 transition peer-checked:translate-x-4"></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* ---------- DOCUMENTOS RELACIONADOS ---------- */}
                            <div className="col-span-12">
                                <p className="mb-2 font-semibold text-gray-500 text-xs tracking-wide">DOCUMENTOS RELACIONADOS</p>
                                <button
                                    type="button"
                                    className="bg-blue-50 hover:bg-blue-100 px-4 py-2 border border-blue-300 rounded-md w-full font-semibold text-blue-600 text-sm text-center"
                                >
                                    AGREGAR DOCUMENTO
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PRODUCTOS */}
                    {activeTab === "productos" && (
                        <div className="space-y-4">
                            {/* Lista de productos */}
                            {productoSeleccionado.map((producto, index) => (
                                <div
                                    key={producto.codigo || index}
                                    className="bg-white shadow-sm rounded-xl ring-1 ring-gray-200"
                                >
                                    <div className="items-center gap-3 grid grid-cols-12 p-3">
                                        {/* Placeholder imagen */}
                                        <div className="col-span-12 sm:col-span-2">
                                            <div className="flex justify-center items-center bg-gray-100 rounded-md w-16 h-16 text-gray-400">
                                                <i className="pi pi-image" />
                                            </div>
                                        </div>

                                        {/* Campos (Nombre, Cantidad, Detalle) */}
                                        <div className="col-span-12 sm:col-span-9">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block mb-1 font-medium text-gray-500 text-xs">Nombre</label>
                                                    <input
                                                        type="text"
                                                        value={producto.descripcion}
                                                        readOnly
                                                        className="bg-white px-3 py-2 border border-gray-300 rounded-md w-full text-sm cursor-not-allowed"
                                                    />
                                                </div>

                                                <div className="gap-3 grid grid-cols-12">
                                                    <div className="col-span-12 sm:col-span-4">
                                                        <label className="block mb-1 font-medium text-gray-500 text-xs">Cantidad</label>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={producto.cantidad}
                                                            onChange={(e) => {
                                                                const nuevaCantidad = e.target.value;
                                                                setProductoSeleccionado((prev) =>
                                                                    prev.map((p, i) => (i === index ? { ...p, cantidad: nuevaCantidad } : p))
                                                                );
                                                            }}
                                                            className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                                        />
                                                    </div>
                                                    <div className="col-span-12 sm:col-span-8">
                                                        <label className="block mb-1 font-medium text-gray-500 text-xs">Detalle adicional</label>
                                                        <input
                                                            type="text"
                                                            value={producto.detalle}
                                                            onChange={(e) => {
                                                                const nuevoDetalle = e.target.value;
                                                                setProductoSeleccionado((prev) =>
                                                                    prev.map((p, i) => (i === index ? { ...p, detalle: nuevoDetalle } : p))
                                                                );
                                                            }}
                                                            className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quitar producto */}
                                        <div className="flex justify-end col-span-12 sm:col-span-1">
                                            <button
                                                className="hover:bg-red-50 p-2 rounded-md text-red-600"
                                                onClick={() =>
                                                    setProductoSeleccionado((prev) => prev.filter((_, i) => i !== index))
                                                }
                                                aria-label="Quitar producto"
                                                title="Quitar"
                                            >
                                                <RemoveCircleIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* CTA: Agregar producto */}
                            <button
                                onClick={() => setMostrarModalProducto(true)}
                                className="bg-blue-50 hover:bg-blue-100 px-4 py-2 border border-blue-300 rounded-md w-full font-semibold text-blue-600 text-sm text-center uppercase tracking-wide"
                            >
                                Agregar producto
                            </button>

                            {mostrarModalProducto && (
                                <AgregarProductoModal
                                    onClose={() => setMostrarModalProducto(false)}
                                    onSelect={(productos) => {
                                        const lista = Array.isArray(productos) ? productos : [productos];
                                        const productosConCampos = lista.map((p) => ({
                                            ...p,
                                            cantidad: p.cantidad ?? 1,   // si quieres que entre por defecto con 1
                                            detalle: p.detalle ?? "",
                                        }));
                                        setProductoSeleccionado((prev) => [...prev, ...productosConCampos]);
                                        setMostrarModalProducto(false);
                                    }}
                                />
                            )}
                        </div>
                    )}

                </div>

                {/* footer pegado */}
                <div className="bottom-0 sticky flex justify-end items-center gap-3 bg-white px-5 py-3 border-t">
                    <button
                        onClick={onClose}
                        className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 text-sm"
                    >
                        CANCELAR
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-white text-sm">
                        PROCESAR
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GuiaRemisionNuevo;
