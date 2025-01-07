import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/shared/ToastContainer';
import { Toast, ToastType } from '../components/shared/Toast';
import { ConfirmToast } from '../components/shared/ConfirmToast';

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  showConfirmToast: (title: string, message: React.ReactNode) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmToast, setConfirmToast] = useState<{
    title: string;
    message: React.ReactNode;
    resolve: (value: boolean) => void;
  } | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const showConfirmToast = useCallback((title: string, message: React.ReactNode) => {
    return new Promise<boolean>((resolve) => {
      setConfirmToast({ title, message, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmToast) {
      confirmToast.resolve(true);
      setConfirmToast(null);
    }
  }, [confirmToast]);

  const handleCancel = useCallback(() => {
    if (confirmToast) {
      confirmToast.resolve(false);
      setConfirmToast(null);
    }
  }, [confirmToast]);

  return (
    <ToastContext.Provider value={{ showToast, showConfirmToast }}>
      {children}
      {confirmToast && (
        <ConfirmToast
          title={confirmToast.title}
          message={confirmToast.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}