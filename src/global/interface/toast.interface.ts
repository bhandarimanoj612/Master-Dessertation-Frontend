export type ToastType = "success" | "error" | "warning" | "info";

export interface IToast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  persistent?: boolean;
}

export interface IToastStore {
  toasts: IToast[];
  addToast: (toast: Omit<IToast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}
