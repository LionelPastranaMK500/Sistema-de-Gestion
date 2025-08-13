import { Routes, Route } from "react-router-dom";
import Login from "./modules/auth/Login";
import Register from "./modules/auth/Register";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

