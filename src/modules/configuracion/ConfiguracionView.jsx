import { menuItemsConfig } from "@constants/menuItemsConstants";
import { menuActionsConfig } from "@utils/menuActions";
import { useNavigate } from "react-router-dom";

export default function ConfiguracionView() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Configuración</h2>
      <div>
        {menuItemsConfig.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => menuActionsConfig[item.action]({ navigate })}
            >
              <Icon />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
