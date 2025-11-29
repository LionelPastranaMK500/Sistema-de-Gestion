import { VentaGenerada } from "@/types/services";

export interface FacturaModalProps {
  f: VentaGenerada;
  onClose: () => void;
}
