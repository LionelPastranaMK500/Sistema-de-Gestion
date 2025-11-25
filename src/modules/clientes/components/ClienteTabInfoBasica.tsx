import React from 'react';

const ClienteTabInfoBasica = () => {
    return (
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
                <input type="text" placeholder="Numero Documento" required className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm" />
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

            <div className="col-span-12">
                <input type="text" placeholder="Dirección Principal" className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm" />
            </div>

            <div className="col-span-12">
                <textarea name="" id="" placeholder="Observaciones adicionales" className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-200 w-full text-sm"></textarea>
            </div>
        </div>
    );
}

export default ClienteTabInfoBasica;
