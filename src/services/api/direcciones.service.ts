import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import { DireccionDto, DireccionCreateDto } from "@/types/models";

const DIRECCION_URL = "/api/v1/direcciones";

export const direccionesService = {
  // GET /api/v1/direcciones
  listAll: async (): Promise<ApiResponse<DireccionDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<DireccionDto[]>>(
      DIRECCION_URL
    );
    return data;
  },

  // GET /api/v1/direcciones/{id}
  getById: async (id: number): Promise<ApiResponse<DireccionDto>> => {
    const { data } = await apiClient.get<ApiResponse<DireccionDto>>(
      `${DIRECCION_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/direcciones
  create: async (
    dto: DireccionCreateDto
  ): Promise<ApiResponse<DireccionDto>> => {
    const { data } = await apiClient.post<ApiResponse<DireccionDto>>(
      DIRECCION_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/direcciones
  update: async (dto: DireccionDto): Promise<ApiResponse<DireccionDto>> => {
    const { data } = await apiClient.put<ApiResponse<DireccionDto>>(
      DIRECCION_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/direcciones/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${DIRECCION_URL}/${id}`
    );
    return data;
  },

  // ===========================================================================
  // MÉTODOS DE BÚSQUEDA ESPECÍFICOS
  // ===========================================================================

  // GET /api/v1/direcciones/buscar/adicional/{texto}
  buscarPorAdicional: async (texto: string): Promise<DireccionDto[]> => {
    const { data } = await apiClient.get<DireccionDto[]>(
      `${DIRECCION_URL}/buscar/adicional/${texto}`
    );
    return data;
  },

  // GET /api/v1/direcciones/buscar/descripcion/{texto}
  buscarPorDescripcion: async (texto: string): Promise<DireccionDto[]> => {
    const { data } = await apiClient.get<DireccionDto[]>(
      `${DIRECCION_URL}/buscar/descripcion/${texto}`
    );
    return data;
  },
};
