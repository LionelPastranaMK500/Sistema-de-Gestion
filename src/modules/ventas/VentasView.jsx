import { useState, useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { configCalendar } from "@utils/configCalendar";
import {
  getClientes,
  getTiposComprobante,
  getSeries,
  getProductos,
  mapTipo,
} from "@services/generadorData";
import { visualizarPDF } from "@utils/pdfViewer";
import { generarRuc, generarDni } from "@services/generadorDocumentos";
import VentasModal from "./VentasModal";
import { useProductosAgregados } from "@hooks/useProductosAgregados";
import { PermIdentityTwoToneIcon, CloseIcon } from "@constants/iconsConstants";

const VentasView = () => {
  const [fechaEmision, setFechaEmision] = useState(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState(null);

  const clientes = getClientes();
  const productos = getProductos();
  const comprobantes = getTiposComprobante();

  const DEFAULT_COMPROBANTE = "BOLETA DE VENTA ELECTRÓNICA";
  const DEFAULT_SERIE = "B001";

  const seriesIniciales = mapTipo[DEFAULT_COMPROBANTE]
    ? getSeries(mapTipo[DEFAULT_COMPROBANTE])
    : [];

  // Mantenemos la lógica de dos estados que es estable
  const [clienteInput, setClienteInput] = useState(""); // Para el texto del input
  const [clienteSel, setClienteSel] = useState(null);   // Para el objeto seleccionado

  const [producto, setProducto] = useState(null);
  const [comprobante, setComprobante] = useState(DEFAULT_COMPROBANTE);
  const [seriesDisponibles, setSeriesDisponibles] = useState(seriesIniciales);
  const [serie, setSerie] = useState(
    seriesIniciales.includes(DEFAULT_SERIE)
      ? DEFAULT_SERIE
      : seriesIniciales[0] || ""
  );

  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [proformaChecked, setProformaChecked] = useState(false);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [tipoPdf, setTipoPdf] = useState("A4");

  const acClienteRef = useRef(null);
  const HEADER = { __type: "header" };
  const TIPS = { __type: "tips" };
  const closePanelLater = () => setTimeout(() => setClientesFiltrados([]), 120);

  useEffect(() => {
    configCalendar();
  }, []);

  const formatCliente = (c) => {
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
  
  // Las funciones como handleProformaChange, handleVistaPrevia, etc., no cambian
  const handleProformaChange = (e) => { setProformaChecked(e.target.checked); if (e.target.checked) { setComprobante("PROFORMA ELECTRÓNICA"); const s = getSeries("PROFORMA"); setSeriesDisponibles(s); setSerie(s[0] || ""); } else { setComprobante(""); setSerie(""); setSeriesDisponibles([]); } };
  const handleVistaPrevia = async () => { let doc = clienteSel?.documento; if (!doc) { if (comprobante.includes("FACTURA")) doc = generarRuc(); else doc = generarDni(); } const p = { ruc: doc, cliente: clienteSel?.razonSocial || clienteSel?.nombre || "", direccion: clienteSel?.direccion || "", tDocumento: comprobante, serie, numero: Date.now() % 10000, items: productosAgregados, fecha: fechaEmision, fechaVencimiento, total: totalGeneral }; if (pdfUrl) URL.revokeObjectURL(pdfUrl); const blob = await visualizarPDF(p, tipoPdf); setPdfUrl(URL.createObjectURL(blob)); setVisiblePreview(true); };
  const buildClienteSuggestions = (q) => { if (!q) return [HEADER, TIPS]; const query = q.toLowerCase().trim(); const matches = clientes.filter(c => (c.nombre || "").toLowerCase().includes(query) || (c.razonSocial || "").toLowerCase().includes(query) || (c.documento || "").toString().toLowerCase().includes(query)); return [HEADER, ...matches, TIPS]; };
  const buscarClientes = (e) => setClientesFiltrados(buildClienteSuggestions(e.query));
  const buscarProductos = (e) => { const q = (e.query ?? "").toLowerCase(); setProductosFiltrados(productos.filter(p => (p.descripcion || "").toLowerCase().includes(q))); };
  const { productosAgregados, agregarProducto, actualizarCantidad, eliminarProducto, totalGeneral } = useProductosAgregados();
  const handleKeyEnter = (e) => { if (e.key === "Enter" && e.target.value) { agregarProducto(e.target.value); } };

  const clienteItemTemplate = (opt) => {
    if (opt?.__type) {
      if (opt.__type === "header") return <div className="top-0 z-10 sticky flex justify-between items-center bg-white px-4 py-3 border-b" onMouseDown={e => e.preventDefault()}><span className="font-semibold text-[13px] text-gray-600 uppercase tracking-wide">Resultados</span><button type="button" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md font-bold text-[12px] text-white" onMouseDown={e => e.preventDefault()}>REGISTRAR NUEVO</button></div>;
      if (opt.__type === "tips") return <div className="bottom-0 sticky bg-white px-4 py-3 border-t text-[12px] text-gray-600 leading-5" onMouseDown={e => e.preventDefault()}><div><strong>TIP:</strong> Escribe para buscar</div><div><strong>TIP:</strong> Para DNI/RUC, escribe el número y presiona <strong>ENTER</strong></div></div>;
    }
    return <div className="hover:bg-gray-50 px-3 py-2"><div className="text-[12px] text-gray-500">{opt.documento}</div><div className="font-semibold text-[13px] text-gray-800">{opt.razonSocial || opt.nombre || "Cliente"}</div></div>;
  };

  return (
    <div className="flex flex-col bg-white shadow-md p-6 rounded-lg w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="ml-16 font-bold text-gray-800 text-3xl">Nueva venta</h2>
        <label className="flex items-center gap-2 text-gray-700 text-sm">
          <input type="checkbox" className="w-4 h-4" checked={proformaChecked} onChange={handleProformaChange} />
          PROFORMA
        </label>
      </div>

      <div className="gap-4 grid grid-cols-4 mb-4">
        <div className="col-span-2">
          <label className="block mb-1 text-gray-500 text-xs">Cliente</label>
          <div className="relative w-full h-11">
            {/* ✨ LÓGICA DE VISIBILIDAD: O MUESTRA LA CÁPSULA O MUESTRA EL INPUT DE BÚSQUEDA ✨ */}
            
            {clienteSel ? (
              // 1. VISTA DE CÁPSULA (cuando ya hay un cliente seleccionado)
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 w-full h-full border border-gray-300">
                <PermIdentityTwoToneIcon className="text-gray-600" style={{ fontSize: '1.1rem' }} />
                <span className="font-medium text-sm text-gray-800 truncate">
                  {formatCliente(clienteSel)}
                </span>
                <button
                  type="button"
                  className="ml-auto text-gray-400 hover:text-gray-700"
                  onClick={() => {
                    setClienteSel(null); // Limpia la selección
                    setClienteInput(""); // Limpia el texto
                  }}
                >
                  <CloseIcon style={{ fontSize: '1rem' }} />
                </button>
              </div>
            ) : (
              // 2. VISTA DE AUTOCOMPLETE (para buscar)
              <AutoComplete
                ref={acClienteRef}
                appendTo="self"
                panelStyle={{ width: "100%" }}
                value={clienteInput}
                suggestions={clientesFiltrados}
                completeMethod={buscarClientes}
                field="razonSocial"
                onChange={(e) => setClienteInput(e.value ?? "")}
                onSelect={(e) => {
                  setClienteSel(e.value);
                  setClienteInput(formatCliente(e.value));
                  closePanelLater();
                }}
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
          <label className="block mb-1 text-gray-500 text-xs">Fecha de emisión</label>
          <Calendar value={fechaEmision} onChange={(e) => setFechaEmision(e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" inputClassName="w-full h-11 border border-gray-300 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Fecha de vencimiento</label>
          <Calendar value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" inputClassName="w-full h-11 border border-gray-300 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>
      
      {/* El resto del JSX no ha sido modificado */}
      <div className="gap-4 grid grid-cols-4 mb-4">
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Tipo de comprobante</label>
          <select value={comprobante} onChange={(e) => setComprobante(e.target.value)} className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]"><option value="">---Seleccionar---</option>{comprobantes.map((c) => (<option key={c} value={c}>{c}</option>))}</select>
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Serie</label>
          <select value={serie} onChange={(e) => setSerie(e.target.value)} className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]"><option>---Seleccionar---</option>{seriesDisponibles.map((s) => (<option key={s} value={s}>{s}</option>))}</select>
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Tipo de operación</label>
          <select className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]"><option>VENTA INTERNA</option></select>
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Dscto. global (%)</label>
          <input type="number" placeholder="0.00" className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]" />
        </div>
      </div>
      <div className="gap-2 grid grid-cols-4 mb-6"><VentasModal /></div>
      <div className="flex-1 bg-gray-50 mb-6 p-6 border border-gray-300 rounded-md overflow-auto text-gray-500 text-sm text-center">
        {productosAgregados.length === 0 ? <div className="p-6 text-gray-500 text-sm text-center">Busca un producto....</div> : ( <table className="w-full text-gray-700 text-sm"> <thead className="bg-gray-100 border-b text-gray-500 text-xs uppercase"> <tr> <th className="px-4 py-2 text-left">Producto</th> <th className="px-4 py-2">Precio Unit.</th> <th className="px-4 py-2">Descuento</th> <th className="px-4 py-2">Total</th> <th className="px-4 py-2">Cantidad</th> <th className="px-4 py-2"></th> </tr> </thead> <tbody> {productosAgregados.map((p) => ( <tr key={p.codigo} className="border-b"> <td className="px-4 py-2 text-left">{p.descripcion}</td> <td className="px-4 py-2 text-center">S/{p.precio?.toFixed(2)}</td> <td className="px-4 py-2 text-center">S/ 0.00</td> <td className="px-4 py-2 text-center">S/{(p.cantidad * p.precio).toFixed(2)}</td> <td className="flex justify-center items-center gap-2 px-4 py-2"> <button className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded" onClick={() => actualizarCantidad(p.codigo, p.cantidad - 1)}>-</button> <span>{p.cantidad}</span> <button className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded" onClick={() => actualizarCantidad(p.codigo, p.cantidad + 1)}>+</button> </td> <td className="px-4 py-2 text-center"> <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white" onClick={() => eliminarProducto(p.codigo)}>Eliminar</button> </td> </tr> ))} </tbody> </table> )}
      </div>
      <div className="bottom-0 sticky bg-white pt-4 border-gray-300 border-t">
        <div className="mb-4">
          <AutoComplete value={producto} suggestions={productosFiltrados} completeMethod={buscarProductos} field="descripcion" onChange={(e) => setProducto(e.value)} onSelect={(e) => { agregarProducto(e.value); setProducto(null); }} placeholder="Escriba nombre del producto..." className="w-full" inputClassName="h-11 rounded-md border border-gray-300 px-3 text-[14px] w-full focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex justify-between items-center gap-4">
          <div className="group relative flex-[22] text-center cursor-pointer">
            <p className="font-bold text-gray-700 text-lg"><strong>TOTAL <span className="text-black">S/. {totalGeneral.toFixed(2)}</span></strong></p>
            <div className="hidden group-hover:block bottom-full left-1/2 absolute bg-white shadow-lg mb-2 p-4 border rounded-lg w-52 text-gray-700 text-sm -translate-x-1/2 z-10">{["Anticipios", "DSCTO", "Gravado", "Exonerado", "Inafecto", "Exportación", "Gratuito", "I.S.C", "I.G.V", "R.C", "I.C.B.P.E.R"].map((item) => (<div key={item} className="flex justify-between"><span>{item}</span><span>S/ 0.00</span></div>))}</div>
          </div>
          <button onClick={handleVistaPrevia} className="flex-[9] bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-semibold text-gray-700">VISTA PREVIA</button>
          <button className="flex-[9] bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-white">PROCESAR</button>
        </div>
        <Dialog header="Vista previa PDF" visible={visiblePreview} maximized onHide={() => setVisiblePreview(false)}>
          <div className="flex gap-10 mb-3">
            <select value={tipoPdf} onChange={(e) => setTipoPdf(e.target.value)} className="px-2 py-1 border rounded text-sm"><option value="A4">Formato A4</option><option value="t80mm">Ticket 80mm</option></select>
            <button onClick={handleVistaPrevia} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm">Actualizar</button>
          </div>
          {pdfUrl && (<iframe src={pdfUrl} title="Vista previa PDF" className="border-0 w-full h-[calc(100vh-100px)]" />)}
        </Dialog>
      </div>
    </div>
  );
};

export default VentasView;