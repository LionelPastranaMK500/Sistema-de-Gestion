import { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useFormInput } from "@/hooks/forms";
import { Usuario } from "@/services/generadorData";

const inputStyle =
  "w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";

interface UsuarioDisplay extends Usuario {
  nombreCompleto?: string;
  alias?: string;
}

interface UsuarioModalProps {
  visible: boolean;
  onHide: () => void;
  mode: "add" | "edit";
  userData?: UsuarioDisplay | null;
}

interface UsuarioForm {
  email: string;
  rol: string | null;
  alias: string;
}

const UsuarioModal = ({
  visible,
  mode,
  userData,
  onHide,
}: UsuarioModalProps) => {
  const { formData, handleChange, resetForm, setFormData } =
    useFormInput<UsuarioForm>({
      email: "",
      rol: null,
      alias: "",
    });

  const roles = ["ADMINISTRADOR", "VENDEDOR", "CONTADOR"];

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && userData) {
        setFormData({
          email: userData.correo || "",
          rol: userData.rol || null,
          alias: userData.alias || "",
        });
      } else {
        resetForm();
      }
    }
  }, [visible, mode, userData]);

  const header = (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Usuario</h2>
    </div>
  );

  const footer = (
    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-6">
      {mode === "add" && (
        <Button
          label="NUEVA CUENTA"
          className="!text-blue-600 !font-bold hover:!bg-blue-50 !py-2 !px-4 !rounded-lg"
          text
        />
      )}
      <div className="flex-grow" />
      <Button
        label="CANCELAR"
        onClick={onHide}
        className="!text-gray-600 !font-semibold hover:!bg-gray-100 !py-2 !px-5 !rounded-lg"
        text
      />
      <Button
        label="GUARDAR"
        className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-5 !rounded-lg"
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={header}
      footer={footer}
      modal
      closable={true}
      draggable={false}
      className="w-[min(500px,90vw)]"
      headerClassName="bg-blue-700 text-white p-4"
      contentClassName="p-6 bg-white rounded-b-lg"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            {mode === "edit" ? "Usuario" : "Email cuenta registrada"}
          </label>
          {mode === "edit" ? (
            <div className={`${inputStyle} bg-gray-100 cursor-not-allowed`}>
              <p className="font-semibold text-gray-800">
                {userData?.nombreCompleto || userData?.nombres}
              </p>
              <p className="text-gray-600 text-xs">{userData?.correo}</p>
            </div>
          ) : (
            <InputText
              placeholder="Email cuenta registrada"
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
              className={inputStyle}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Rol
          </label>
          <Dropdown
            options={roles}
            placeholder="Seleccionar Rol"
            value={formData.rol}
            onChange={(e) => handleChange(e, "rol")}
            className={`${inputStyle} p-0`}
            panelClassName="rounded-lg"
          />
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 mb-2 tracking-wider">
            DATOS ADICIONALES
          </p>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Alias para ventas
          </label>
          <InputText
            placeholder="Alias para ventas"
            value={formData.alias}
            onChange={(e) => handleChange(e, "alias")}
            className={inputStyle}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default UsuarioModal;
