import { Routes, Route } from "react-router-dom";
import MainLayout from "@layouts/MainLayout";
import Dashboard from "@modules/dashboard/Dashboard";
import Login from "@modules/auth/Login";
import Register from "@modules/auth/Register";
import VentasView from "@modules/ventas/VentasView";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas con Sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ventas" element={<VentasView />} />
      </Route>
    </Routes>
  );
}
