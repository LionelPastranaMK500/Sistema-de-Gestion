import apiClient from "@/config/api";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";

const AUTH_URL = "/auth";

export const authService = {
  // POST /auth/login
  // Retorna directamente AuthResponse (sin ApiResponse wrapper, según tu AuthController)
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
  // El backend lee el token del header Authorization (ver IAuthService.java -> refreshToken)
  refreshToken: async (tokenActual: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      `${AUTH_URL}/refresh-token`,
      {}, // Body vacío
      {
        headers: {
          Authorization: `Bearer ${tokenActual}`,
        },
      }
    );
    return data;
  },
};
