/// <reference types="vite/client" />
import { AxiosRequestConfig } from "axios";

// Ahora RequestOptions extiende la configuración de Axios en lugar de Fetch
export interface RequestOptions extends AxiosRequestConfig {}

export interface ApiError {
  status: number;
  statusText: string;
  data: any;
}
