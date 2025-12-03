import SimpleInputModal from "@/components/modals/SimpleInputModal";
import useVentaStore from "@/stores/ventasStore";
import { BaseVentaModalProps } from "@/types/ui/modules"; // CAMBIO

const OrdenCompraModal = ({ visible, onHide }: BaseVentaModalProps) => {
  const { ordenCompra, setOrdenCompra } = useVentaStore();

  return (
    <SimpleInputModal
      visible={visible}
      onHide={onHide}
      title="Agregar Orden de Compra"
      placeholder="ORDEN DE COMPRA"
      value={ordenCompra}
      onSave={setOrdenCompra}
    />
  );
};

export default OrdenCompraModal;
