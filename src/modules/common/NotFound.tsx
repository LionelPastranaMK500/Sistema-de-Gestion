import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <main className="flex flex-col justify-center items-center bg-gray-100 min-h-screen text-gray-800">
            <h1 className="font-bold text-blue-600 text-9xl">404</h1>
            <div className="mt-4 font-medium text-2xl">
                Página no encontrada
            </div>
            <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 shadow mt-8 px-6 py-3 rounded-lg text-white transition-colors"
            >
                Ir al inicio
            </Link>
        </main>
    );
}
