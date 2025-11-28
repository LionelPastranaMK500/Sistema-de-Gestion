import { toast, ToastOptions } from "react-toastify";

export const notifySuccess = (msg: string, config: ToastOptions = {}) =>
  toast.success(msg, { autoClose: 1500, ...config });

export const notifyError = (msg: string, config: ToastOptions = {}) =>
  toast.error(msg, { autoClose: 1500, ...config });

export const notifyInfo = (msg: string, config: ToastOptions = {}) =>
  toast.info(msg, { autoClose: false, ...config });
