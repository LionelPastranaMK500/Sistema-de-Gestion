/**
 * Espejo de: studios.tkoh.billing.dto.simple.DireccionDto
 */
export interface DireccionDto {
  id: number;
  direccionAdicional: string;
  descripcion: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.DireccionCreateDto
 */
export interface DireccionCreateDto {
  direccionAdicional: string;
  descripcion: string;
}

// Puedes agregar UbigeoDto aquí o en un archivo 'maestras.ts' si lo usas en otros lados
export interface UbigeoDto {
  ubigeoId: number;
  departamento: string;
  provincia: string;
  distrito: string;
  codigoUbigeo: string;
}
