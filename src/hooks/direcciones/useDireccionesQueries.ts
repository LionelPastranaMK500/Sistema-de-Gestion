import { useQuery } from "@tanstack/react-query";
import { direccionesService } from "@/services/api/direcciones.service";

export const useDireccionesQueries = () => {
  // Listar todas las direcciones
  const useListAll = () =>
    useQuery({
      queryKey: ["direcciones", "list"],
      queryFn: () => direccionesService.listAll(),
      select: (response) => response.data,
    });

  // Obtener una dirección por ID
  const useGetById = (id: number) =>
    useQuery({
      queryKey: ["direcciones", "detail", id],
      queryFn: () => direccionesService.getById(id),
      enabled: !!id,
      select: (response) => response.data,
    });

  // Buscar por texto en dirección adicional
  const useBuscarPorAdicional = (texto: string) =>
    useQuery({
      queryKey: ["direcciones", "search", "adicional", texto],
      queryFn: () => direccionesService.buscarPorAdicional(texto),
      enabled: texto.length >= 3,
    });

  // Buscar por texto en descripción
  const useBuscarPorDescripcion = (texto: string) =>
    useQuery({
      queryKey: ["direcciones", "search", "descripcion", texto],
      queryFn: () => direccionesService.buscarPorDescripcion(texto),
      enabled: texto.length >= 3,
    });

  return {
    useListAll,
    useGetById,
    useBuscarPorAdicional,
    useBuscarPorDescripcion,
  };
};
