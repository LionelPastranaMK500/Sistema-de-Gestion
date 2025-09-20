import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@layouts/MainLayout";
import AuthLayout from "@layouts/AuthLayout";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

//modulos common
const NotFound = lazy(() => import("@modules/common/NotFound"));
//modulos publi
const Login = lazy(() => import("@modules/auth/Login"));
const Register = lazy(() => import("@modules/auth/Register"));
const ResetPassword = lazy(() => import("@modules/auth/ResetPassword"));

//modulos priv
const SunatForm = lazy(() => import("@modules/auth/SunatForm"));
const Dashboard = lazy(() => import("@modules/dashboard/Dashboard"));
const EstadisticasView = lazy(() => import("@modules/estadisticas/EstadisticasView"));
const VentasView = lazy(() => import("@modules/ventas/VentasView"));
const GuiaRemision = lazy(() => import("@modules/guia_remision/GuiaRemisionView"));
const FacturasView = lazy(() => import("@modules/facturas/FacturasView"));
const ProformasView = lazy(() => import("@modules/proformas/ProformasView"));
const ClienteView = lazy(() => import("@modules/clientes/ClientesView"));
const ProductosView = lazy(() => import("@modules/productos/ProductosView"));

//modulo config
const ConfiguracionView = lazy(() => import("@modules/configuracion/ConfiguracionView"));
const ConfigurarEmpresa = lazy(() => import("@modules/configuracion/items/ConfigurarEmpresa"));
const ConfigurarUsuario = lazy(() => import("@modules/configuracion/items/ConfigurarUsuario"));
const ConfigurarAlmacen = lazy(() => import("@modules/configuracion/items/ConfigurarAlmacen"));
const ConfigurarSucursal = lazy(() => import("@modules/configuracion/items/ConfigurarSucursal"));
const ConfigurarImpresion = lazy(() => import("@modules/configuracion/items/ConfigurarImpresion"));

//modulo reportes
const ReportesView = lazy(() => import("@modules/reportes/ReportesView"));
const ReporteVentasGeneral = lazy(() => import("@modules/reportes/items/ReporteVentasGeneral"));
const ReporteVentasDetallado = lazy(() => import("@modules/reportes/items/ReporteVentasDetallado"));
const ReporteClientesProveedores = lazy(() => import("@modules/reportes/items/ReporteClientesProveedores"));
const ReporteProductos = lazy(() => import("@modules/reportes/items/ReporteProductos"));
const ReporteGuias = lazy(() => import("@modules/reportes/items/ReporteGuias"));


export default function AppRoutes() {
  return (
    <Suspense fallback={'Cargando....'}>
      <Routes>
        {/* publicas */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* sidebar priv*/}
        <Route element={<PrivateRoute />}>
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
            <Route path="/clientes" element={<ClienteView />} />
            <Route path="/productos" element={<ProductosView />} />
            <Route path="/configuracion" element={<ConfiguracionView />} />
            <Route path="/configuracion/empresa" element={<ConfigurarEmpresa />} />
            <Route path="/configuracion/usuarios" element={<ConfigurarUsuario />} />
            <Route path="/configuracion/almacenes" element={<ConfigurarAlmacen />} />
            <Route path="/configuracion/sucursales" element={<ConfigurarSucursal />} />
            <Route path="/configuracion/impresion" element={<ConfigurarImpresion />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
