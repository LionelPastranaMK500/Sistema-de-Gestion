import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useDynamicList } from "@/hooks/data/useDynamicList";
import { useState, useEffect } from "react";
import AddListModal from "@/components/modals/AddListModal";
import useVentaStore from "@/stores/ventasStore";
import { BaseVentaModalProps, DatoAdicionalItem } from "@/types/ui/modules";

const DatosAdicionalesModal = ({ visible, onHide }: BaseVentaModalProps) => {
  const { datosAdicionales, setDatosAdicionales } = useVentaStore();

  // Mapeo inicial asegurando tempId para el hook
  const initialItems = (datosAdicionales || []).map((d: any, i: number) => ({
    id: d.id || Date.now() + i,
    tempId: d.id || Date.now() + i, // Necesario para useDynamicList
    titulo: d.titulo || "",
    descripcion: d.descripcion || "",
  })) as DatoAdicionalItem[];

  const { items, addItem, removeItem, setItems } =
    useDynamicList<DatoAdicionalItem>(initialItems);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (visible) {
      const mapped = (datosAdicionales || []).map((d: any, i: number) => ({
        id: d.id || Date.now() + i,
        tempId: d.id || Date.now() + i,
        titulo: d.titulo || "",
        descripcion: d.descripcion || "",
      })) as DatoAdicionalItem[];
      setItems(mapped);
    }
  }, [visible, datosAdicionales, setItems]);

  const handleSave = (newItems: DatoAdicionalItem[]) => {
    setDatosAdicionales(newItems as any);
    onHide();
  };

  const handleAddItem = () => {
    if (titulo && descripcion) {
      const newId = Date.now();
      addItem({ titulo, descripcion, id: newId, tempId: newId } as any);
      setTitulo("");
      setDescripcion("");
    }
  };

  const handleRemove = (id: string | number) => {
    removeItem(Number(id));
  };

  const renderFormFields = () => (
    <div className="flex gap-2">
      <InputText
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título *"
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
      <InputText
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción *"
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
      <Button
        icon="pi pi-minus-circle"
        onClick={() => {
          setTitulo("");
          setDescripcion("");
        }}
        className="!bg-red-500 hover:!bg-red-600 !text-white !border-0 !rounded-full !w-10 !h-10 !p-0"
      />
    </div>
  );

  const renderItemDisplay = (item: DatoAdicionalItem) => (
    <div className="flex gap-2 flex-1">
      <div className="flex-1 p-2 bg-white border border-gray-300 rounded-lg">
        <label className="block text-xs text-gray-600 mb-1">Título *</label>
        <span className="text-sm text-gray-700">{item.titulo}</span>
      </div>
      <div className="flex-1 p-2 bg-white border border-gray-300 rounded-lg">
        <label className="block text-xs text-gray-600 mb-1">
          Descripción *
        </label>
        <span className="text-sm text-gray-700">{item.descripcion}</span>
      </div>
    </div>
  );

  return (
    <AddListModal
      visible={visible}
      onHide={onHide}
      onSave={handleSave}
      title="Otros datos adicionales"
      addButtonLabel="AGREGAR DATO ADICIONAL"
      items={items}
      setItems={setItems}
      renderFormFields={renderFormFields}
      renderItemDisplay={renderItemDisplay}
      validateForm={() => !!(titulo && descripcion)}
      onAddItem={handleAddItem}
      onRemoveItem={handleRemove}
      width="500px"
    />
  );
};

export default DatosAdicionalesModal;
