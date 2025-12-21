import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  ConfiguracionEmpresaDto,
  ConfiguracionEmpresaCreateDto,
  ConfiguracionEmpresaUpdateDto,
} from "@/types/models";

const CONFIG_URL = "/api/v1/configuracion-empresa";

export const configuracionService = {
  // GET /api/v1/configuracion-empresa
  listAll: async (): Promise<ApiResponse<ConfiguracionEmpresaDto[]>> => {
    const { data } = await apiClient.get<
      ApiResponse<ConfiguracionEmpresaDto[]>
    >(CONFIG_URL);
    return data;
  },

  // GET /api/v1/configuracion-empresa/{id}
  getById: async (
    id: number
  ): Promise<ApiResponse<ConfiguracionEmpresaDto>> => {
    const { data } = await apiClient.get<ApiResponse<ConfiguracionEmpresaDto>>(
      `${CONFIG_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/configuracion-empresa
  create: async (
    dto: ConfiguracionEmpresaCreateDto
  ): Promise<ApiResponse<ConfiguracionEmpresaDto>> => {
    const { data } = await apiClient.post<ApiResponse<ConfiguracionEmpresaDto>>(
      CONFIG_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/configuracion-empresa
  update: async (
    dto: ConfiguracionEmpresaUpdateDto
  ): Promise<ApiResponse<ConfiguracionEmpresaDto>> => {
    const { data } = await apiClient.put<ApiResponse<ConfiguracionEmpresaDto>>(
      CONFIG_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/configuracion-empresa/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${CONFIG_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/configuracion-empresa/usuario/{usuarioId}
  findByUsuario: async (
    usuarioId: number
  ): Promise<ApiResponse<ConfiguracionEmpresaDto>> => {
    const { data } = await apiClient.get<ApiResponse<ConfiguracionEmpresaDto>>(
      `${CONFIG_URL}/usuario/${usuarioId}`
    );
    return data;
  },

  // GET /api/v1/configuracion-empresa/me
  // Busca la configuración del usuario logueado actualmente (basado en el Token)
  findByCurrentUser: async (): Promise<
    ApiResponse<ConfiguracionEmpresaDto>
  > => {
    const { data } = await apiClient.get<ApiResponse<ConfiguracionEmpresaDto>>(
      `${CONFIG_URL}/me`
    );
    return data;
  },

  // GET /api/v1/configuracion-empresa/usuario?email={email}
  findByUsuarioEmail: async (
    email: string
  ): Promise<ApiResponse<ConfiguracionEmpresaDto>> => {
    const { data } = await apiClient.get<ApiResponse<ConfiguracionEmpresaDto>>(
      `${CONFIG_URL}/usuario`,
      { params: { email } }
    );
    return data;
  },
};
