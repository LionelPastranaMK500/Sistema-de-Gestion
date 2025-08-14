import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../modules/dashboard/Dashboard";

export default function MainLayout(){
    return(
        <div>
            <Sidebar/>
            <main>
                <Outlet/>
            </main>
        </div>
    );
}