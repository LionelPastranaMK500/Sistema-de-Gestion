import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { RequestOptions, ApiError } from "@/types/services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 30000, // Opcional: Si quieres definir un tiempo límite
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      status: error.response?.status || 0,
      statusText: error.response?.statusText || "Error de red",
      data: error.response?.data || null,
    };

    return Promise.reject(apiError);
  }
);

// 4. Wrapper Estandarizado (Misma estructura que tenías antes)
export const api = {
  get: async <T>(endpoint: string, config: RequestOptions = {}): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(
      endpoint,
      config
    );
    return response.data;
  },

  post: async <T>(
    endpoint: string,
    data: any,
    config: RequestOptions = {}
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(
      endpoint,
      data,
      config
    );
    return response.data;
  },

  put: async <T>(
    endpoint: string,
    data: any,
    config: RequestOptions = {}
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(
      endpoint,
      data,
      config
    );
    return response.data;
  },

  patch: async <T>(
    endpoint: string,
    data: any,
    config: RequestOptions = {}
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.patch(
      endpoint,
      data,
      config
    );
    return response.data;
  },

  delete: async <T>(
    endpoint: string,
    config: RequestOptions = {}
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(
      endpoint,
      config
    );
    return response.data;
  },

  // Método especial para subir archivos (FormData)
  upload: async <T>(
    endpoint: string,
    formData: FormData,
    config: RequestOptions = {}
  ): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(
      endpoint,
      formData,
      {
        ...config,
        headers: {
          "Content-Type": "multipart/form-data",
          ...config.headers,
        },
      }
    );
    return response.data;
  },
};

export default api;
