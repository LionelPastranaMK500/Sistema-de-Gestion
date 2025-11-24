import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@layouts/MainLayout";
import AuthLayout from "@layouts/AuthLayout";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import PublicLoader from "@components/feedback/PublicLoader";
import ContentLoader from "@components/feedback/ContentLoader";

//modulos common
import NotFound from "@modules/common/NotFound";
//modulos publi
import Login from "@auth/Login";
import Register from "@auth/Register";
import ResetPassword from "@auth/ResetPassword";
//modulos priv
const SunatForm = lazy(() => import("@auth/SunatForm"));
const Dashboard = lazy(() => import("@dashboard/Dashboard"));
const EstadisticasView = lazy(() => import("@estadistica/EstadisticasView"));
const VentasView = lazy(() => import("@ventas/VentasView"));
const GuiaRemision = lazy(() => import("@guias/GuiaRemisionView"));
const FacturasView = lazy(() => import("@facturas/FacturasView"));
const ProformasView = lazy(() => import("@proformas/ProformasView"));
const ClienteView = lazy(() => import("@cliente/ClientesView"));
const ProductosView = lazy(() => import("@productos/ProductosView"));
//modulo config
const ConfiguracionView = lazy(() => import("@configuracion/ConfiguracionView"));
const ConfigurarEmpresa = lazy(() => import("@configuracion/pages/ConfigurarEmpresa"));
const ConfigurarUsuario = lazy(() => import("@configuracion/pages/ConfigurarUsuario"));
const ConfigurarAlmacen = lazy(() => import("@configuracion/pages/ConfigurarAlmacen"));
const ConfigurarSucursal = lazy(() => import("@configuracion/pages/ConfigurarSucursal"));
const ConfigurarImpresion = lazy(() => import("@configuracion/pages/ConfigurarImpresion"));
//modulo reportes
const ReportesView = lazy(() => import("@reportes/ReportesView"));
const ReporteVentasGeneral = lazy(() => import("@reportes/components/ReporteVentasGeneral"));
const ReporteClientesProveedores = lazy(() => import("@reportes/components/ReporteClientesProveedores"));
const ReporteProductos = lazy(() => import("@reportes/components/ReporteProductos"));
const ReporteGuiasRemision = lazy(() => import("@reportes/components/ReporteGuiasRemision"));


const AppRoutes = () => {
  return (
    <Routes>
      {/* publicas */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Suspense fallback={<PublicLoader />}><Login /></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<PublicLoader />}><Register /></Suspense>} />
          <Route path="/reset-password" element={<Suspense fallback={<PublicLoader />}><ResetPassword /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* privadas */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/welcome" element={<Suspense fallback={<ContentLoader />}><SunatForm /></Suspense>} />
          <Route path="/dashboard" element={<Suspense fallback={<ContentLoader />}><Dashboard /></Suspense>} />
          <Route path="/estadistica" element={<Suspense fallback={<ContentLoader />}><EstadisticasView /></Suspense>} />
          <Route path="/ventas" element={<Suspense fallback={<ContentLoader />}><VentasView /></Suspense>} />
          <Route path="/guia_remision" element={<Suspense fallback={<ContentLoader />}><GuiaRemision /></Suspense>} />
          <Route path="/facturas" element={<Suspense fallback={<ContentLoader />}><FacturasView /></Suspense>} />
          <Route path="/proformas" element={<Suspense fallback={<ContentLoader />}><ProformasView /></Suspense>} />
          <Route path="/reportes/*" element={<Suspense fallback={<ContentLoader />}><ReportesView /></Suspense>}>
            <Route path="ventas_general" element={<ReporteVentasGeneral />} />
            <Route path="productos" element={<ReporteProductos />} />
            <Route path="clientes_proveedores" element={<ReporteClientesProveedores />} />
            <Route path="guia_remision" element={<ReporteGuiasRemision />} />
          </Route>
          <Route path="/clientes" element={<Suspense fallback={<ContentLoader />}><ClienteView /></Suspense>} />
          <Route path="/productos" element={<Suspense fallback={<ContentLoader />}><ProductosView /></Suspense>} />
          <Route path="/configuracion/*" element={<Suspense fallback={<ContentLoader />}><ConfiguracionView /></Suspense>}>
            <Route path="empresa" element={<ConfigurarEmpresa />} />
            <Route path="usuarios" element={<ConfigurarUsuario />} />
            <Route path="almacenes" element={<ConfigurarAlmacen />} />
            <Route path="sucursales" element={<ConfigurarSucursal />} />
            <Route path="impresion" element={<ConfigurarImpresion />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
