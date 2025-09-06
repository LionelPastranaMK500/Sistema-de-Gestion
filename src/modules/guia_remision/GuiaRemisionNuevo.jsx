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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            {/* modal */}
            <div className="relative z-10 flex max-h-[92vh] w-[min(980px,95vw)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                {/* header */}
                <div className="flex items-center justify-between bg-blue-700 px-5 py-4 text-white">
                    <h3 className="text-lg font-semibold">Guía de Remisión - Remitente</h3>
                    <button
                        onClick={onClose}
                        className="rounded p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                        aria-label="Cerrar"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* tabs */}
                <div className="bg-blue-700 px-3">
                    <div className="flex gap-2 overflow-x-auto">
                        {guiaTabs.map((tab) => {
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
                                        <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t bg-white"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* body (scrollable) */}
                <div className="flex-1 overflow-y-auto bg-white px-5 py-5">
                    {/* INFO BÁSICA */}
                    {activeTab === "infoBasica" && (
                        <div className="grid grid-cols-12 gap-4">
                            {/* Serie */}
                            <div className="col-span-12 md:col-span-6">
                                <label className="mb-1 block text-xs font-medium text-gray-500">Serie *</label>
                                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                    <option value="T004">T004</option>
                                </select>
                            </div>
                            {/* Fecha emisión */}
                            <div className="col-span-12 md:col-span-6">
                                <label className="mb-1 block text-xs font-medium text-gray-500">Fecha de emisión</label>
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
                                <label className="mb-1 block text-xs font-medium text-gray-500">Destinatario *</label>
                                <input
                                    type="search"
                                    placeholder="Destinatario"
                                    required
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            {/* Observaciones */}
                            <div className="col-span-12">
                                <label className="mb-1 block text-xs font-medium text-gray-500">Observaciones</label>
                                <input
                                    type="text"
                                    placeholder="Observaciones"
                                    required
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            {/* Origen / Destino títulos */}
                            <div className="col-span-12 md:col-span-6">
                                <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500">ORIGEN</p>
                                <div className="space-y-3">
                                    <input
                                        type="search"
                                        placeholder="Ubigeo *"
                                        required
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dirección *"
                                        required
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500">DESTINO</p>
                                <div className="space-y-3">
                                    <input
                                        type="search"
                                        placeholder="Ubigeo *"
                                        required
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dirección *"
                                        required
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "datosEnvio" && (
                        <div className="grid grid-cols-12 gap-4">
                            {/* Tipo del envío */}
                            <div className="col-span-12 md:col-span-6">
                                <label className="mb-1 block text-xs font-medium text-gray-500">Tipo del envío *</label>
                                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                    <option>OTROS</option>
                                    <option>VENTA SUJETA A CONFIRMACION DEL COMPRADOR</option>
                                    <option>TRASLADO EMISOR ITINERANTE DE COMPROBANTES DE PAGO</option>
                                    <option>VENTA</option>
                                </select>
                            </div>

                            {/* Fecha del envío */}
                            <div className="col-span-12 md:col-span-6">
                                <label className="mb-1 block text-xs font-medium text-gray-500">Fecha del envío</label>
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
                                <label className="mb-1 block text-xs font-medium text-gray-500">Cantidad de bultos *</label>
                                <input
                                    type="text"
                                    placeholder="0"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="mb-1 block text-xs font-medium text-gray-500">Peso total *</label>
                                <input
                                    type="text"
                                    placeholder="0.00"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="mb-1 block text-xs font-medium text-gray-500">Peso total (Unidad) *</label>
                                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                    <option>KILOGRAMOS</option>
                                    <option>TONELADAS</option>
                                </select>
                            </div>

                            {/* ---------- TRASLADO ---------- */}
                            <div className="col-span-12">
                                <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500">TRASLADO</p>
                                <div className="grid grid-cols-12 gap-4">
                                    {/* Modalidad */}
                                    <div className="col-span-12">
                                        <label className="mb-1 block text-xs font-medium text-gray-500">Modalidad *</label>
                                        <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                            <option>TRANSPORTE PUBLICO</option>
                                            <option>TRANSPORTE PRIVADO</option>
                                        </select>
                                    </div>

                                    {/* Switch M1 o L */}
                                    <div className="col-span-12">
                                        <label className="flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700">
                                            <span>Traslado en vehículos de categoría M1 o L (Sin datos del transporte)</span>
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                            />
                                            {/* simple switch */}
                                            <span className="ml-3 inline-flex h-6 w-10 items-center rounded-full bg-gray-300 transition peer-checked:bg-blue-600">
                                                <span className="ml-1 inline-block h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-4"></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* ---------- TRANSPORTISTA ---------- */}
                            <div className="col-span-12">
                                <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500">TRANSPORTISTA</p>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <label className="mb-1 block text-xs font-medium text-gray-500">Empresa de transporte *</label>
                                        <div className="relative">
                                            <input
                                                type="search"
                                                placeholder="Empresa de transporte"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            />
                                            <i className="pi pi-search pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Registrar vehículos/conductores */}
                                    <div className="col-span-12">
                                        <label className="flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700">
                                            <span>Registrar vehículos y conductores del transportista</span>
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                            />
                                            <span className="ml-3 inline-flex h-6 w-10 items-center rounded-full bg-gray-300 transition peer-checked:bg-blue-600">
                                                <span className="ml-1 inline-block h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-4"></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* ---------- DOCUMENTOS RELACIONADOS ---------- */}
                            <div className="col-span-12">
                                <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500">DOCUMENTOS RELACIONADOS</p>
                                <button
                                    type="button"
                                    className="w-full rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-center text-sm font-semibold text-blue-600 hover:bg-blue-100"
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
                                    className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200"
                                >
                                    <div className="grid grid-cols-12 items-center gap-3 p-3">
                                        {/* Placeholder imagen */}
                                        <div className="col-span-12 sm:col-span-2">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                                                <i className="pi pi-image" />
                                            </div>
                                        </div>

                                        {/* Campos (Nombre, Cantidad, Detalle) */}
                                        <div className="col-span-12 sm:col-span-9">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-500">Nombre</label>
                                                    <input
                                                        type="text"
                                                        value={producto.descripcion}
                                                        readOnly
                                                        className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-12 gap-3">
                                                    <div className="col-span-12 sm:col-span-4">
                                                        <label className="mb-1 block text-xs font-medium text-gray-500">Cantidad</label>
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
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                        />
                                                    </div>
                                                    <div className="col-span-12 sm:col-span-8">
                                                        <label className="mb-1 block text-xs font-medium text-gray-500">Detalle adicional</label>
                                                        <input
                                                            type="text"
                                                            value={producto.detalle}
                                                            onChange={(e) => {
                                                                const nuevoDetalle = e.target.value;
                                                                setProductoSeleccionado((prev) =>
                                                                    prev.map((p, i) => (i === index ? { ...p, detalle: nuevoDetalle } : p))
                                                                );
                                                            }}
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quitar producto */}
                                        <div className="col-span-12 sm:col-span-1 flex justify-end">
                                            <button
                                                className="rounded-md p-2 text-red-600 hover:bg-red-50"
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
                                className="w-full rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-center text-sm font-semibold uppercase tracking-wide text-blue-600 hover:bg-blue-100"
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
                <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-white px-5 py-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        CANCELAR
                    </button>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        PROCESAR
                    </button>
                </div>
            </div>
        </div>
    );
}
