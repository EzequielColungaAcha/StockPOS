import React, { useEffect } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ConfirmToastProps {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmToast({ title, message, onConfirm, onCancel }: ConfirmToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onCancel();
    }, 15000);

    return () => clearTimeout(timer);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <div className="mb-6">
          {message}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <span className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancel
            </span>
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
          >
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Confirm
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}