import { useToastStore } from "../store/toast.store";

export const useToast = () => {
  const { addToast, removeToast, clearToasts, toasts } = useToastStore();

  return {
    toasts,
    success: (message: string, title?: string, duration?: number) =>
      addToast({ type: "success", message, title, duration }),

    error: (
      message: string,
      title?: string,
      duration?: number,
      persistent?: boolean
    ) => addToast({ type: "error", message, title, duration, persistent }),

    warning: (message: string, title?: string, duration?: number) =>
      addToast({ type: "warning", message, title, duration }),

    info: (message: string, title?: string, duration?: number) =>
      addToast({ type: "info", message, title, duration }),

    dismiss: removeToast,
    clear: clearToasts,
  };
};
