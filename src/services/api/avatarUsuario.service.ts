import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { fileToBase64 } from "@/utils/files";
import {
  AvatarUsuarioDto,
  AvatarUsuarioCreateDto,
  TipoOrigenImagen,
} from "@/types/models";

const AVATAR_URL = "/api/v1/avusuario";

export const avatarUsuarioService = {
  // GET /api/v1/avusuario
  listAll: async (): Promise<ApiResponse<AvatarUsuarioDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<AvatarUsuarioDto[]>>(
      AVATAR_URL
    );
    return data;
  },

  // GET /api/v1/avusuario/{id}
  getById: async (id: number): Promise<ApiResponse<AvatarUsuarioDto>> => {
    const { data } = await apiClient.get<ApiResponse<AvatarUsuarioDto>>(
      `${AVATAR_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/avusuario
  create: async (file: File): Promise<ApiResponse<AvatarUsuarioDto>> => {
    const base64Data = await fileToBase64(file);

    const dto: AvatarUsuarioCreateDto = {
      nombreArchivo: file.name,
      dataArchivo: base64Data,
      tipoArchivo: file.type,
      pesoArchivo: `${file.size} bytes`,
      fechaSubida: new Date().toISOString(),
      tipoOrigenImagen: TipoOrigenImagen.PERSONALIZADO,
    };

    const { data } = await apiClient.post<ApiResponse<AvatarUsuarioDto>>(
      AVATAR_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/avusuario
  update: async (
    dto: AvatarUsuarioDto
  ): Promise<ApiResponse<AvatarUsuarioDto>> => {
    const { data } = await apiClient.put<ApiResponse<AvatarUsuarioDto>>(
      AVATAR_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/avusuario/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${AVATAR_URL}/${id}`
    );
    return data;
  },
};
