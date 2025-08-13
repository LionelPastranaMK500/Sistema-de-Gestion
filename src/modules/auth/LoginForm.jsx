import { useState } from "react";
import { validarLogin } from "../../utils/validations";
import { Link } from "react-router-dom";
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
        <main>
            <aside>
                <main className="relative flex min-h-screen overflow-hidden">
                    {/* Lado izquierdo con curva */}
                    <aside className="hidden relative md:flex flex-col justify-center items-center bg-blue-700 w-1/2 overflow-hidden text-white">
                        {/* Logo */}
                        <div className="top-6 left-6 z-10 absolute">
                            <img src="/images/Logo_WolfFur.webp" alt="Logo" className="h-20 object-contain" />
                        </div>

                        {/* Contenido (centrado pero desplazado un poco a la izquierda) */}
                        <div className="z-10 relative px-10 text-center -translate-x-6 transform">
                            <h2 className="mb-4 font-bold text-3xl">¿No tienes una cuenta?</h2>
                            <Link
                                to="/register"
                                className="hover:bg-white px-6 py-2 border border-white rounded hover:text-blue-700 transition"
                            >
                                CREA UNA CUENTA AHORA
                            </Link>
                        </div>

                        {/* Curva de separación (suave y circular) */}
                        <div
                            className="top-0 right-0 absolute bg-white w-24 md:w-20 h-full pointer-events-none"
                            style={{
                                borderTopLeftRadius: '100% 100%',
                                borderBottomLeftRadius: '100% 100%',
                            }}
                        />
                    </aside>

                    {/* Lado derecho */}
                    <section className="flex flex-col justify-center items-center bg-white p-8 w-full md:w-1/2">
                        <div className="w-full max-w-sm">
                            <h2 className="mb-6 font-semibold text-blue-800 text-2xl text-center">Iniciar Sesión</h2>


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

                                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            name="correo"
                                            placeholder="Email"
                                            onChange={handleChange}
                                            value={form.correo}
                                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
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
                                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                        />
                                        {err.clave && <ErrorText>{err.clave}</ErrorText>}
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg w-full text-white transition"
                                    >
                                        INGRESA
                                    </button>

                                    <a
                                        href="#"
                                        className="block text-gray-500 hover:text-blue-600 text-sm text-center"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </form>
                            </form>
                        </div>
                    </section>
                </main>
            </aside>
        </main>                    
    );
};

export default LoginForm;
