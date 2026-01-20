import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentosService } from "@/services/api/documentos.service";
import { DocumentoCreateDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useDocumentoMutations = () => {
  const queryClient = useQueryClient();

  const invalidateDocumentos = () => {
    queryClient.invalidateQueries({ queryKey: ["documentos"] });
  };

  // Emisión de Factura/Boleta (Botón "Procesar" en VentasView)
  const useEmitir = () =>
    useMutation({
      mutationFn: (dto: DocumentoCreateDto) => documentosService.emitir(dto),
      onSuccess: (data) => {
        const msg =
          data.estadoSunat === "ACEPTADO"
            ? `Comprobante emitido y ACEPTADO por SUNAT.`
            : `Comprobante emitido (Estado: ${data.estadoSunat})`;

        notifySuccess(msg);
        invalidateDocumentos();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error crítico en la emisión del documento";
        notifyError(msg);
      },
    });

  return {
    useEmitir,
  };
};
