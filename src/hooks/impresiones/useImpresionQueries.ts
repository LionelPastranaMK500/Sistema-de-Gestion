import { useQuery } from "@tanstack/react-query";
import { impresionesService } from "@/services/api/impresiones.service";
import { PaginationOptions } from "@/types/api";
import { FormatoImpresion } from "@/types/models/comunes";

export const useImpresionQueries = () => {
  // Listar todas las configuraciones
  const useListAll = () =>
    useQuery({
      queryKey: ["impresiones", "list"],
      queryFn: () => impresionesService.listAll(),
      select: (response) => response.data,
    });

  // Obtener por ID
  const useGetById = (id: number) =>
    useQuery({
      queryKey: ["impresiones", "detail", id],
      queryFn: () => impresionesService.getById(id),
      enabled: !!id,
      select: (response) => response.data,
    });

  // --- Búsquedas por Formato ---
  const useByFormatoPage = (
    formato: FormatoImpresion,
    options: PaginationOptions = {},
  ) =>
    useQuery({
      queryKey: ["impresiones", "formato", "page", formato, options],
      queryFn: () => impresionesService.findByFormatoPage(formato, options),
    });

  const useFirstByFormato = (formato: FormatoImpresion) =>
    useQuery({
      queryKey: ["impresiones", "formato", "first", formato],
      queryFn: () => impresionesService.findFirstByFormato(formato),
      select: (response) => response.data,
    });

  // --- Búsquedas por Usuario (ID) ---
  const useByUsuarioIdList = (usuarioId: number) =>
    useQuery({
      queryKey: ["impresiones", "usuario", "list", usuarioId],
      queryFn: () => impresionesService.findByUsuarioIdList(usuarioId),
      enabled: !!usuarioId,
      select: (response) => response.data,
    });

  const useFirstByUsuarioId = (usuarioId: number) =>
    useQuery({
      queryKey: ["impresiones", "usuario", "first", usuarioId],
      queryFn: () => impresionesService.findFirstByUsuarioId(usuarioId),
      enabled: !!usuarioId,
      select: (response) => response.data,
    });

  // --- Búsquedas por Usuario (Nombre) ---
  const useByUsuarioNombrePage = (
    nombre: string,
    options: PaginationOptions = {},
  ) =>
    useQuery({
      queryKey: ["impresiones", "usuario-nombre", "page", nombre, options],
      queryFn: () =>
        impresionesService.findByUsuarioNombrePage(nombre, options),
      enabled: nombre.length >= 3,
    });

  return {
    useListAll,
    useGetById,
    useByFormatoPage,
    useFirstByFormato,
    useByUsuarioIdList,
    useFirstByUsuarioId,
    useByUsuarioNombrePage,
  };
};
