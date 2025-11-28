import * as XLSX from "xlsx";

/**
 * Exporta datos a archivo Excel
 * @param {Array} data - Datos a exportar
 * @param {string} filename - Nombre del archivo (sin extensión)
 * @param {string} sheetName - Nombre de la hoja
 * @returns {boolean} - true si se exportó exitosamente
 */
export const exportToExcel = (
  data: any[],
  filename: string = "reporte",
  sheetName: string = "Datos"
): boolean => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const timestamp = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);

    return true;
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
    return false;
  }
};

/**
 * Exporta con columnas personalizadas
 * @param {Array} data - Datos
 * @param {Object} columnConfig - Configuración de columnas { campo: 'Nombre Columna' }
 * @param {string} filename - Nombre del archivo
 * @returns {boolean} - true si se exportó exitosamente
 */
export const exportToExcelCustom = (
  data: any[],
  columnConfig: Record<string, string>,
  filename: string = "reporte"
): boolean => {
  try {
    const mappedData = data.map((row) => {
      const newRow: Record<string, any> = {};
      Object.keys(columnConfig).forEach((key) => {
        newRow[columnConfig[key]] = row[key];
      });
      return newRow;
    });

    return exportToExcel(mappedData, filename);
  } catch (error) {
    console.error("Error al exportar:", error);
    return false;
  }
};
