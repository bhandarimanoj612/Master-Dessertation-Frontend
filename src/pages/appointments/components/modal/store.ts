import { create } from "zustand";
import { AppointmentModalState } from "../../interface";

export const useAppointmentModalStore = create<AppointmentModalState>((set) => ({
  open: false,
  selectedAppointment: null,
  setOpen: (open) => set({ open }),
  setSelectedAppointment: (selectedAppointment) => set({ selectedAppointment }),
}));