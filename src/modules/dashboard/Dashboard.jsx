import { getActiveUser } from "@services/auth/authServices";

const Dashboard = () => {
    const usuario = getActiveUser();

    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-center">
                <h1 className="mb-2 font-bold text-4xl text-gray-800">
                    ¡Bienvenido/a!
                </h1>
                <p className="text-2xl text-gray-600">
                    {usuario ? `${usuario.nombres} ${usuario.apellidoPaterno}` : ""}
                </p>
            </div>
        </div>
    );
}

export default Dashboard;