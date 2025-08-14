import {Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../modules/dashboard/Dashboard";
import Login from "../modules/auth/Login";
import Register from "../modules/auth/Register";

export default function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
  );
}
