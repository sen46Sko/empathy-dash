"use client";

import "react-toastify/dist/ReactToastify.css";
import '../styles/global.css';
import { ToastContainer } from "react-toastify";
import React from 'react';

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  
  return (
    <>
      {children}
      <ToastContainer
        autoClose={4000}
        closeOnClick
        draggable={false}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        position="bottom-right"
        rtl={false}
        theme={'light'}
      />
    </>
  );
}
