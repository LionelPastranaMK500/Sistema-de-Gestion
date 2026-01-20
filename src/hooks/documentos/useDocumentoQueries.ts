import { useQuery } from "@tanstack/react-query";
import { documentosService } from "@/services/api/documentos.service.ts";
import { PaginationOptions } from "@/types/api/index.ts";
import {
  DocumentoEstadoResponse,
  DocumentoDetailDto,
} from "@/types/models/documento.ts";

export const useDocumentoQueries = () => {
  // 1. Obtener detalle individual (para FacturaModal o vista detalle)
  const useGetById = (id: number) =>
    useQuery<DocumentoDetailDto>({
      queryKey: ["documentos", "detail", id],
      queryFn: () => documentosService.getById(id),
      enabled: !!id,
    });

  // 2. Listado paginado por sucursal con filtros
  const useListarPorSucursal = (
    sucursalId: number,
    filters: { usuarioId?: number; fecha?: string; q?: string } = {},
    options: PaginationOptions = {},
  ) =>
    useQuery({
      queryKey: ["documentos", "sucursal", sucursalId, filters, options],
      queryFn: () =>
        documentosService.listarPorSucursal(sucursalId, filters, options),
      enabled: !!sucursalId,
    });

  // 3. Obtener estado SUNAT con Polling (Arreglado para tus interfaces)
  const useObtenerEstado = (id: number) =>
    useQuery<DocumentoEstadoResponse>({
      queryKey: ["documentos", "estado", id],
      queryFn: () => documentosService.obtenerEstado(id),
      enabled: !!id,
      refetchInterval: (data) => {
        const res = data as DocumentoEstadoResponse | undefined;
        return res?.estadoSunat === "PENDIENTE" ? 5000 : false;
      },
    });

  // 4. Obtener datos del CDR
  const useObtenerCdr = (id: number) =>
    useQuery({
      queryKey: ["documentos", "cdr", id],
      queryFn: () => documentosService.obtenerCdr(id),
      enabled: !!id,
    });

  return {
    useGetById,
    useListarPorSucursal,
    useObtenerEstado,
    useObtenerCdr,
  };
};
