import React from 'react';

interface SaleStatusBadgeProps {
  status: 'completed' | 'pending' | 'canceled';
}

export function SaleStatusBadge({ status }: SaleStatusBadgeProps) {
  const styles = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    canceled: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}