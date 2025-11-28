import api from "../api";
import { Usuario } from "@/services/generadorData";

interface AuthResponse {
  user: Usuario;
  token: string;
}

export const authService = {
  register: (userData: Partial<Usuario>) =>
    api.post<AuthResponse>("/auth/register", userData),

  login: (credentials: { correo: string; clave: string }) =>
    api.post<AuthResponse>("/auth/login", credentials),

  refreshToken: () => api.post<{ token: string }>("/auth/refresh-token", {}),
};
