import { ventasService } from '../api/ventas.service';
import { toast } from 'react-toastify';

const validarVenta = (ventaData) => {
    const errors = [];

    if (!ventaData.cliente || !ventaData.cliente.documento) {
        errors.push('Cliente es requerido');
    }

    if (!ventaData.items || ventaData.items.length === 0) {
        errors.push('Debe agregar al menos un producto');
    }

    if (ventaData.total <= 0) {
        errors.push('El total debe ser mayor a cero');
    }

    if (ventaData.tipoComprobante === 'FACTURA' && ventaData.cliente.tipoDocumento !== 'RUC') {
        errors.push('Para factura el cliente debe tener RUC');
    }

    return errors;
};

export const handleEmitirVenta = async (ventaData, navigate) => {
    try {
        const errors = validarVenta(ventaData);
        if (errors.length > 0) {
            errors.forEach(err => toast.error(err));
            return { success: false, errors };
        }
        toast.info('Emitiendo documento...');
        const response = await ventasService.emitir(ventaData);

        toast.success(`${response.tipoComprobante} ${response.numero} emitida exitosamente`);
        if (response.pdf) {
            window.open(response.pdf, '_blank');
        }

        return { success: true, data: response };
    } catch (err) {
        const message = err.data?.message || 'Error al emitir documento';
        toast.error(message);
        return { success: false, error: message };
    }
};

export const handleConsultarEstado = async (documentoId) => {
    try {
        toast.info('Consultando estado SUNAT...');
        const response = await ventasService.getEstado(documentoId);

        if (response.estado === 'ACEPTADO') {
            toast.success('Documento aceptado por SUNAT');
        } else if (response.estado === 'RECHAZADO') {
            toast.error(`Documento rechazado: ${response.motivo}`);
        } else {
            toast.warning(`Estado: ${response.estado}`);
        }

        return { success: true, data: response };
    } catch (err) {
        toast.error('Error al consultar estado');
        return { success: false };
    }
};

export const handleDescargarCDR = async (documentoId) => {
    try {
        const response = await ventasService.getCdr(documentoId);
        const byteCharacters = atob(response.cdrBase64);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CDR-${response.numero}.zip`;
        link.click();

        toast.success('CDR descargado');
        return { success: true };
    } catch (err) {
        toast.error('Error al descargar CDR');
        return { success: false };
    }
};

export const handleAnularDocumento = async (documentoId, motivo) => {
    try {
        if (!motivo || motivo.trim().length < 10) {
            toast.error('El motivo debe tener al menos 10 caracteres');
            return { success: false };
        }

        const confirmed = window.confirm('¿Está seguro de anular este documento?');
        if (!confirmed) return { success: false };

        toast.info('Anulando documento...');
        await ventasService.anular(documentoId, motivo);

        toast.success('Documento anulado exitosamente');
        return { success: true };
    } catch (err) {
        toast.error(err.data?.message || 'Error al anular documento');
        return { success: false };
    }
};

export const prepararDatosVenta = (formData, items, desglose) => {
    return {
        tipoComprobante: formData.tipoComprobante,
        serie: formData.serie,
        fechaEmision: formData.fechaEmision,
        fechaVencimiento: formData.fechaVencimiento,
        cliente: {
            tipoDocumento: formData.cliente.tipoDocumento,
            documento: formData.cliente.documento,
            razonSocial: formData.cliente.razonSocial,
            direccion: formData.cliente.direccion
        },
        items: items.map(item => ({
            codigo: item.codigo,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            valorVenta: item.valorVenta,
            igv: item.igv,
            total: item.total
        })),
        totales: {
            subtotal: desglose.subtotal,
            igv: desglose.igv,
            total: desglose.total,
            descuento: desglose.descuento || 0
        },
        placa: formData.placa,
        ordenCompra: formData.ordenCompra,
        observaciones: formData.observaciones,
        condicionPago: formData.condicionPago
    };
};