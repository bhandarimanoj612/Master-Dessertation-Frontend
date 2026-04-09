// import {
//   Activity,
//   Bell,
//   CheckCircle,
//   Clock,
//   DollarSign,
//   Users,
//   Zap,
// } from "lucide-react";
// import React from "react";

// const  = ({ stats, technicians, repairs }) => {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//       <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
//         <div className="flex items-center">
//           <div className="p-3 bg-blue-100 rounded-full">
//             <Activity className="w-6 h-6 text-blue-600" />
//           </div>
//           <div className="ml-4">
//             <div className="text-2xl font-bold text-gray-900">
//               {stats.total}
//             </div>
//             <div className="text-sm text-gray-600">Total Repairs</div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
//         <div className="flex items-center">
//           <div className="p-3 bg-yellow-100 rounded-full">
//             <Clock className="w-6 h-6 text-yellow-600" />
//           </div>
//           <div className="ml-4">
//             <div className="text-2xl font-bold text-gray-900">
//               {stats.pending}
//             </div>
//             <div className="text-sm text-gray-600">Pending</div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
//         <div className="flex items-center">
//           <div className="p-3 bg-green-100 rounded-full">
//             <CheckCircle className="w-6 h-6 text-green-600" />
//           </div>
//           <div className="ml-4">
//             <div className="text-2xl font-bold text-gray-900">
//               {stats.completed}
//             </div>
//             <div className="text-sm text-gray-600">Completed</div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
//         <div className="flex items-center">
//           <div className="p-3 bg-red-100 rounded-full">
//             <Zap className="w-6 h-6 text-red-600" />
//           </div>
//           <div className="ml-4">
//             <div className="text-2xl font-bold text-gray-900">
//               {stats.urgent}
//             </div>
//             <div className="text-sm text-gray-600">Urgent</div>
//           </div>
//         </div>
//       </div>

//       {/* Header */}
//       <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
//         <div className="flex items-center">
//           <div className="text-right">
//             <div className="text-2xl font-bold">
//               NPR {stats.revenue.toLocaleString()}
//             </div>
//             <div className="text-blue-300">Total Revenue</div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-500">
//         <div className="flex items-center">
//           <div className="p-3 bg-gray-100 rounded-full">
//             <DollarSign className="w-6 h-6 text-gray-600" />
//           </div>
//           <div className="ml-4">
//             <div className="text-2xl font-bold text-gray-900">
//               NPR {stats.pendingPayment.toLocaleString()}
//             </div>
//             <div className="text-sm text-gray-600">Pending Payments</div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
//         <div className="flex items-center">
//           <div className="p-3 bg-blue-100 rounded-full">
//             <Users className="w-6 h-6 text-blue-600" />
//           </div>
//           <div className="ml-4">
//             <div className="text-2xl font-bold text-gray-900">
//               {technicians.length - 1} {/* Exclude "All" option */}
//             </div>
//             <div className="text-sm text-gray-600">Technicians</div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-500">
//         <div className="flex items-center">
//           <div className="p-3 bg-gray-100 rounded-full">
//             <Bell className="w-6 h-6 text-gray-600" />
//           </div>
//           <div className="ml-4">
//             <div className="text-2xl font-bold text-gray-900">
//               {repairs.filter((r) => r.status === "On Hold").length}
//             </div>
//             <div className="text-sm text-gray-600">On Hold Repairs</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RepairHeader;
