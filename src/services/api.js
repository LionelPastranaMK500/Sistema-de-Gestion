const API_BASE_URL = import.meta.env.VITE_API_URL;
const defaultConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const addAuthToken = (config = {}) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`,
        };
    }
    return config;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = {
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
    get: async (endpoint, config = {}) => {
        const mergedConfig = {
            ...defaultConfig,
            ...config,
            method: 'GET',
        };

        const finalConfig = addAuthToken(mergedConfig);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
        return handleResponse(response);
    },

    post: async (endpoint, data, config = {}) => {
        const mergedConfig = {
            ...defaultConfig,
            ...config,
            method: 'POST',
            body: JSON.stringify(data),
        };

        const finalConfig = addAuthToken(mergedConfig);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
        return handleResponse(response);
    },

    put: async (endpoint, data, config = {}) => {
        const mergedConfig = {
            ...defaultConfig,
            ...config,
            method: 'PUT',
            body: JSON.stringify(data),
        };

        const finalConfig = addAuthToken(mergedConfig);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
        return handleResponse(response);
    },

    patch: async (endpoint, data, config = {}) => {
        const mergedConfig = {
            ...defaultConfig,
            ...config,
            method: 'PATCH',
            body: JSON.stringify(data),
        };

        const finalConfig = addAuthToken(mergedConfig);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
        return handleResponse(response);
    },

    delete: async (endpoint, config = {}) => {
        const mergedConfig = {
            ...defaultConfig,
            ...config,
            method: 'DELETE',
        };

        const finalConfig = addAuthToken(mergedConfig);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
        return handleResponse(response);
    },

    upload: async (endpoint, formData, config = {}) => {
        const mergedConfig = {
            ...config,
            method: 'POST',
            body: formData,
        };

        const finalConfig = addAuthToken(mergedConfig);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalConfig);
        return handleResponse(response);
    },
};

export default api;