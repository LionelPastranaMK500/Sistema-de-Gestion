import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import useVentaStore from "@/stores/ventasStore";
import { CondicionPagoModalProps } from "@/types/modules/ventas";

const CondicionPagoModal = ({ visible, onHide }: CondicionPagoModalProps) => {
  const { condicionPago, setCondicionPago } = useVentaStore();
  const [condicion, setCondicion] = useState("");
  const [metodo, setMetodo] = useState("");
  const [referencia, setReferencia] = useState("");

  const condicionesPago = [
    { label: "CONTADO", value: "CONTADO" },
    { label: "CRÉDITO", value: "CREDITO" },
  ];

  const metodosPago = [
    { label: "EFECTIVO", value: "EFECTIVO" },
    { label: "TARJETA DE DÉBITO", value: "TARJETA_DEBITO" },
    { label: "TARJETA DE CRÉDITO", value: "TARJETA_CREDITO" },
    { label: "TRANSFERENCIA BANCARIA", value: "TRANSFERENCIA" },
    { label: "DEPÓSITO EN CUENTA", value: "DEPOSITO" },
    { label: "OTRO", value: "OTRO" },
  ];

  useEffect(() => {
    if (visible && condicionPago) {
      setCondicion(condicionPago.condicion || "");
      setMetodo(condicionPago.metodo || "");
      setReferencia(condicionPago.referencia || "");
    }
  }, [visible, condicionPago]);

  const handleSave = () => {
    setCondicionPago({ condicion, metodo, referencia });
    onHide();
  };

  const headerContent = (
    <h2 className="text-xl font-bold">Condición de pago</h2>
  );

  const footer = (
    <div className="flex justify-end items-center gap-3 w-full">
      <Button
        label="CANCELAR"
        onClick={onHide}
        className="p-button-text !text-gray-600 hover:!bg-gray-100 !font-semibold !py-2 !px-5"
      />
      <Button
        label="GUARDAR"
        onClick={handleSave}
        className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-5 !rounded-lg"
      />
    </div>
  );

  return (
    <Dialog
      header={headerContent}
      visible={visible}
      style={{ width: "350px" }}
      modal
      draggable={false}
      onHide={onHide}
      footer={footer}
      headerClassName="!p-4 bg-blue-700 text-white rounded-t-lg"
      contentClassName="p-5 bg-white"
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm text-gray-600">
            Condición de pago
          </label>
          <Dropdown
            value={condicion}
            options={condicionesPago}
            onChange={(e) => setCondicion(e.value)}
            placeholder="Seleccione"
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-600">
            Método de pago
          </label>
          <Dropdown
            value={metodo}
            options={metodosPago}
            onChange={(e) => setMetodo(e.value)}
            placeholder="Seleccione"
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-600">
            Referencia (Opcional)
          </label>
          <InputText
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder=""
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default CondicionPagoModal;
