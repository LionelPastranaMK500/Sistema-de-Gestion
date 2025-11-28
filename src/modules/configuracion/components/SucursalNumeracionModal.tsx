import { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { CloseIcon, AddIcon, RemoveCircleIcon } from "@/constants/icons";
import { toast } from "react-toastify";
import { useDynamicList } from "@/hooks/data";
import { DynamicItem } from "@/hooks/data/useDynamicList";
import { Sucursal } from "@/services/generadorData";

const inputStyle =
  "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm";
const dropdownStyle =
  "w-full p-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm [&_.p-dropdown-label]:whitespace-normal [&_.p-dropdown-label]:py-2.5 [&_.p-dropdown-label]:px-3";

interface NumeracionItem extends DynamicItem {
  tipo?: string;
  serie?: string;
  inicial?: number | string; // string temporalmente mientras se edita
}

interface SucursalNumeracionModalProps {
  visible: boolean;
  sucursal: Sucursal;
  onHide: () => void;
}

const SucursalNumeracionModal = ({
  visible,
  sucursal,
  onHide,
}: SucursalNumeracionModalProps) => {
  const {
    items: numeracion,
    setItems: setNumeracion,
    addItem,
    removeItem,
    updateItem,
  } = useDynamicList<NumeracionItem>([]);

  const todosLosComprobantes = [
    "FACTURA ELECTRÓNICA",
    "BOLETA DE VENTA ELECTRÓNICA",
    "NOTA DE CRÉDITO ELECTRÓNICA",
    "NOTA DE DÉBITO ELECTRÓNICA",
    "PROFORMA ELECTRÓNICA",
    "GUÍA DE REMISIÓN REMITENTE ELECTRÓNICA",
  ];

  const tiposOptions = todosLosComprobantes.map((t) => ({
    label: t,
    value: t,
    title: t,
  }));

  useEffect(() => {
    if (visible && sucursal?.numeracion) {
      // Aseguramos que cada item tenga un tempId para el hook
      const mappedNumeracion = sucursal.numeracion.map((item, index) => ({
        ...item,
        tempId: Date.now() + index,
      }));
      setNumeracion(mappedNumeracion);
    } else if (visible) {
      setNumeracion([]);
    }
  }, [visible, sucursal, setNumeracion]);

  const handleAddNumeracion = () => {
    addItem({ tipo: "", serie: "", inicial: 1 });
  };

  const handleSubmit = () => {
    const dataToSave = numeracion.filter((n) => n.tipo && n.serie);
    console.log(`Guardando numeración para ${sucursal.nombre}:`, dataToSave);
    toast.success(`Numeración actualizada para ${sucursal.nombre}.`);
    onHide();
  };

  const header = (
    <div className="flex justify-between items-center bg-blue-700 px-5 py-3 text-white">
      <h2 className="text-xl font-bold">Sucursal</h2>
      <button
        onClick={onHide}
        className="hover:bg-white/20 p-1 rounded transition-colors"
        aria-label="Cerrar"
      >
        <CloseIcon />
      </button>
    </div>
  );

  const footer = (
    <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200 mt-6 px-6 pb-4">
      <Button
        label="CANCELAR"
        onClick={onHide}
        className="!text-gray-600 !font-semibold hover:!bg-gray-100 !py-2 !px-5 !rounded-lg"
        text
      />
      <Button
        label="GUARDAR"
        onClick={handleSubmit}
        className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-5 !rounded-lg"
      />
    </div>
  );

  const itemTemplate = (option: any) => (
    <span title={option.title}>{option.label}</span>
  );

  const tiposSeleccionados = numeracion.map((n) => n.tipo).filter(Boolean);
  const tiposRestantes = todosLosComprobantes.filter(
    (t) => !tiposSeleccionados.includes(t)
  );

  return (
    <Dialog
      header={header}
      visible={visible}
      onHide={onHide}
      modal
      closable={false}
      draggable={false}
      className="w-[min(850px,95vw)]"
      headerClassName="p-0"
      contentClassName="p-0 bg-white max-h-[85vh] overflow-hidden"
      footer={footer}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Configuración de Numeración
        </h3>

        <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
          <div className="sticky top-0 bg-white z-10 grid grid-cols-[5fr_1fr_1fr_0.5fr] gap-4 font-bold text-gray-600 text-xs uppercase px-2 py-2 border-b border-gray-200">
            <div>Tipo comprobante</div>
            <div>Serie</div>
            <div className="text-center">Número inicial</div>
            <div></div>
          </div>

          <div className="space-y-3 pt-2">
            {numeracion.map((item) => (
              <div
                key={item.tempId}
                className="grid grid-cols-[5fr_1fr_1fr_0.5fr] items-center gap-4"
              >
                <Dropdown
                  options={tiposOptions}
                  value={item.tipo}
                  onChange={(e) => updateItem(item.tempId!, "tipo", e.value)}
                  placeholder="Tipo comprobante"
                  className={`${dropdownStyle}`}
                  panelClassName="rounded-lg"
                  optionLabel="label"
                  itemTemplate={itemTemplate}
                />

                <InputText
                  value={item.serie || ""}
                  onChange={(e) =>
                    updateItem(
                      item.tempId!,
                      "serie",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="FF01"
                  className={inputStyle + " text-center"}
                  title={`Serie actual: ${item.serie}`}
                />

                <InputText
                  value={String(item.inicial || "")}
                  onChange={(e) =>
                    updateItem(
                      item.tempId!,
                      "inicial",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                  type="number"
                  min="1"
                  placeholder="1"
                  className={inputStyle + " text-center"}
                />

                <button
                  type="button"
                  onClick={() => removeItem(item.tempId!)}
                  className="p-2.5 rounded-full bg-red-500 disabled:bg-gray-300 hover:bg-red-600 text-white transition-colors"
                  aria-label="Remover"
                >
                  <RemoveCircleIcon className="!text-lg" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-start pt-4">
          <button
            type="button"
            onClick={handleAddNumeracion}
            disabled={tiposRestantes.length === 0}
            className="flex items-center gap-2 bg-blue-50 hover:bg-100 px-4 py-2 border border-blue-300 rounded-md font-semibold text-blue-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AddIcon className="!text-lg" />
            Añadir
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default SucursalNumeracionModal;
