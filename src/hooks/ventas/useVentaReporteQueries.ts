import { useQuery } from "@tanstack/react-query";
import { ventaReporteService } from "@/services/api/ventaReporte.service";
import { VentaReporteFilterDto } from "@/types/models/ventas";
import { PaginationOptions } from "@/types/api";

export const useVentaReporteQueries = () => {
  /**
   * Obtener reporte paginado para la tabla de gestión de ventas.
   */
  const useGetReportePaginado = (
    filtros: VentaReporteFilterDto,
    options: PaginationOptions = {},
  ) =>
    useQuery({
      queryKey: ["reportes", "ventas", "paginado", filtros, options],
      queryFn: async () => {
        const data = await ventaReporteService.obtenerReportePaginado(
          filtros,
          options,
        );
        return data;
      },
      placeholderData: (prev: any) => prev,
    });

  /**
   * Obtener reporte completo (sin paginación).
   */
  const useGetReporteCompleto = (filtros: VentaReporteFilterDto) =>
    useQuery({
      queryKey: ["reportes", "ventas", "completo", filtros],
      queryFn: async () => {
        const data = await ventaReporteService.obtenerReporteCompleto(filtros);
        return data;
      },
      enabled: false,
    });

  return {
    useGetReportePaginado,
    useGetReporteCompleto,
  };
};
