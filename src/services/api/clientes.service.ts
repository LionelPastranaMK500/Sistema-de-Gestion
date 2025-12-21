import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  ClienteDto,
  ClienteDetailDto,
  ClienteCreateDto,
  ClienteUpdateDto,
  ClienteLookupResult,
} from "@/types/models";

const CLIENTE_URL = "/api/v1/cliente";

export const clientesService = {
  // --- CRUD BÁSICO ---

  // GET /api/v1/cliente
  listAll: async (): Promise<ApiResponse<ClienteDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<ClienteDto[]>>(
      CLIENTE_URL
    );
    return data;
  },

  // GET /api/v1/cliente/{id}
  getById: async (id: number): Promise<ApiResponse<ClienteDetailDto>> => {
    const { data } = await apiClient.get<ApiResponse<ClienteDetailDto>>(
      `${CLIENTE_URL}/${id}`
    );
    return data;
  },

  // POST /api/v1/cliente
  create: async (dto: ClienteCreateDto): Promise<ApiResponse<ClienteDto>> => {
    const { data } = await apiClient.post<ApiResponse<ClienteDto>>(
      CLIENTE_URL,
      dto
    );
    return data;
  },

  // PUT /api/v1/cliente
  update: async (dto: ClienteUpdateDto): Promise<ApiResponse<ClienteDto>> => {
    const { data } = await apiClient.put<ApiResponse<ClienteDto>>(
      CLIENTE_URL,
      dto
    );
    return data;
  },

  // DELETE /api/v1/cliente/{id}
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `${CLIENTE_URL}/${id}`
    );
    return data;
  },

  // GET /api/v1/cliente/search/documento/{numeroDocumento}
  getByNumeroDocumento: async (
    numeroDocumento: string
  ): Promise<ApiResponse<ClienteDto>> => {
    const { data } = await apiClient.get<ApiResponse<ClienteDto>>(
      `${CLIENTE_URL}/search/documento/${numeroDocumento}`
    );
    return data;
  },

  // GET /api/v1/cliente/search/page?nombre=...&documento=...
  searchPage: async (params: {
    nombre?: string;
    documento?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<any>> => {
    // Retorna Page<ClienteDto>
    const { data } = await apiClient.get<ApiResponse<any>>(
      `${CLIENTE_URL}/search/page`,
      { params }
    );
    return data;
  },

  // GET /api/v1/cliente/search/list?nombre=...&documento=...
  searchList: async (params: {
    nombre?: string;
    documento?: string;
  }): Promise<ApiResponse<ClienteDto[]>> => {
    const { data } = await apiClient.get<ApiResponse<ClienteDto[]>>(
      `${CLIENTE_URL}/search/list`,
      { params }
    );
    return data;
  },

  // GET /api/v1/cliente/lookup/ruc/{ruc}
  lookupRuc: async (ruc: string): Promise<ApiResponse<ClienteLookupResult>> => {
    const { data } = await apiClient.get<ApiResponse<ClienteLookupResult>>(
      `${CLIENTE_URL}/lookup/ruc/${ruc}`
    );
    return data;
  },

  // GET /api/v1/cliente/lookup/dni/{dni}
  lookupDni: async (dni: string): Promise<ApiResponse<ClienteLookupResult>> => {
    const { data } = await apiClient.get<ApiResponse<ClienteLookupResult>>(
      `${CLIENTE_URL}/lookup/dni/${dni}`
    );
    return data;
  },
};
