import apiClient from "@/config/api";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";

const AUTH_URL = "/auth";

export const authService = {
  // POST /auth/login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      `${AUTH_URL}/login`,
      credentials
    );
    return data;
  },

  // POST /auth/register
  register: async (info: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      `${AUTH_URL}/register`,
      info
    );
    return data;
  },

  // POST /auth/refresh-token
  refreshToken: async (tokenActual: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      `${AUTH_URL}/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${tokenActual}`,
        },
      }
    );
    return data;
  },

  // POST /auth/forgot-password
  requestPasswordReset: async (email: string): Promise<any> => {
    const { data } = await apiClient.post(`${AUTH_URL}/forgot-password`, {
      email,
    });
    return data;
  },

  // POST /auth/verify-code
  verifyResetCode: async (email: string, code: string): Promise<any> => {
    const { data } = await apiClient.post(`${AUTH_URL}/verify-code`, {
      email,
      code,
    });
    return data;
  },

  // POST /auth/reset-password
  resetPassword: async (
    email: string,
    code: string,
    password: string
  ): Promise<any> => {
    const { data } = await apiClient.post(`${AUTH_URL}/reset-password`, {
      email,
      code,
      password,
    });
    return data;
  },
};
