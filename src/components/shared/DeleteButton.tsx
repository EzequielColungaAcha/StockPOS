import React from 'react';
import { Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { formatDeleteMessage } from './DeleteConfirmation';

interface DeleteButtonProps {
  onDelete: () => void;
  type: 'product' | 'client' | 'provider' | 'payment-method';
  data: Record<string, any>;
}

export function DeleteButton({ onDelete, type, data }: DeleteButtonProps) {
  const { showConfirmToast } = useToast();

  const handleClick = async () => {
    const { title, details } = formatDeleteMessage({ type, data });
    const shouldDelete = await showConfirmToast(title, details);
    if (shouldDelete) {
      onDelete();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}