// =============================================================================
// BARREL FILE (Exporta todo para facilitar importaciones)
// =============================================================================

// 1. Comunes y Configuración
export * from "./comunes";
export * from "./configuracion"; // (Si aún lo usas para otras configs globales)
export * from "./impresion";
export * from "./auth";
export * from "./passwordRecovery";

// 2. Maestras y Catálogos Independientes
export * from "./afectacionIgv";
export * from "./afectacionIsc";
export * from "./moneda";
export * from "./serie";
export * from "./tipoDocumento";
export * from "./tipoDocNota";
export * from "./tipoCliente"; // NUEVO
export * from "./tipoEnvio"; // NUEVO
export * from "./unidadMedida";
export * from "./ubigeo"; // NUEVO
export * from "./direccion";

// 3. Actores Principales
export * from "./usuario";
export * from "./avatarUsuario";
export * from "./cliente";
export * from "./sucursal";
export * from "./almacen";

// 4. Inventario y Logística
export * from "./producto";
export * from "./guia";
export * from "./chofer";
export * from "./vehiculo"; // NUEVO (Reemplaza a transporte)

// 5. Ventas y Documentos
export * from "./ventas"; // (Incluye cabecera, detalles y helpers)
export * from "./documento";
export * from "./reportes"; // NUEVO
