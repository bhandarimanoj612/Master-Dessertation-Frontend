import { create } from "zustand";
import { AppointmentState } from "./interface";

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  loading: false,
  error: "",

  searchTerm: "",
  filterStatus: "all",
  filterDate: "",

  setAppointments: (appointments) => set({ appointments }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setFilterStatus: (filterStatus) => set({ filterStatus }),
  setFilterDate: (filterDate) => set({ filterDate }),
  resetFilters: () =>
    set({
      searchTerm: "",
      filterStatus: "all",
      filterDate: "",
    }),
}));