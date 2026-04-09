import AppointmentHeader from "./components/header/appoinment-header";
import AppointmentModal from "./components/modal/appointment-modal";
import AppointmentStats from "./components/stat/appointment-stats";
import AppointmentList from "./components/table/appointment-list";


const Appointments = () => {
  // This is the main appointments page. It changes a little depending on who is logged in.
  return (
    <div className="p-6 max-sm:p-4">
      <AppointmentHeader />
      <AppointmentStats />
      <AppointmentList />
      <AppointmentModal />
    </div>
  );
};

export default Appointments;