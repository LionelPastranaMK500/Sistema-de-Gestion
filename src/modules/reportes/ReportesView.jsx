import { menuItemsReportes } from "@constants/menuItemsConstants";
import { menuActionsReportes } from "@utils/menuActions";
import { useNavigate } from "react-router-dom";

export default function ReportesView() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Reportes</h2>
            <div>
                {menuItemsReportes.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button key={index} onClick={() => menuActionsReportes[item.action]({ navigate })}>
                            <Icon></Icon>
                            <span>{item.name}</span>
                            <span>{item.description}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

