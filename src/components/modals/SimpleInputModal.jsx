import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useModalInput } from "@hooks/modals";

const SimpleInputModal = ({
    visible,
    onHide,
    title,
    placeholder,
    value,
    onSave,
    type = "text",
    rows = 5
}) => {
    const { inputValue, setInputValue, handleSave } = useModalInput(
        visible,
        value,
        (newValue) => {
            onSave(newValue);
            onHide();
        }
    );

    const headerContent = (
        <h2 className="text-xl font-bold">{title}</h2>
    );

    const footer = (
        <div className="flex justify-end items-center gap-3 w-full">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-secondary !bg-gray-300 !text-gray-700 hover:!bg-gray-400 !border-gray-400 !font-semibold !py-2 !px-5 !rounded-lg"
            />
            <Button
                label="Guardar"
                icon="pi pi-check"
                onClick={handleSave}
                autoFocus
                className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-5 !rounded-lg"
            />
        </div>
    );

    return (
        <Dialog
            header={headerContent}
            visible={visible}
            style={{ width: '30vw' }}
            modal
            draggable={false}
            onHide={onHide}
            footer={footer}
            headerClassName="!p-4 bg-blue-700 text-white rounded-t-lg"
            contentClassName="p-5 bg-white"
            footerClassName="p-5 bg-white border-t-2 border-gray-200"
        >
            {type === "textarea" ? (
                <InputTextarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    rows={rows}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    placeholder={placeholder}
                    autoFocus
                />
            ) : (
                <InputText
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder={placeholder}
                    autoFocus
                />
            )}
        </Dialog>
    );
};

export default SimpleInputModal;