import { useState, useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteChangeEvent,
  AutoCompleteSelectEvent,
} from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { configCalendar } from "@/utils/calendar/configCalendar";
import {
  getClientes,
  getTiposComprobante,
  getSeries,
  getProductos,
  mapTipo,
  Cliente,
  Producto,
} from "@/services/generadorData";
import { visualizarPDF } from "@/utils/pdf/pdfViewer";
import { useProductosAgregados } from "@/hooks/useProductosAgregados";
import {
  PermIdentityTwoToneIcon,
  CloseIcon,
  MenuIcon,
} from "@/constants/icons";
import useVentaStore from "@/stores/ventasStore";
import { componentsVentas } from "@/constants/menuItems";

import PlacaModal from "./components/PlacaModal";
import OrdenCompraModal from "./components/OrdenCompraModal";
import ObservacionesModal from "./components/ObservacionesModal";

import CondicionPagoModal from "./components/CondicionPagoModal";
import DatosAdicionalesModal from "./components/DatosAdicionalesModal";
import GuiaRemisionModal from "./components/GuiaRemisionModal";
import { PdfFormat } from "@/utils/pdf/pdfConfig";

interface VentaComponent {
  name: string;
  action: string;
  isInput: boolean;
  placeholder?: string;
}

const VentasView = () => {
  const {
    placa,
    ordenCompra,
    observaciones,
    condicionPago,
    datosAdicionales,
    guiasRemision,
  } = useVentaStore();

  const [fechaEmision, setFechaEmision] = useState<Date | null>(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | null>(null);
  const [clienteInput, setClienteInput] = useState("");
  const [clienteSel, setClienteSel] = useState<Cliente | null>(null);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [comprobante, setComprobante] = useState("BOLETA DE VENTA ELECTRÓNICA");
  const [seriesDisponibles, setSeriesDisponibles] = useState<string[]>([]);
  const [serie, setSerie] = useState("B001");
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [proformaChecked, setProformaChecked] = useState(false);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [tipoPdf, setTipoPdf] = useState<PdfFormat>("A4");

  const acClienteRef = useRef<AutoComplete>(null);
  const menuOtrosRef = useRef<Menu>(null);

  const [showPlacaModal, setShowPlacaModal] = useState(false);
  const [showOrdenCompraModal, setShowOrdenCompraModal] = useState(false);
  const [showObservacionesModal, setShowObservacionesModal] = useState(false);

  const [globalDiscount, setGlobalDiscount] = useState(0);

  // Esta es la función que faltaba
  const [modalsOtros, setModalsOtros] = useState<Record<string, boolean>>({});
  const handleHideModalOtros = (action: string) =>
    setModalsOtros((prev) => ({ ...prev, [action]: false }));

  const allComponents = componentsVentas as VentaComponent[];

  const otrosModalItems = allComponents
    .filter((c) => !c.isInput)
    .map(({ name, action }) => ({
      label: `${name} ${(() => {
        switch (action) {
          case "guia":
            return guiasRemision && guiasRemision.length > 0 ? " ✓" : "";
          case "adicionales":
            return datosAdicionales && datosAdicionales.length > 0 ? " ✓" : "";
          case "condicionPago":
            return condicionPago && condicionPago.condicion ? " ✓" : "";
          default:
            return "";
        }
      })()}`,
      command: () => setModalsOtros((prev) => ({ ...prev, [action]: true })),
    }));

  const clientesList = getClientes();
  const productosList = getProductos();
  const comprobantesList = getTiposComprobante();
  const DEFAULT_COMPROBANTE = "BOLETA DE VENTA ELECTRÓNICA";
  const DEFAULT_SERIE = "B001";

  const {
    productosAgregados,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    getDiscountedItem,
    totalGeneral,
    totalsDesglose,
  } = useProductosAgregados(globalDiscount);

  useEffect(() => {
    configCalendar();
  }, []);

  const formatCliente = (c: Cliente | null) => {
    if (!c) return "";
    const doc = c.documento ? String(c.documento).trim() : "";
    const nombreCompleto = (c.nombre || c.razonSocial || "").trim();
    if (doc && nombreCompleto) return `${doc} — ${nombreCompleto}`;
    return nombreCompleto || doc;
  };

  useEffect(() => {
    if (mapTipo[comprobante]) {
      const nuevasSeries = getSeries(mapTipo[comprobante]);
      setSeriesDisponibles(nuevasSeries);
      setSerie(
        nuevasSeries.includes(DEFAULT_SERIE)
          ? DEFAULT_SERIE
          : nuevasSeries[0] || ""
      );
    } else {
      setSeriesDisponibles([]);
      setSerie("");
    }
  }, [comprobante]);

  const handleProformaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProformaChecked(e.target.checked);
    if (e.target.checked) {
      setComprobante("PROFORMA ELECTRÓNICA");
      const s = getSeries("PROFORMA");
      setSeriesDisponibles(s);
      setSerie(s[0] || "");
    } else {
      setComprobante(DEFAULT_COMPROBANTE);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setGlobalDiscount(Math.min(100, Math.max(0, value || 0)));
  };

  const handleVistaPrevia = async () => {
    let doc = clienteSel?.documento;
    if (!doc) {
      doc = (comprobante || "").includes("FACTURA")
        ? "20000000001"
        : "00000001";
    }

    const p = {
      documento: doc,
      documentoTipo: clienteSel?.documentoTipo || "DNI",
      cliente:
        clienteSel?.razonSocial || clienteSel?.nombre || "CLIENTE VARIOS",
      direccion: clienteSel?.direccion || "",
      tDocumento: comprobante,
      serie,
      numero: String(Date.now() % 10000),
      items: productosAgregados.map((p) => getDiscountedItem(p)),
      fecha: fechaEmision || new Date(),
      fechaVencimiento: fechaVencimiento
        ? fechaVencimiento.toISOString()
        : undefined,
      monto: {
        total: totalGeneral,
        ...totalsDesglose,
      },
      state: "PENDIENTE",
      tipoOperacion: "VENTA",
      sucursal: "PRINCIPAL",
      usuario: "DEMO",
      placaVehiculo: placa,
      ordenCompra: ordenCompra,
      observaciones,
      condicionPago,
      datosAdicionales,
      guiasRemision,
    };

    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    const blob = await visualizarPDF(p as any, tipoPdf);
    setPdfUrl(URL.createObjectURL(blob));
    setVisiblePreview(true);
  };

  const HEADER = { __type: "header" };
  const TIPS = { __type: "tips" };
  const closePanelLater = () => setTimeout(() => setClientesFiltrados([]), 120);

  const buildClienteSuggestions = (q: string) => {
    if (!q) return [HEADER, TIPS];
    const query = q.toLowerCase().trim();
    const matches = clientesList.filter(
      (c) =>
        (c.nombre || "").toLowerCase().includes(query) ||
        (c.razonSocial || "").toLowerCase().includes(query) ||
        (c.documento || "").toString().toLowerCase().includes(query)
    );
    return [HEADER, ...matches, TIPS];
  };

  const buscarClientes = (e: AutoCompleteCompleteEvent) => {
    // @ts-ignore
    setClientesFiltrados(buildClienteSuggestions(e.query));
  };

  const buscarProductos = (e: AutoCompleteCompleteEvent) => {
    const q = (e.query ?? "").toLowerCase();
    setProductosFiltrados(
      productosList.filter((p) =>
        (p.descripcion || "").toLowerCase().includes(q)
      )
    );
  };

  const clienteItemTemplate = (opt: any) => {
    if (opt?.__type) {
      if (opt.__type === "header")
        return (
          <div
            className="top-0 z-10 sticky flex justify-between items-center bg-white px-4 py-3 border-b"
            onMouseDown={(e) => e.preventDefault()}
          >
            <span className="font-semibold text-[13px] text-gray-600 uppercase tracking-wide">
              Resultados
            </span>
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md font-bold text-[12px] text-white"
              onMouseDown={(e) => e.preventDefault()}
            >
              REGISTRAR NUEVO
            </button>
          </div>
        );
      if (opt.__type === "tips")
        return (
          <div
            className="bottom-0 sticky bg-white px-4 py-3 border-t text-[12px] text-gray-600 leading-5"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div>
              <strong>TIP:</strong> Escribe para buscar
            </div>
            <div>
              <strong>TIP:</strong> Para DNI/RUC, escribe el número y presiona{" "}
              <strong>ENTER</strong>
            </div>
          </div>
        );
    }
    return (
      <div className="hover:bg-gray-50 px-3 py-2">
        <div className="text-[12px] text-gray-500">{opt.documento}</div>
        <div className="font-semibold text-[13px] text-gray-800">
          {opt.razonSocial || opt.nombre || "Cliente"}
        </div>
      </div>
    );
  };

  const handleSelectCliente = (e: AutoCompleteSelectEvent) => {
    const selected = e.value;
    if (selected && typeof selected !== "string") {
      const clientObj = selected as Cliente;
      setClienteSel(clientObj);
      setClienteInput(formatCliente(clientObj));
    }
    closePanelLater();
  };

  return (
    <div className="flex flex-col bg-white shadow-md p-6 rounded-lg w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="ml-16 font-bold text-gray-800 text-3xl">Nueva venta</h2>
        <label className="flex items-center gap-2 text-gray-700 text-sm">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={proformaChecked}
            onChange={handleProformaChange}
          />
          PROFORMA
        </label>
      </div>

      <div className="gap-4 grid grid-cols-4 mb-4">
        <div className="col-span-2">
          <label className="block mb-1 text-gray-500 text-xs">Cliente</label>
          <div className="relative w-full h-11">
            {clienteSel ? (
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 w-full h-full border border-gray-300">
                <PermIdentityTwoToneIcon
                  className="text-gray-600"
                  style={{ fontSize: "1.1rem" }}
                />
                <span className="font-medium text-sm text-gray-800 truncate">
                  {formatCliente(clienteSel)}
                </span>
                <button
                  type="button"
                  className="ml-auto text-gray-400 hover:text-gray-700"
                  onClick={() => {
                    setClienteSel(null);
                    setClienteInput("");
                  }}
                >
                  <CloseIcon style={{ fontSize: "1rem" }} />
                </button>
              </div>
            ) : (
              <AutoComplete
                ref={acClienteRef}
                appendTo="self"
                panelStyle={{ width: "100%" }}
                value={clienteInput}
                suggestions={clientesFiltrados}
                completeMethod={buscarClientes}
                field="razonSocial"
                onChange={(e: AutoCompleteChangeEvent) =>
                  setClienteInput(e.value ?? "")
                }
                onSelect={handleSelectCliente}
                itemTemplate={clienteItemTemplate}
                placeholder="Escribe para buscar un cliente..."
                className="w-full"
                inputClassName="h-11 rounded-md border border-gray-300 px-3 text-[14px] w-full focus:ring-2 focus:ring-blue-400"
                panelClassName="max-h-[340px] rounded-md border border-gray-300 shadow-lg overflow-y-auto"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-500 text-xs">
            Fecha de emisión
          </label>
          <Calendar
            value={fechaEmision}
            onChange={(e) => setFechaEmision(e.value as Date | null)}
            dateFormat="dd/mm/yy"
            showIcon
            className="w-full"
            inputClassName="w-full h-11 border border-gray-300 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-500 text-xs">
            Fecha de vencimiento
          </label>
          <Calendar
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.value as Date | null)}
            dateFormat="dd/mm/yy"
            showIcon
            className="w-full"
            inputClassName="w-full h-11 border border-gray-300 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="gap-4 grid grid-cols-4 mb-4">
        <div>
          <label className="block mb-1 text-gray-500 text-xs">
            Tipo de comprobante
          </label>
          <select
            value={comprobante}
            onChange={(e) => setComprobante(e.target.value)}
            className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]"
          >
            <option value="">---Seleccionar---</option>
            {comprobantesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-500 text-xs">Serie</label>
          <select
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
            className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]"
          >
            <option>---Seleccionar---</option>
            {seriesDisponibles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-500 text-xs">
            Tipo de operación
          </label>
          <select className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]">
            <option>VENTA INTERNA</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-500 text-xs">
            Dscto. global (%)
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={globalDiscount || ""}
            onChange={handleDiscountChange}
            className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => setShowPlacaModal(true)}
          className={`w-full py-2 px-4 rounded-lg font-bold text-white transition-colors ${
            placa
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          PLACA {placa && "✓"}
        </button>

        <button
          type="button"
          onClick={() => setShowOrdenCompraModal(true)}
          className={`w-full py-2 px-4 rounded-lg font-bold text-white transition-colors ${
            ordenCompra
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          O. COMPRA {ordenCompra && "✓"}
        </button>

        <button
          type="button"
          onClick={() => setShowObservacionesModal(true)}
          className={`w-full py-2 px-4 rounded-lg font-bold text-white transition-colors ${
            observaciones
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          OBSERVACIONES {observaciones && "✓"}
        </button>

        <div className="relative w-full">
          <Menu model={otrosModalItems} popup ref={menuOtrosRef} />
          <button
            type="button"
            onClick={(e) => menuOtrosRef.current?.toggle(e)}
            className="w-full py-2 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            OTROS <MenuIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 mb-6 p-6 border border-gray-300 rounded-md overflow-auto text-gray-500 text-sm text-center">
        {productosAgregados.length === 0 ? (
          <div className="p-6 text-gray-500 text-sm text-center">
            Busca un producto....
          </div>
        ) : (
          <table className="w-full text-gray-700 text-sm">
            <thead className="bg-gray-100 border-b text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2">Precio Unit.</th>
                <th className="px-4 py-2">Descuento</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {productosAgregados.map((p) => {
                const discountedItem = getDiscountedItem(p);
                const descuento = discountedItem.descuentoAplicado || 0;
                const total = discountedItem.totalFinal || 0;

                return (
                  <tr key={p.codigo} className="border-b">
                    <td className="px-4 py-2 text-left">{p.descripcion}</td>
                    <td className="px-4 py-2 text-center">
                      S/{p.precio?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      S/{descuento.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      S/{total.toFixed(2)}
                    </td>
                    <td className="flex justify-center items-center gap-2 px-4 py-2">
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        onClick={() =>
                          actualizarCantidad(p.codigo, p.cantidad - 1)
                        }
                      >
                        -
                      </button>
                      <span>{p.cantidad}</span>
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                        onClick={() =>
                          actualizarCantidad(p.codigo, p.cantidad + 1)
                        }
                      >
                        +
                      </button>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                        onClick={() => eliminarProducto(p.codigo)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="bottom-0 sticky bg-white pt-4 border-gray-300 border-t">
        <div className="mb-4">
          <AutoComplete
            value={producto}
            suggestions={productosFiltrados}
            completeMethod={buscarProductos}
            field="descripcion"
            onChange={(e: AutoCompleteChangeEvent) => setProducto(e.value)}
            onSelect={(e: AutoCompleteSelectEvent) => {
              agregarProducto(e.value);
              setProducto(null);
            }}
            placeholder="Escriba nombre del producto..."
            className="w-full"
            inputClassName="h-11 rounded-md border border-gray-300 px-3 text-[14px] w-full focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="group relative flex-[22] text-center cursor-pointer">
            <p className="font-bold text-gray-700 text-lg">
              <strong>
                TOTAL{" "}
                <span className="text-black">
                  S/. {totalGeneral.toFixed(2)}
                </span>
              </strong>
            </p>
            <div className="hidden group-hover:block bottom-full left-1/2 absolute bg-white shadow-lg mb-2 p-4 border rounded-lg w-52 text-gray-700 text-sm -translate-x-1/2 z-10">
              {[
                "Anticipios",
                "DSCTO",
                "Gravado",
                "Exonerado",
                "Inafecto",
                "Exportación",
                "Gratuito",
                "I.S.C",
                "I.G.V",
                "R.C",
                "I.C.B.P.E.R",
              ].map((item) => (
                <div key={item} className="flex justify-between">
                  <span>{item}</span>
                  <span>
                    S/{" "}
                    {(totalsDesglose as any)[
                      item.toLowerCase().replace(".", "").replace(" ", "")
                    ]?.toFixed(2) || "0.00"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleVistaPrevia}
            className="flex-[9] bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-semibold text-gray-700"
          >
            VISTA PREVIA
          </button>
          <button
            type="button"
            className="flex-[9] bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-white"
          >
            PROCESAR
          </button>
        </div>

        <Dialog
          header="Vista previa PDF"
          visible={visiblePreview}
          maximized
          onHide={() => setVisiblePreview(false)}
        >
          <div className="flex gap-10 mb-3">
            <select
              value={tipoPdf}
              onChange={(e) => setTipoPdf(e.target.value as PdfFormat)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="A4">Formato A4</option>
              <option value="t80mm">Ticket 80mm</option>
            </select>
            <button
              type="button"
              onClick={handleVistaPrevia}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
            >
              Actualizar
            </button>
          </div>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              title="Vista previa PDF"
              className="border-0 w-full h-[calc(100vh-100px)]"
            />
          )}
        </Dialog>
      </div>

      <PlacaModal
        visible={showPlacaModal}
        onHide={() => setShowPlacaModal(false)}
      />
      <OrdenCompraModal
        visible={showOrdenCompraModal}
        onHide={() => setShowOrdenCompraModal(false)}
      />
      <ObservacionesModal
        visible={showObservacionesModal}
        onHide={() => setShowObservacionesModal(false)}
      />
      <GuiaRemisionModal
        visible={!!modalsOtros.guia}
        onHide={() => handleHideModalOtros("guia")}
      />
      <DatosAdicionalesModal
        visible={!!modalsOtros.adicionales}
        onHide={() => handleHideModalOtros("adicionales")}
      />
      <CondicionPagoModal
        visible={!!modalsOtros.condicionPago}
        onHide={() => handleHideModalOtros("condicionPago")}
      />
    </div>
  );
};

export default VentasView;
