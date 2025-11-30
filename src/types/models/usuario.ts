import { EstadoUsuario } from "./comunes";

/**
 * Modelo Maestro de Usuario (Lectura)
 * Refleja UsuarioDetailDto.java
 */
export interface Usuario {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  ruc: string;
  razonSocial: string;
  usuarioSOL: string; // Cuidado al mostrar esto en UI
  contraseniaSOL: string; // Cuidado al mostrar esto en UI
  nombreComercial: string;
  aliasVentas: string;
  direccionFiscal: string;
  estadousuario: EstadoUsuario;
  ultimaSesion: string; // LocalDateTime llega como ISO string
}

/**
 * Payload para Crear Usuario
 * Refleja UsuarioCreateDto.java
 */
export interface UsuarioPayload extends Omit<Usuario, "id" | "ultimaSesion"> {
  contrasenia: string; // Solo se envía al crear/editar, no se lee
  ultimaSesion?: Date | string;
  avaUser?: any; // AvatarUsuario (puedes definir una interfaz si tienes el DTO)
}
