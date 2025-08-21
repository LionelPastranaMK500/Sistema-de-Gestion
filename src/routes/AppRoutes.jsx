import { Routes, Route,Navigate} from "react-router-dom";
import MainLayout from "@layouts/MainLayout";
import Dashboard from "@modules/dashboard/Dashboard";
import Login from "@modules/auth/Login";
import Register from "@modules/auth/Register";
import VentasView from "@modules/ventas/VentasView";
import FacturasView from "@modules/facturas/FacturasView";
import EstadisticasView from "@modules/estadisticas/EstadisticasView";
import ProformasView from "@modules/proformas/ProformasView";
import ReportesView from "@modules/reportes/ReportesView";
import ClienteView from "@modules/clientes/ClienteView";
import ProductosView from "@modules/productos/ProductosView";
import ConfiguracionView from "@modules/configuracion/ConfiguracionView";
import SunatForm from "@modules/auth/SunatForm";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas con Sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/welcome" element={<SunatForm/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/estadistica" element={<EstadisticasView/>}/>
        <Route path="/ventas" element={<VentasView />} />
        <Route path="/facturas" element={<FacturasView />} />
        <Route path="/proformas" element={<ProformasView />} />
        <Route path="/reportes" element={<ReportesView />} />
        <Route path="/cliente" element={<ClienteView/>} />
        <Route path="/producto" element={<ProductosView/>} />
        <Route path="/configuracion" element={<ConfiguracionView/>} />
      </Route>
    </Routes>
  );
}
