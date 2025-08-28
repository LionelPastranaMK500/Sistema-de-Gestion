import { productosDesdeFacturas } from "@/data/dataFalsa";
import { useEffect, useState } from "react";
import { CloseIcon } from "@constants/iconsConstants";

export default function AgregarProducoModal({ onSelect, onClose }) {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtrados, setFiltrados] = useState([]);
    
    useEffect(() => {
        setProductos(productosDesdeFacturas);
    }, []);

    useEffect(() => {
        const query = busqueda.toLowerCase().trim();

        if (!query) {
            setFiltrados([]);
            return;
        }

        const resultado = productos.filter(prod =>
            prod.descripcion.toLowerCase().includes(query) ||
            (prod.codigo && prod.codigo.toLowerCase().includes(query))
        );

        setFiltrados(resultado);
    }, [busqueda, productos]);
    return (
        <div>
            <div>
                <CloseIcon />
                <input type="text" placeholder="Buscar producto/servicio" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>

            {busqueda.trim() === "" && (
                <div>
                    <img src="#" alt="" />
                    <p>Busca un producto o servicio por su descripción, código, etc.</p>
                </div>
            )}

            {busqueda.trim() !== "" && (
                <div>
                    {filtrados.length > 0 ? (
                        <ul>
                            {filtrados.map((prod) => (
                                <li key={prod.codigo || prod.descripcion}>
                                    <div onClick={() => {
                                        onSelect(prod);
                                        onClose();
                                    }}>
                                        <p>{prod.descripcion}</p>
                                        <p>{prod.unidad} {prod.codigo && `(Código: ${prod.codigo})`}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No se encontraron resultados.</p>
                    )}
                </div>
            )}
        </div>
    )
}