import { useState } from "react";
import { MoreVertIcon } from "../constants/iconsConstants";
import { menuItems } from "../constants/menuItemsConstants";

export default function Sidebar() {
    const [showConfig, setShowConfig] = useState(false);
    return (
        <aside >
            <div>
                <img src="/images/Logo_WolfFur.webp" />
                <MoreVertIcon onClick={() => setShowConfig(!showConfig)} />
                {showConfig && 
                <div>
                    <h6>Empresa Seleccionada</h6>
                    <a href=""><div>Gestionar plan</div></a>
                    <a href=""><div>Ordenes de pago</div></a>

                    <hr />

                    <h3>Usuario</h3>
                    <a href=""><div>Registrar nueva empresa</div></a>
                    <a href=""><div>Cambiar contraseña</div></a>
                    <a href=""><div>Cerrar sesión</div></a>
                </div>
                }
            </div>

            <div>
                <div>
                    <p>Nombre</p>
                    <p>Empresa S.A</p>
                </div>
                <div>
                    <p>Surcusal</p>
                    <p>Arduino KE</p>
                </div>
            </div>

            <nav>
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button key={index}>
                            <Icon /> 
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );

}
