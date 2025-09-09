import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { MoreVertIcon } from '@constants/iconsConstants';
import { productos } from '@services/generadorData';

export default function ProductosView() {
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [search, setSearch] = useState('');

    const defaultImage = "https://via.placeholder.com/40x40?text=Prod";

    useEffect(() => {
        setFilteredProductos(productos);
    }, []);

    const onSearchChange = (e) => {
        const query = e.value;
        setSearch(query);

        const filtered = productos.filter(p =>
            p.descripcion.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProductos(filtered);
    };

    const itemTemplate = (producto) => {
        return (
            <div>
                <img
                    src={defaultImage}
                    alt={producto.descripcion}
                />
                <div>
                    <span>{producto.descripcion}</span>
                    <span>Código: {producto.codigo}</span>
                    <span>
                        Categoría: {producto.categoria || "SIN CATEGORÍA"} | Unidades: {producto.unidad}
                    </span>
                </div>
                <div>
                    <span>${producto.precio.toFixed(2)}</span>
                    <Button label="Ver Stock"/>
                    <Button icon={<MoreVertIcon />}/>
                </div>
            </div>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return <div>No hay productos</div>;
        return <div>{items.map(itemTemplate)}</div>;
    };

    return (
        <div>
            <h2>Productos / Servicios</h2>
            <div>
                <AutoComplete
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Buscar..."
                    emptyMessage="No se encontraron productos"
                />
                <Button label="Registrar Nuevo"/>
                <Button icon={<MoreVertIcon />}/>
            </div>
            <DataView value={filteredProductos} listTemplate={listTemplate} />
        </div>
    );
}
