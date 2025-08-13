import { Routes, Route } from "react-router-dom";
import Login from "./modules/auth/Login";
<<<<<<< HEAD
import Register from "./modules/auth/Register";
=======
import './index.css'; 
>>>>>>> 9916f679541022c8639efd2fdde2da62f712d65d

export default function App(){
  return (
<<<<<<< HEAD
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
=======
      <Login />
>>>>>>> 9916f679541022c8639efd2fdde2da62f712d65d
  );
}

