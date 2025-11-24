import React from 'react';
import { TabHeader, EmptyTabContent } from '@/components/data-display/TabHelpers';

const columns = [
    { label: "Comprobante", className: "col-span-3" },
    { label: "Sucursal", className: "col-span-2" },
    { label: "Vendedor", className: "col-span-3" },
    { label: "Total", className: "col-span-2" },
    { label: "Fecha de registro", className: "col-span-2" },
];

const ClienteTabProformas = () => {
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

export default ClienteTabProformas;
