import { useToastStore } from "../store/toast.store";
import { ToastType } from "../interface/toast.interface";

const show = (
  type: ToastType,
  message: string,
  title?: string,
  duration?: number,
  persistent?: boolean
) => {
  useToastStore.getState().addToast({ type, message, title, duration, persistent });
};

export const toast = {
  success: (message: string, title?: string, duration?: number) =>
    show("success", message, title, duration),

  error: (message: string, title?: string, duration?: number, persistent?: boolean) =>
    show("error", message, title, duration, persistent),

  warning: (message: string, title?: string, duration?: number) =>
    show("warning", message, title, duration),

  info: (message: string, title?: string, duration?: number) =>
    show("info", message, title, duration),
};
