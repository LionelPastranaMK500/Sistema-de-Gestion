import { Calendar } from "primereact/calendar";
import { configCalendar } from "@utils/configCalendar";
import { useEffect, useState } from "react";
import { guiaTabsClienteProveedor } from "@constants/menuItemsConstants";
import { CloseIcon, RemoveCircleIcon, AddIcon } from "@constants/iconsConstants";

const ClienteNuevo = ({ onClose })  => {
    const [activeTab, setActiveTab] = useState("infoBasica");

    useEffect(() => {
        configCalendar();
    }, []);

    return (
        <div className="z-10 fixed inset-0 flex justify-center items-center">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative flex flex-col bg-white shadow-2xl rounded-xl w-[min(980px,95vw)] max-h-[92vh] overflow-hidden">
                <div className="flex justify-between items-center bg-blue-700 px-5 py-4 text-white">
                    <h3>Cliente / Proveedor</h3>
                    <button
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* tabs */}
                <div className="bg-blue-700 px-3">
                    <div className="flex gap-2 overflow-x-auto">
                        {guiaTabsClienteProveedor.map((tab) => {
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

                <div className="flex-1 bg-white px-5 py-5 overflow-y-auto">
                    {activeTab === "infoBasica" && (
                        <div className="gap-4 grid grid-cols-12">
                            <div className="col-span-12 md:col-span-6">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Tipo Documento</label>
                                <select required className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm">
                                    <option></option>
                                    <option>DNI</option>
                                    <option>RUC</option>
                                </select>
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <input type="text" placeholder="Numero Documento" required />
                            </div>

                            <div className="col-span-12">
                                <input
                                    type="text"
                                    placeholder="Nombre o Razon Social"
                                    required
                                    className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                />
                            </div>

                            <div className="col-span-12 md:col-span-6">
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        required
                                        className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                    />
                                </div>
                            </div>
 
                            <div className="col-span-12 md:col-span-6">
                                <label className="block mb-1 font-medium text-gray-500 text-xs">Telefono</label>
                                <input
                                    type="text"
                                    placeholder="+51"
                                    required
                                    className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"
                                />
                            </div>

                            <div>
                                <input type="text" placeholder="Dirección Principal" />
                            </div>

                            <div>
                                <textarea name="" id="" placeholder="Observaciones adicionales"></textarea>
                            </div>
                        </div>
                    )}

                    {activeTab === "ventas" && (
                        <div>

                        </div>
                    )}

                    {activeTab === "proformas" && (
                        <div>
                            <div>


                            </div>
                        </div>
                    )}
                </div>

                {/* footer pegado */}
                <div className="bottom-0 sticky flex justify-end items-center gap-3 bg-white px-5 py-3 border-t">
                    <button
                        onClick={onClose}
                        className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 text-sm"
                    >
                        Cancelar
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-white text-sm">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ClienteNuevo;
