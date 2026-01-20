import { useQuery } from "@tanstack/react-query";
import { productosService } from "@/services/api/productos.service";
import { PaginationOptions } from "@/types/api";
import {
  ProductoDto,
  ProductoDetailDto,
  ProductoSummaryDto,
} from "@/types/models";

export const useProductoQueries = () => {
  // Listar todos los productos (vista simple)
  const useListAll = () =>
    useQuery<ProductoDto[]>({
      queryKey: ["productos", "list"],
      queryFn: async () => {
        const response = await productosService.listAll();
        return response.data;
      },
    });

  // Obtener por ID (simple)
  const useGetById = (id: number) =>
    useQuery<ProductoDto>({
      queryKey: ["productos", "simple", id],
      queryFn: async () => {
        const response = await productosService.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  // Obtener detalle extendido (para vista de edición o ficha técnica)
  const useGetDetail = (id: number) =>
    useQuery<ProductoDetailDto>({
      queryKey: ["productos", "detail", id],
      queryFn: async () => {
        const response = await productosService.getDetail(id);
        return response.data;
      },
      enabled: !!id,
    });

  // Reporte paginado con filtros (usado en la tabla principal de productos)
  const useGetReporte = (
    filters: { q?: string } = {},
    options: PaginationOptions = {},
  ) =>
    useQuery({
      queryKey: ["productos", "reporte", filters, options],
      queryFn: () => productosService.getReporte(filters, options),
    });

  // Listado de Summaries (Ideal para el selector de productos en Ventas)
  const useListSummary = () =>
    useQuery<ProductoSummaryDto[]>({
      queryKey: ["productos", "summary"],
      queryFn: async () => {
        const response = await productosService.listSummary();
        return response.data;
      },
      staleTime: 1000 * 60 * 5,
    });

  return {
    useListAll,
    useGetById,
    useGetDetail,
    useGetReporte,
    useListSummary,
  };
};
