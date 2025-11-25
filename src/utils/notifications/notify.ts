import { toast } from "react-toastify";

export const notifySuccess = (msg, config = {}) =>
  toast.success(msg, { autoClose: 1500, ...config });

export const notifyError = (msg, config = {}) =>
  toast.error(msg, { autoClose: 1500, ...config });

export const notifyInfo = (msg, config = {}) =>
  toast.info(msg, { autoClose: false, ...config });
