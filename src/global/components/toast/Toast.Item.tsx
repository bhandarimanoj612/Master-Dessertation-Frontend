import React, { useCallback, useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { IToast } from "../../interface/toast.interface";
import { useToastStore } from "../../store/toast.store";

const DEFAULT_DURATION = 4000;
const TOAST_EXIT_ANIMATION_DURATION = 280;

const config = {
  success: {
    icon: <CheckCircleOutlineIcon fontSize="small" />,
    containerClass:
      "bg-green-50 dark:bg-green-950 border-green-500 text-green-800 dark:text-green-200",
    iconClass: "text-green-500",
    progressClass: "bg-green-500",
    label: "Success",
  },
  error: {
    icon: <ErrorOutlineIcon fontSize="small" />,
    containerClass:
      "bg-red-50 dark:bg-red-950 border-red-500 text-red-800 dark:text-red-200",
    iconClass: "text-red-500",
    progressClass: "bg-red-500",
    label: "Error",
  },
  warning: {
    icon: <WarningAmberIcon fontSize="small" />,
    containerClass:
      "bg-yellow-50 dark:bg-yellow-950 border-yellow-500 text-yellow-800 dark:text-yellow-200",
    iconClass: "text-yellow-500",
    progressClass: "bg-yellow-500",
    label: "Warning",
  },
  info: {
    icon: <InfoOutlinedIcon fontSize="small" />,
    containerClass:
      "bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-800 dark:text-blue-200",
    iconClass: "text-blue-500",
    progressClass: "bg-blue-500",
    label: "Info",
  },
};

interface ToastItemProps {
  toast: IToast;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);
  const [exiting, setExiting] = useState(false);
  const duration = toast.persistent ? undefined : (toast.duration ?? DEFAULT_DURATION);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => removeToast(toast.id), TOAST_EXIT_ANIMATION_DURATION);
  }, [removeToast, toast.id]);

  useEffect(() => {
    if (duration == null) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  const { icon, containerClass, iconClass, progressClass, label } = config[toast.type];

  return (
    <div
      className={`relative flex items-start gap-3 w-80 max-w-xs rounded-lg border-l-4 shadow-lg px-4 py-3 mb-2 overflow-hidden
        ${containerClass}
        ${exiting ? "toast-exit" : "toast-enter"}`}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      <span className={`mt-0.5 shrink-0 ${iconClass}`}>{icon}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">
          {toast.title ?? label}
        </p>
        <p className="text-xs mt-0.5 opacity-90 break-words">{toast.message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className={`shrink-0 mt-0.5 opacity-60 hover:opacity-100 transition-opacity ${iconClass}`}
      >
        <CloseIcon fontSize="small" />
      </button>

      {/* Progress bar */}
      {duration != null && (
        <div
          className={`absolute bottom-0 left-0 h-0.5 ${progressClass}`}
          style={{
            animation: `progress-shrink ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
};

export default ToastItem;
