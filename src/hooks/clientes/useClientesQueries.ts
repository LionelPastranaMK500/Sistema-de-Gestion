import { useQuery } from "@tanstack/react-query";
import { clientesService } from "@/services/api/clientes.service";
import { PaginationOptions } from "@/types/api";

export const useClientesQueries = () => {
  /**
   * Obtiene la lista paginada de clientes.
   * Endpoint: GET /api/v1/clientes
   * Uso: Vista principal de tablas, selectores con búsqueda.
   */
  const useClientes = (query: string = "", options: PaginationOptions = {}) => {
    return useQuery({
      queryKey: ["clientes", query, options.page, options.size],
      queryFn: () => clientesService.getAll(query, options),
      keepPreviousData: true,
    });
  };

  /**
   * Consulta datos de un RUC en tiempo real (externo o interno).
   * Endpoint: GET /api/v1/clientes/consulta?numero={ruc}
   * Uso: Formulario de creación para autocompletar datos del cliente.
   */
  const useConsultaRuc = (ruc: string, enabled: boolean) => {
    return useQuery({
      queryKey: ["consultaRuc", ruc],
      queryFn: () => clientesService.consultarRuc(ruc),
      enabled: enabled && ruc.length >= 8, // Previene llamadas innecesarias
      retry: false, // Si falla (no encontrado), no insistir
    });
  };

  /**
   * Obtiene el detalle de un cliente específico por su ID.
   * Endpoint: GET /api/v1/clientes/{id}
   * Uso: Modal de edición o vista de detalle.
   */
  const useClienteById = (id: number | null, enabled: boolean = true) => {
    return useQuery({
      queryKey: ["cliente", id],
      queryFn: () => clientesService.getById(id!),
      enabled: enabled && !!id,
    });
  };

  return {
    useClientes,
    useConsultaRuc,
    useClienteById,
  };
};
