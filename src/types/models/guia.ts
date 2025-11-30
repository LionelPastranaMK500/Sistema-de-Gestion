import {
  EstadoDocumento,
  ModalidadTransporte,
  PesoUnidad,
  TrasladoEstado,
  UsuarioSummary,
  SucursalSummary,
  ClienteSummary,
} from "./comunes";
import { VehiculoPayload } from "./transporte";

export interface GuiaRemision {
  id: number;
  fechaEmision: string;
  fechaEnvio: string;
  cantidad: string;
  peso: string;
  observaciones: string;
  direccionOrigen: string;
  direccionDestino: string;
  datosTransportista: string;

  traEstado: TrasladoEstado;
  estadoDoc: EstadoDocumento;
  pesoUni: PesoUnidad;
  mod: ModalidadTransporte;
  estado: EstadoDocumento;

  // Relaciones Resumidas
  usSummaryDto?: UsuarioSummary;
  sucSummaryDto?: SucursalSummary;
  cliSummaryDto?: ClienteSummary;

  // Tipos específicos para evitar 'any'
  tipDocSummaryDto?: { id: number; descripcion: string; codigo: string };
  serSummaryDto?: { id: number; serie: string };
  productosDto?: { id: number; nombre: string; cantidad?: number }[];
}

export interface GuiaRemisionPayload {
  fechaEmision: Date | string;
  fechaEnvio: Date | string;
  cantidad?: string;
  peso?: string;
  observaciones?: string;
  direccionOrigen: string;
  direccionDestino: string;
  datosTransportista: string;

  traEstado?: TrasladoEstado;
  estadoDoc?: EstadoDocumento;
  pesoUni: PesoUnidad;
  mod: ModalidadTransporte;

  // Foreign Keys (Coinciden con GuiaRemisionCreateDto.java)
  usuarioID: number;
  destinatarioID: number;
  documentoID?: number;
  sucComprobanteConfigID?: number;
  tipoEnvioID?: number;

  productoIds: number[];
  vehiculoIds: number[];
  vehiculos?: VehiculoPayload[];
  choferIds: number[];
}
