import { create } from "zustand";
import { IAppointmentModal } from "./interface";

export const useAppointmentModal = create<IAppointmentModal>((set) => ({
  modalType: "view",
  setModalType: (modalType: string) => set({ modalType }),
  showModal: false,
  setShowModal: (showModal: boolean) => set({ showModal }),
  selectedAppointment: null,
  setSelectedAppointment: (selectedAppointment: null) =>
    set({ selectedAppointment }),
}));
