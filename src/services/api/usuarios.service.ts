import apiClient from "@/config/api";
import {
  UsuarioDto,
  UsuarioSummaryDto,
  UsuarioResponse,
  AddUserRequest,
} from "@/types/models/usuario";

const USUARIOS_URL = "/api/v1/usuarios";

// =============================================================================
// SERVICIO
// =============================================================================

export const usuariosService = {
  // GET /api/v1/usuarios
  // Retorna la lista directa, sin envoltorio ApiResponse
  getUsuarios: async (): Promise<UsuarioResponse[]> => {
    const { data } = await apiClient.get<UsuarioResponse[]>(USUARIOS_URL);
    return data;
  },

  // GET /api/v1/usuarios/{id}/status
  // Retorna un string directo
  getUserStatus: async (id: number): Promise<string> => {
    const { data } = await apiClient.get<string>(
      `${USUARIOS_URL}/${id}/status`,
    );
    return data;
  },

  // GET /api/v1/usuarios/{id}/summary
  getUserSummary: async (id: number): Promise<UsuarioSummaryDto> => {
    const { data } = await apiClient.get<UsuarioSummaryDto>(
      `${USUARIOS_URL}/${id}/summary`,
    );
    return data;
  },

  // POST /api/v1/usuarios
  addUser: async (req: AddUserRequest): Promise<UsuarioDto> => {
    const { data } = await apiClient.post<UsuarioDto>(USUARIOS_URL, req);
    return data;
  },
};
