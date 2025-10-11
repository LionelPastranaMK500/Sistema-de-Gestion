import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarios } from "@services/generadorData";
import {
    KeyboardArrowLeftIcon,
    MoreVertIcon,
    PermIdentityTwoToneIcon
} from "@constants/iconsConstants";
import UsuarioModal from "../components/UsuarioModal"; // Importamos el nuevo modal

export default function UsuariosView() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    // Estado para controlar el modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const usuariosFicticios = getUsuarios().map(u => ({
            ...u,
            nombreCompleto: `${u.nombres} ${u.apellidoPaterno}`.toUpperCase()
        }));
        setUsers(usuariosFicticios);
    }, []);

    // Función para abrir el modal en modo "Agregar"
    const handleAddUser = () => {
        setModalMode('add');
        setSelectedUser(null);
        setModalVisible(true);
    };

    // Función para abrir el modal en modo "Editar"
    const handleEditUser = (user) => {
        setModalMode('edit');
        setSelectedUser(user);
        setModalVisible(true);
    };

    return (
        <>
            <div className="flex flex-col w-full h-full bg-gray-50 overflow-y-auto">
                {/* Header: Título y botones de acción */}
                <div className="flex justify-between items-center p-6 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/configuracion')}
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                            aria-label="Volver a configuración"
                        >
                            <KeyboardArrowLeftIcon />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
                    </div>
                    <button
                        onClick={handleAddUser} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        AGREGAR
                    </button>
                </div>

                {/* Contenido: Lista de usuarios */}
                <div className="flex-1 px-6">
                    <div className="flex px-6 py-3">
                        <div className="w-1/2 font-semibold text-gray-500 text-sm">CUENTA</div>
                        <div className="w-1/2 font-semibold text-gray-500 text-sm">ROL</div>
                    </div>
                    <div className="space-y-3">
                        {users.map((user) => (
                            <div key={user.correo} className="bg-white shadow-md rounded-lg flex items-center p-4">
                                <div className="w-1/2 flex items-center gap-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <PermIdentityTwoToneIcon className="text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{user.nombreCompleto}</p>
                                        <p className="text-sm text-gray-500">{user.correo}</p>
                                    </div>
                                </div>
                                <div className="w-1/2 flex items-center justify-between">
                                    <p className="font-medium text-gray-700">{user.rol}</p>
                                    <button
                                        onClick={() => handleEditUser(user)} 
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        aria-label="Más opciones"
                                    >
                                        <MoreVertIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <UsuarioModal
                visible={modalVisible}
                mode={modalMode}
                userData={selectedUser}
                onHide={() => setModalVisible(false)}
            />
        </>
    );
}