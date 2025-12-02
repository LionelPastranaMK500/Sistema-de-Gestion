import { z } from "zod";
import { VentaState } from "@/types/stores";

// --- HELPER: El adaptador seguro ---
const validateWithZod = (schema: any, data: any): Record<string, string> => {
  const result = schema.safeParse(data);

  if (result.success) {
    return {};
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue: any) => {
    const key = issue.path[0];
    if (key) {
      errors[key] = issue.message;
    }
  });

  return errors;
};

// --- SCHEMAS DE ZOD ---

const ventaSchema = z.object({
  clienteVenta: z
    .object({
      numeroRuc: z.string().min(1, "Error datos cliente"),
      nombreRazonSocial: z.string().min(1, "Error datos cliente"),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Debes seleccionar un cliente para realizar la venta.",
    }),

  productosVenta: z
    .array(z.any())
    .min(1, "El carrito de ventas está vacío. Agrega productos."),

  condicionPago: z.object({
    condicion: z.string().min(1, "La condición de pago es obligatoria."),
  }),

  placa: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return /^[A-Z0-9]{3}-?[0-9]{3,4}$/i.test(val);
      },
      {
        message: "Formato de placa inválido (ej: ABC-123)",
      }
    ),

  guiasRemision: z
    .array(
      z.object({
        serie: z.string().min(1, "Serie requerida"),
        numero: z.string().min(1, "Número requerido"),
      })
    )
    .optional(),

  ordenCompra: z.string().optional(),

  observaciones: z.string().optional(),
});

const agregarProductoSchema = z.object({
  cantidad: z.coerce.number().gt(0, "La cantidad debe ser mayor a 0"),

  stockDisponible: z.number().optional(),
});

// --- FUNCIONES EXPORTABLES ---

export const validarVenta = (state: Partial<VentaState>) => {
  return validateWithZod(ventaSchema, state);
};

export const validarCantidadProducto = (cantidad: number, stock?: number) => {
  return validateWithZod(agregarProductoSchema, {
    cantidad,
    stockDisponible: stock,
  });
};
