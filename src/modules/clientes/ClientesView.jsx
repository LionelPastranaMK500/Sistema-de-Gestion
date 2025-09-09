import React, { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Avatar } from "primereact/avatar";
import { Button } from 'primereact/button';
import { MoreVertIcon } from '@constants/iconsConstants';
import { DataView } from "primereact/dataview";
import { clientes } from '@services/generadorData';

export default function ClientesView() {
    const [search, setSearch] = useState('');
    const [filteredClientes, setFilteredClientes] = useState([]);

    useEffect(() => {
        setFilteredClientes(clientes);
    }, []);

    const searchClientes = (e) => {
        const query = e.query.toLowerCase();
        setSearch(query);

        const results = clientes.filter(c =>
            c.razonSocial.toLowerCase().includes(query.toLowerCase()) ||
            c.documento.includes(query)
        );
        setFilteredClientes(results);
    };

    const clienteTemplate = (cliente) => (
        <div>
            <Avatar label={cliente.razonSocial.charAt(0)} size="large" shape="circle" />
            <div>
                <div>{cliente.razonSocial}</div>
                <div>
                    <Avatar label="RUC" size="small" shape="circle"/>
                    <small>{cliente.documento}</small>
                </div>
                <Button icon={<MoreVertIcon />}/>
            </div>
        </div>
    );

    const listTemplate = (items) => {
        if (!items || items.length === 0) return <div>No hay Clientes o Proveedores</div>;
        return <div>{items.map(clienteTemplate)}</div>;
    };

    return (
        <div className="card">
            <h3>Buscar Cliente</h3>

            <div>
                <AutoComplete
                    value={search}
                    onChange={searchClientes}
                    placeholder="Buscar...."
                    emptyMessage="No se encontraron Clientes o Proveedores"
                />

                <Button
                    label="Registrar Nuevo"
                />
                <Button icon={<MoreVertIcon />}/>
            </div>


            <DataView
                value={filteredClientes}
                listTemplate={listTemplate}
                layout="list"
            />     

        </div >
    );
}
