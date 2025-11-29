import api from "../api";
import { Usuario } from "@/types/services";
import { ApiAuthResponse } from "@/types/services/auth";

export const authService = {
  register: (userData: Partial<Usuario>) =>
    api.post<ApiAuthResponse>("/auth/register", userData),

  login: (credentials: { correo: string; clave: string }) =>
    api.post<ApiAuthResponse>("/auth/login", credentials),

  refreshToken: () => api.post<{ token: string }>("/auth/refresh-token", {}),
};
