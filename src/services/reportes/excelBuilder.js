// src/services/reportes/excelBuilder.js
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import logo from "@/assets/Logo_WolfFur.png";

export async function buildExcel(sheetsData, fileName, onFinish) {
  if (!fileName || fileName.trim() === "") {
    throw new Error("El nombre del archivo no puede estar vacío.");
  }

  const workbook = new ExcelJS.Workbook();

  // Paleta
  const COLOR_BRAND   = "1857C3"; // Azul banda / título
  const COLOR_HEADER  = "60A5FA"; // Azul claro/celeste encabezados
  const COLOR_WHITE   = "FFFFFF";
  const COLOR_GRID    = "E5E7EB"; // Bordes gris claro
  const COLOR_ROW_ALT = "F7F9FC"; // Zebra
  const COLOR_TEXT    = "111827"; // Texto
  const COLOR_ANULADO = "FEE2E2"; // Fila anulada (fondo)
  const BORDER_THIN   = { style: "thin", color: { argb: COLOR_GRID } };

  for (const tipo of Object.keys(sheetsData)) {
    const sheetData = sheetsData[tipo] || [];
    const headers   = sheetData[2] || [];
    const lastCol   = Math.max(headers.length, 1);

    const worksheet = workbook.addWorksheet(tipo.slice(0, 31), {
      properties: { defaultRowHeight: 18 },
    });

    // -------- Fila 1: Banda + Logo + Título --------
    // Pintar toda la fila 1 de la banda azul y bordes
    for (let c = 1; c <= lastCol; c++) {
      const cell = worksheet.getCell(1, c);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_BRAND } };
      cell.border = { top: BORDER_THIN, left: BORDER_THIN, bottom: BORDER_THIN, right: BORDER_THIN };
      cell.font = { name: "Inter", size: 12, color: { argb: COLOR_WHITE } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    }

    // Logo (opcional)
    try {
      const res = await fetch(logo);
      const blob = await res.blob();
      const buf  = await blob.arrayBuffer();
      const imgId = workbook.addImage({ buffer: buf, extension: "png" });
      // Aproximado para encajar con 85px de alto de fila
      worksheet.addImage(imgId, {
        tl: { col: 0, row: 0 },
        ext: { width: 250, height: 100 },
      });
    } catch (e) {
      console.warn("No se encontró el logo:", e);
    }

    // Título centrado de B1..lastCol
    worksheet.mergeCells(1, 2, 1, lastCol);
    const titleCell = worksheet.getCell(1, 2);
    titleCell.value = (sheetData?.[0]?.[0] || tipo || "").toString().toUpperCase();
    titleCell.font = { name: "Inter", size: 16, bold: true, color: { argb: COLOR_WHITE } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    // Altura pedida
    worksheet.getRow(1).height = 85;

    // -------- Fila 2: Encabezados --------
    const headerRow = worksheet.insertRow(2, headers);
    headerRow.height = 17;
    headerRow.eachCell((cell) => {
      cell.font = { name: "Inter", bold: true, color: { argb: COLOR_WHITE }, size: 12 };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER } };
      cell.border = { top: BORDER_THIN, left: BORDER_THIN, bottom: BORDER_THIN, right: BORDER_THIN };
    });

    // -------- Datos: desde fila 3 --------
    sheetData.slice(3).forEach((rowArr, idx) => {
      const excelRow = worksheet.addRow(rowArr);
      const isAlt = idx % 2 === 0;

      excelRow.eachCell((cell, colIndex) => {
        const header = headers[colIndex - 1] || "";
        const H = header.toUpperCase();

        const isMoney      = /TOTAL|PRECIO|IMPORTE|SUBTOTAL|MONTO/.test(H);
        const isDate       = /FECHA/.test(H);
        const isNumberish  = isMoney || /CANTIDAD|NRO|N°|NUMERO|NÚMERO|CODIGO|CÓDIGO/.test(H);

        cell.font = { name: "Inter", size: 11, color: { argb: COLOR_TEXT } };
        cell.alignment = {
          vertical: "middle",
          horizontal: (isMoney || isNumberish) ? "right" : "left",
          wrapText: true,
        };
        cell.border = { top: BORDER_THIN, left: BORDER_THIN, bottom: BORDER_THIN, right: BORDER_THIN };

        if (isAlt) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_ROW_ALT } };
        }

        if (isMoney) {
          cell.numFmt = '#,##0.00';
        } else if (isDate) {
          cell.numFmt = 'dd/mm/yyyy';
        }
      });
    });

    // -------- Resaltar ESTADO SUNAT: ANULADO --------
    const estadoSunatIndex = headers.findIndex(h => (h || "").toUpperCase().includes("ESTADO SUNAT"));
    if (estadoSunatIndex !== -1) {
      worksheet.eachRow((row, rowNumber) => {
        // datos empiezan en 3
        if (rowNumber > 2) {
          const val = (row.getCell(estadoSunatIndex + 1).value ?? "").toString().toUpperCase();
          if (val.includes("ANULADO")) {
            row.eachCell(cell => {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_ANULADO } };
              cell.font = { ...cell.font, color: { argb: "991B1B" } };
            });
          }
        }
      });
    }

    // -------- Auto width --------
    worksheet.columns.forEach((col) => {
      let max = 10;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const v = cell.value;
        const s = v == null ? "" :
          (typeof v === "string" ? v : v.text || v.richText?.map(rt => rt.text).join("") || String(v));
        max = Math.max(max, s.length);
      });
      col.width = Math.min(Math.max(max + 2, 12), 60);
    });

    // -------- Congelar filas 1 y 2 (título + headers) --------
    worksheet.views = [{ state: "frozen", ySplit: 2 }];
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), fileName);
  if (onFinish) onFinish();
}
