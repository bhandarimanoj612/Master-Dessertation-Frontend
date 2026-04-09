import {
  AlertCircle,
  BadgeDollarSign,
  Calendar,
  CheckCircle,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  XCircle,
} from "lucide-react";
import type { UiAppointmentStatus } from "../interface";

export const statusOptions: {
  value: UiAppointmentStatus;
  label: string;
  color: string;
  icon: any;
}[] = [
  {
    value: "requested",
    label: "Requested",
    color: "text-sky-700 bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300",
    icon: Calendar,
  },
  {
    value: "estimate-sent",
    label: "Estimate Sent",
    color: "text-amber-700 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300",
    icon: BadgeDollarSign,
  },
  {
    value: "customer-confirmed",
    label: "Customer Confirmed",
    color: "text-indigo-700 bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300",
    icon: ClipboardCheck,
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "text-green-700 bg-green-100 dark:bg-green-950/40 dark:text-green-300",
    icon: CheckCircle,
  },
  {
    value: "in-progress",
    label: "In Progress",
    color: "text-orange-700 bg-orange-100 dark:bg-orange-950/40 dark:text-orange-300",
    icon: AlertCircle,
  },
  {
    value: "completed",
    label: "Ready / Completed",
    color: "text-purple-700 bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300",
    icon: Clock3,
  },
  {
    value: "paid",
    label: "Paid",
    color: "text-emerald-700 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300",
    icon: CircleDollarSign,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "text-red-700 bg-red-100 dark:bg-red-950/40 dark:text-red-300",
    icon: XCircle,
  },
];

export function getStatusInfo(status: UiAppointmentStatus) {
  return statusOptions.find((item) => item.value === status) || statusOptions[0];
}
