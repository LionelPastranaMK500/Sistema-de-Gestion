/// <reference types="vite/client" />

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ApiError {
  status: number;
  statusText: string;
  data: any;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const defaultConfig: RequestOptions = {
  headers: {
    "Content-Type": "application/json",
  },
};

const addAuthToken = (config: RequestOptions = {}): RequestOptions => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};

// Usamos un genérico T para el tipo de respuesta esperada
const handleResponse = async <T>(response: Response): Promise<T | null> => {
  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      statusText: response.statusText,
      data: null,
    };

    try {
      error.data = await response.json();
    } catch {
      error.data = { message: response.statusText };
    }

    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  get: async <T>(endpoint: string, config: RequestOptions = {}): Promise<T> => {
    const mergedConfig: RequestOptions = {
      ...defaultConfig,
      ...config,
      method: "GET",
    };

    const finalConfig = addAuthToken(mergedConfig);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
    // Hacemos cast a Promise<T> porque handleResponse retorna Promise<T | null>
    return handleResponse<T>(response) as Promise<T>;
  },

  post: async <T>(
    endpoint: string,
    data: any,
    config: RequestOptions = {}
  ): Promise<T> => {
    const mergedConfig: RequestOptions = {
      ...defaultConfig,
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    };

    const finalConfig = addAuthToken(mergedConfig);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
    return handleResponse<T>(response) as Promise<T>;
  },

  put: async <T>(
    endpoint: string,
    data: any,
    config: RequestOptions = {}
  ): Promise<T> => {
    const mergedConfig: RequestOptions = {
      ...defaultConfig,
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    };

    const finalConfig = addAuthToken(mergedConfig);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
    return handleResponse<T>(response) as Promise<T>;
  },

  patch: async <T>(
    endpoint: string,
    data: any,
    config: RequestOptions = {}
  ): Promise<T> => {
    const mergedConfig: RequestOptions = {
      ...defaultConfig,
      ...config,
      method: "PATCH",
      body: JSON.stringify(data),
    };

    const finalConfig = addAuthToken(mergedConfig);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
    return handleResponse<T>(response) as Promise<T>;
  },

  delete: async <T>(
    endpoint: string,
    config: RequestOptions = {}
  ): Promise<T> => {
    const mergedConfig: RequestOptions = {
      ...defaultConfig,
      ...config,
      method: "DELETE",
    };

    const finalConfig = addAuthToken(mergedConfig);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
    return handleResponse<T>(response) as Promise<T>;
  },

  upload: async <T>(
    endpoint: string,
    formData: FormData,
    config: RequestOptions = {}
  ): Promise<T> => {
    const mergedConfig: RequestOptions = {
      ...config,
      method: "POST",
      body: formData,
    };

    const finalConfig = addAuthToken(mergedConfig);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
    return handleResponse<T>(response) as Promise<T>;
  },
};

export default api;
