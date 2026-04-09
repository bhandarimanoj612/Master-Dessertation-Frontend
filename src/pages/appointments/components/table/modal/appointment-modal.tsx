// import React from "react";
// import { useAppointmentModal } from "./store";
// import { IGlobalAppointment } from "../../../interface";
// import { IAppointmentModal } from "./interface";
// import { statusOptions, technicians } from "../dummy";
// import { useGlobalAppoinmentStore } from "../../../store";
// import { Edit, Mail, Phone, X } from "lucide-react";

// const AppointmentModal = () => {
//   const modalType = useAppointmentModal(
//     (state: IAppointmentModal) => state.modalType
//   );
//   const setModalType = useAppointmentModal(
//     (state: IAppointmentModal) => state.setModalType
//   );

//   const showModal = useAppointmentModal(
//     (state: IAppointmentModal) => state.showModal
//   );
//   const setShowModal = useAppointmentModal(
//     (state: IAppointmentModal) => state.setShowModal
//   );
//   const selectedAppointment = useAppointmentModal(
//     (state: IAppointmentModal) => state.selectedAppointment
//   );
//   const setSelectedAppointment = useAppointmentModal(
//     (state: IAppointmentModal) => state.setSelectedAppointment
//   );

//   const formData = useGlobalAppoinmentStore(
//     (state: IGlobalAppointment) => state.formData
//   );

//   const setFormData = useGlobalAppoinmentStore(
//     (state: IGlobalAppointment) => state.setFilterDate
//   );

//   const appointments = useGlobalAppoinmentStore(
//     (state: IGlobalAppointment) => state.appointments
//   );

//   const setAppointments = useGlobalAppoinmentStore(
//     (state: IGlobalAppointment) => state.setAppointments
//   );

//   const openViewModal = (appointment: any) => {
//     setSelectedAppointment(appointment);
//     setModalType("view");
//     setShowModal(true);
//   };

//   const openEditModal = (appointment: any) => {
//     setSelectedAppointment(appointment);
//     setFormData({ ...appointment });
//     setModalType("edit");
//     setShowModal(true);
//   };

//   const deleteAppointment = (id: any) => {
//     if (window.confirm("Are you sure you want to delete this appointment?")) {
//       setAppointments(
//         appointments.filter((appointment: any) => appointment.id !== id)
//       );
//     }
//   };

//   const getStatusInfo = (status) => {
//     return (
//       statusOptions.find((option) => option.value === status) ||
//       statusOptions[0]
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (modalType === "create") {
//       const newAppointment = {
//         ...formData,
//         id: Math.max(...appointments.map((a) => a.id)) + 1,
//         status: "scheduled",
//         createdAt: new Date().toISOString(),
//       };
//       setAppointments([...appointments, newAppointment]);
//     } else if (modalType === "edit") {
//       setAppointments(
//         appointments.map((appointment: any) =>
//           appointment.id === selectedAppointment.id
//             ? { ...appointment, ...formData }
//             : appointment
//         )
//       );
//     }

//     setShowModal(false);
//     resetForm();
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//       <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white dark:bg-neutral-800">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-300">
//             {modalType === "create" && "Create New Appointment"}
//             {modalType === "edit" && "Edit Appointment"}
//             {modalType === "view" && "Appointment Details"}
//           </h3>
//           <button
//             onClick={() => setShowModal(false)}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {modalType === "view" && selectedAppointment && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400">
//                   Customer Name
//                 </label>
//                 <p className="mt-1 text-sm text-gray-900 dark:text-neutral-400">
//                   {selectedAppointment.customerName}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400 ">
//                   Phone Number
//                 </label>
//                 <p className="mt-1 text-sm text-gray-900 dark:text-neutral-400 flex items-center gap-2">
//                   <Phone size={16} />
//                   {selectedAppointment.phone}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400">
//                   Email
//                 </label>
//                 <p className="mt-1 text-sm text-gray-900 dark:text-neutral-400 flex items-center gap-2">
//                   <Mail size={16} />
//                   {selectedAppointment.email}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400">
//                   Device
//                 </label>
//                 <p className="mt-1 text-sm text-gray-900 dark:text-neutral-400">
//                   {selectedAppointment.deviceType} -{" "}
//                   {selectedAppointment.deviceModel}
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400">
//                   Date & Time
//                 </label>
//                 <p className="mt-1 text-sm text-gray-900 dark:text-neutral-400">
//                   {selectedAppointment.appointmentDate} at
//                   {selectedAppointment.appointmentTime}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400">
//                   Status
//                 </label>
//                 <p className="mt-1">
//                   <span
//                     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(selectedAppointment.status).color}`}
//                   >
//                     {getStatusInfo(selectedAppointment.status).label}
//                   </span>
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400">
//                   Assigned Technician
//                 </label>
//                 <p className="mt-1 text-sm text-gray-900 dark:text-neutral-400">
//                   {selectedAppointment.assignedTechnician || "Unassigned"}
//                 </p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400">
//                   Estimated Cost
//                 </label>
//                 <p className="mt-1 text-sm text-gray-900 dark:text-neutral-400">
//                   {selectedAppointment.estimatedCost}
//                 </p>
//               </div>
//             </div>

//             <div className="col-span-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400">
//                 Issue Description
//               </label>
//               <p className="mt-1 text-sm text-gray-900 dark:text-neutral-400">
//                 {selectedAppointment.issueDescription}
//               </p>
//             </div>

//             <div className="col-span-2">
//               <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400">
//                 Notes
//               </label>
//               <p className="mt-1 text-sm text-gray-900 dark:text-neutral-400">
//                 {selectedAppointment.notes || "No notes available"}
//               </p>
//             </div>

//             <div className="col-span-2 flex gap-2 pt-4">
//               <button
//                 onClick={() => openEditModal(selectedAppointment)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
//               >
//                 <Edit size={16} />
//                 Edit Appointment
//               </button>
//               <select
//                 value={selectedAppointment.status}
//                 onChange={(e) => {
//                   updateStatus(selectedAppointment.id, e.target.value);
//                   setSelectedAppointment({
//                     ...selectedAppointment,
//                     status: e.target.value,
//                   });
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//               >
//                 {statusOptions.map((status) => (
//                   <option key={status.value} value={status.value}>
//                     {status.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         )}

//         {(modalType === "create" || modalType === "edit") && (
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Customer Name *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.customerName}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       customerName: e.target.value,
//                     })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:bg-neutral-500  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   required
//                   value={formData.phone}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-neutral-500 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  dark:bg-neutral-500 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Device Type *
//                 </label>
//                 <select
//                   required
//                   value={formData.deviceType}
//                   onChange={(e) =>
//                     setFormData({ ...formData, deviceType: e.target.value })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select Device Type</option>
//                   <option value="Mobile">Mobile Phone</option>
//                   <option value="Laptop">Laptop</option>
//                   <option value="TV">Television</option>
//                   <option value="Tablet">Tablet</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Device Model *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.deviceModel}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       deviceModel: e.target.value,
//                     })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Appointment Date *
//                 </label>
//                 <input
//                   type="date"
//                   required
//                   value={formData.appointmentDate}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       appointmentDate: e.target.value,
//                     })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Time *
//                 </label>
//                 <input
//                   type="time"
//                   required
//                   value={formData.appointmentTime}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       appointmentTime: e.target.value,
//                     })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Priority
//                 </label>
//                 <select
//                   value={formData.priority}
//                   onChange={(e) =>
//                     setFormData({ ...formData, priority: e.target.value })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Assigned Technician
//                 </label>
//                 <select
//                   value={formData.assignedTechnician}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       assignedTechnician: e.target.value,
//                     })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select Technician</option>
//                   {technicians.map((tech) => (
//                     <option key={tech} value={tech}>
//                       {tech}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Estimated Cost
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.estimatedCost}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       estimatedCost: e.target.value,
//                     })
//                   }
//                   placeholder="Rs. 5,000"
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Issue Description *
//                 </label>
//                 <textarea
//                   required
//                   rows={3}
//                   value={formData.issueDescription}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       issueDescription: e.target.value,
//                     })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Describe the issue with the device..."
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
//                   Notes
//                 </label>
//                 <textarea
//                   rows={2}
//                   value={formData.notes}
//                   onChange={(e) =>
//                     setFormData({ ...formData, notes: e.target.value })
//                   }
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Additional notes or special instructions..."
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3 mt-6">
//               <button
//                 type="button"
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-neutral-500 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-700"
//               >
//                 {modalType === "create"
//                   ? "Create Appointment"
//                   : "Update Appointment"}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppointmentModal;
