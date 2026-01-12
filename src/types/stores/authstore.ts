// Importamos el DTO espejo correcto (el que tiene toda la info del usuario)
import { UsuarioDetailDto } from "@/types/models/usuario";

// 1. El Estado
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  // Usamos el DTO detallado para tener acceso a ruc, razonSocial, etc.
  user: UsuarioDetailDto | null;
  isAuthenticated: boolean;
}

// 2. Las Acciones
export interface AuthActions {
  setSession: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UsuarioDetailDto) => void; // Acción nueva para guardar los datos del usuario
  logout: () => void;
}

// 3. El Store completo
export type AuthStoreType = AuthState & AuthActions;
