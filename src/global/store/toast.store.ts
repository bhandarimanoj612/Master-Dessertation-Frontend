import { create } from "zustand";
import { IToast, IToastStore } from "../interface/toast.interface";

export const useToastStore = create<IToastStore>((set) => ({
  toasts: [],

  addToast: (toast: Omit<IToast, "id">) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },

  removeToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));
