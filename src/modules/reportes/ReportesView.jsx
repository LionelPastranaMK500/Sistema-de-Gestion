import ReportesButtons from "./ReportesButtons";
import { Outlet } from "react-router-dom";

const ReportesView = () => {
    return (
        <div className="flex flex-col w-full h-full">
            <ReportesButtons/>
            <Outlet />
        </div>
    );
}


export default ReportesView;
