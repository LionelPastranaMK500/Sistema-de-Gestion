import { useState } from "react";
import { validarLogin } from "../../utils/validations";
<<<<<<< HEAD
import { Link } from "react-router-dom";
=======
>>>>>>> 9916f679541022c8639efd2fdde2da62f712d65d
import ErrorText from "../../components/ErrorText";

export function LoginForm() {
    const [form, setForm] = useState({ correo: "", clave: "" });
    const [err, setErr] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErr((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errVal = validarLogin(form);
        setErr(errVal);

        if (Object.keys(errVal).length === 0) {
            console.log(form);
        }
    };

    return (
<<<<<<< HEAD
        <main>
            <aside>
                <h2>¿No tienes una cuenta?</h2>
                <Link to="/register">Crea una cuenta ahora</Link>
=======
        <main className="flex min-h-screen relative overflow-hidden">
            {/* Lado izquierdo con curva */}
            <aside className="hidden md:flex flex-col justify-center items-center w-1/2 bg-blue-700 text-white relative overflow-hidden">
                {/* Logo */}
                <div className="absolute top-6 left-6 z-10">
                    <img src="/images/Logo_WolfFur.webp" alt="Logo" className="h-20 object-contain" />
                </div>

                {/* Contenido (centrado pero desplazado un poco a la izquierda) */}
                <div className="relative z-10 text-center px-10 transform -translate-x-6">
                    <h2 className="text-3xl font-bold mb-4">¿No tienes una cuenta?</h2>
                    <a
                        href="#"
                        className="border border-white px-6 py-2 rounded hover:bg-white hover:text-blue-700 transition"
                    >
                        CREA UNA CUENTA AHORA
                    </a>
                </div>

                {/* Curva de separación (suave y circular) */}
                <div
                    className="absolute top-0 right-0 h-full w-24 md:w-20 bg-white pointer-events-none"
                    style={{
                        borderTopLeftRadius: '100% 100%',
                        borderBottomLeftRadius: '100% 100%',
                    }}
                />
>>>>>>> 9916f679541022c8639efd2fdde2da62f712d65d
            </aside>

            {/* Lado derecho */}
            <section className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-white">
                <div className="w-full max-w-sm">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-blue-800">Iniciar Sesión</h2>

<<<<<<< HEAD
                <form onSubmit={handleSubmit} noValidate className="bg-yellow-300 w-24 h-24 object-center object-none">
                    
                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            name="correo"
                            placeholder="Email"
                            onChange={handleChange}
                            value={form.correo}
                        />
                        {err.correo && <ErrorText>{err.correo}</ErrorText>}
                    </div>
                    
                    {/* Contraseña */}
                    <div>
                        <input
                            type="password"
                            name="clave"
                            placeholder="Contraseña"
                            onChange={handleChange}
                            value={form.clave}
                        />
                        {err.clave && <ErrorText>{err.clave}</ErrorText>}
                    </div>
=======
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <div>
                            <input
                                type="email"
                                name="correo"
                                placeholder="Email"
                                onChange={handleChange}
                                value={form.correo}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {err.correo && <ErrorText>{err.correo}</ErrorText>}
                        </div>

                        <div>
                            <input
                                type="password"
                                name="clave"
                                placeholder="Contraseña"
                                onChange={handleChange}
                                value={form.clave}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {err.clave && <ErrorText>{err.clave}</ErrorText>}
                        </div>
>>>>>>> 9916f679541022c8639efd2fdde2da62f712d65d

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            INGRESA
                        </button>

                        <a
                            href="#"
                            className="block text-center text-sm text-gray-500 hover:text-blue-600"
                        >
                            ¿Olvidaste tu contraseña?
                        </a>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default LoginForm;
