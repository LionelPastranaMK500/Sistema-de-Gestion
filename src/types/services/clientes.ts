import { Cliente } from "@/types/services";

export interface ClienteCardProps {
  cliente: Cliente;
  index: number;
}

export interface ClienteNuevoProps {
  onClose: () => void;
}

export interface VentaCliente {
  id: number | string;
  comprobante: string;
  sucursal: string;
  vendedor: string;
  total: string | number;
  fecha: string;
}
