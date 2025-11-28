import SimpleInputModal from "@/components/modals/SimpleInputModal";
import useVentaStore from "@/stores/ventasStore";

interface OrdenCompraModalProps {
  visible: boolean;
  onHide: () => void;
}

const OrdenCompraModal = ({ visible, onHide }: OrdenCompraModalProps) => {
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
