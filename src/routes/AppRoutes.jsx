import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@layouts/MainLayout";
import Dashboard from "@modules/dashboard/Dashboard";
import Login from "@modules/auth/Login";
import Register from "@modules/auth/Register";
import ResetPassword from "../modules/auth/Reset_Password";
import VentasView from "@modules/ventas/VentasView";
import FacturasView from "@modules/facturas/FacturasView";
import EstadisticasView from "@modules/estadisticas/EstadisticasView";
import ProformasView from "@modules/proformas/ProformasView";
import ClienteView from "@modules/clientes/ClientesView";
import ProductosView from "@modules/productos/ProductosView";
import SunatForm from "@modules/auth/SunatForm";
import GuiaRemision from "@modules/guia_remision/GuiaRemisionView";

//modulo config
import ConfiguracionView from "@modules/configuracion/ConfiguracionView";
import ConfigurarEmpresa from "@modules/configuracion/items/ConfigurarEmpresa";
import ConfigurarUsuario from "@modules/configuracion/items/ConfigurarUsuario";
import ConfigurarAlmacen from "@modules/configuracion/items/ConfigurarAlmacen";
import ConfigurarSucursal from "@modules/configuracion/items/ConfigurarSucursal";
import ConfigurarImpresion from "@modules/configuracion/items/ConfigurarImpresion";

//modulo reportes
import ReportesView from "@modules/reportes/ReportesView";
import ReporteVentasGeneral from "@modules/reportes/items/ReporteVentasGeneral";
import ReporteVentasDetallado from "@modules/reportes/items/ReporteVentasDetallado";
import ReporteClientesProveedores from "@modules/reportes/items/ReporteClientesProveedores";
import ReporteProductos from "@modules/reportes/items/ReporteProductos";
import ReporteGuias from "@modules/reportes/items/ReporteGuias";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword/>}/>

      {/* Rutas con Sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/welcome" element={<SunatForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/estadistica" element={<EstadisticasView />} />
        <Route path="/ventas" element={<VentasView />} />
        <Route path="/guia_remision" element={<GuiaRemision />} />
        <Route path="/facturas" element={<FacturasView />} />
        <Route path="/proformas" element={<ProformasView />} />
        <Route path="/reportes" element={<ReportesView />} />
        <Route path="/reportes/ventas_general" element={<ReporteVentasGeneral />} />
        <Route path="/reportes/ventas_detallado" element={<ReporteVentasDetallado />} />
        <Route path="/reportes/productos" element={<ReporteProductos />} />
        <Route path="/reportes/clientes_proveedores" element={<ReporteClientesProveedores />} />
        <Route path="/reportes/guias" element={<ReporteGuias />} />
        <Route path="/cliente" element={<ClienteView />} />
        <Route path="/producto" element={<ProductosView />} />
        <Route path="/configuracion" element={<ConfiguracionView />} />
        <Route path="/configuracion/empresa" element={<ConfigurarEmpresa />} />
        <Route path="/configuracion/usuarios" element={<ConfigurarUsuario />} />
        <Route path="/configuracion/almacenes" element={<ConfigurarAlmacen />} />
        <Route path="/configuracion/sucursales" element={<ConfigurarSucursal />} />
        <Route path="/configuracion/impresion" element={<ConfigurarImpresion />} />
      </Route>
    </Routes>
  );
}
