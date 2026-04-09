import React from "react";
import ToastContainer from "./Toast.Container";

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

export default ToastProvider;
