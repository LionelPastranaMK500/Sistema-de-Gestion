import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- INTERCEPTOR REQUEST (Inyectar Token) ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- INTERCEPTOR RESPONSE (Manejo de Errores Globales) ---
apiClient.interceptors.response.use(
  (response) => response, // Si todo sale bien, pasamos la respuesta limpia
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Sesión expirada o inválida.");

      localStorage.removeItem("authToken");
      localStorage.removeItem("activeUser");

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
