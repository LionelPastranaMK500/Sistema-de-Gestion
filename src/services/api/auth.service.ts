import api from './api';

export const authService = {
    register: (userData) => api.post('/auth/register', userData),

    login: (credentials) => api.post('/auth/login', credentials),

    refreshToken: () => api.post('/auth/refresh-token'),
};