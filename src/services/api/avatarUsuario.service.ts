import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { AvatarUsuarioDto, AvatarUsuarioDetailDto } from "@/types/models";

const AVATAR_URL = "/api/v1/avatar-usuario";

export const avatarUsuarioService = {
  // GET /api/v1/avatar-usuario
  listAll: async (): Promise<ApiResponse<AvatarUsuarioDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<AvatarUsuarioDto[]>>(
      AVATAR_URL
    );
    return data;
  },

  // GET /api/v1/avatar-usuario/{id}
  getById: async (id: number): Promise<ApiResponse<AvatarUsuarioDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<AvatarUsuarioDetailDto>>(
      `${AVATAR_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/avatar-usuario/usuario/{usuarioId}
  getByUsuarioId: async (
    usuarioId: number
  ): Promise<ApiResponse<AvatarUsuarioDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<AvatarUsuarioDetailDto>>(
      `${AVATAR_URL}/usuario/${usuarioId}`
    );
    return data;
  },

  // POST /api/v1/avatar-usuario
  upload: async (
    usuarioId: number,
    file: File
  ): Promise<ApiResponse<AvatarUsuarioDto>> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("usuarioId", usuarioId.toString());

    const { data } = await apiClient.post<ApiResponse<AvatarUsuarioDto>>(
      AVATAR_URL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  // DELETE /api/v1/avatar-usuario/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${AVATAR_URL}/${id}`
    );
    return data;
  },
};
