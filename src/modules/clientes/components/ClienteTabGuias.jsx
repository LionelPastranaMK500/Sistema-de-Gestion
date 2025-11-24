import React from 'react';
import { TabHeader, EmptyTabContent } from '@/components/data-display/TabHelpers';

const columns = [
    { label: "Documento", className: "col-span-2" },
    { label: "Sucursal", className: "col-span-2" },
    { label: "Vendedor", className: "col-span-2" },
    { label: "Origen", className: "col-span-2" },
    { label: "Destino", className: "col-span-2" },
    { label: "Fecha de registro", className: "col-span-2" },
];

const ClienteTabGuias = () => {
    const data = [];

    return (
        <div className="border rounded-md overflow-hidden">
            <TabHeader columns={columns} />
            {data.length === 0 ? (
                <EmptyTabContent />
            ) : (
                <div>
                </div>
            )}
        </div>
    );
}

export default ClienteTabGuias;
