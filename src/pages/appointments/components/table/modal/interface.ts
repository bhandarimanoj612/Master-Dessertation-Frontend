export interface IAppointmentModal {
  modalType: string;
  setModalType: (modalType: string) => void;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  selectedAppointment: null;
  setSelectedAppointment: (selectedAppointment: null) => void;
}
