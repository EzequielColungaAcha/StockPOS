import React from 'react';
import { formatPrice } from '../../utils/format';
import { calculateFinalPrice } from '../../utils/pricing';

interface DeleteInfo {
  type: 'product' | 'client' | 'provider' | 'payment-method';
  data: Record<string, any>;
}

export function formatDeleteMessage(info: DeleteInfo): {
  title: string;
  details: React.ReactNode;
} {
  switch (info.type) {
    case 'product':
      return {
        title: 'Delete Product',
        details: (
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Name:</span> {info.data.name}</p>
            <p><span className="font-medium">Barcode:</span> {info.data.barcode}</p>
            <p><span className="font-medium">Base Price:</span> {formatPrice(info.data.price)}</p>
            <p><span className="font-medium">Percentage:</span> {formatPrice(info.data.percentage)}</p>
            <p><span className="font-medium">Final Price:</span> {formatPrice(calculateFinalPrice(info.data.price, info.data.percentage))}</p>
            <p><span className="font-medium">Stock:</span> {info.data.stock} units</p>
          </div>
        ),
      };

    case 'client':
      return {
        title: 'Delete Client',
        details: (
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Name:</span> {info.data.name}</p>
            {info.data.dni && <p><span className="font-medium">DNI:</span> {info.data.dni}</p>}
            {info.data.address && <p><span className="font-medium">Address:</span> {info.data.address}</p>}
          </div>
        ),
      };

    case 'provider':
      return {
        title: 'Delete Provider',
        details: (
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">Name:</span> {info.data.name}</p>
            {info.data.cuit && <p><span className="font-medium">CUIT:</span> {info.data.cuit}</p>}
            {info.data.phone && <p><span className="font-medium">Phone:</span> {info.data.phone}</p>}
            {info.data.mail && <p><span className="font-medium">Email:</span> {info.data.mail}</p>}
          </div>
        ),
      };

    case 'payment-method':
  return {
    title: 'Delete Payment Method',
    details: (
      <div className="space-y-2 text-gray-600">
        <p><span className="font-medium">Name:</span> {info.data.name}</p>
        {info.data.charge > 0 && <p><span className="font-medium">Charge:</span> {info.data.charge}%</p>}
        {info.data.discount > 0 && <p><span className="font-medium">Discount:</span> {info.data.discount}%</p>}
        {info.data.installments.length > 0 && (
          <>
            <p><span className="font-medium">Installments:</span></p>
            <ul className="flex flex-col justify-end">
              {info.data.installments.map((installment, index) => (
                <li key={index} className="ml-10">x{installment.quantity} (charge: {installment.charge}%)</li>
              ))}
            </ul>
          </>
        )}
      </div>
    ),
  };

    default:
      return {
        title: 'Delete Item',
        details: <p>Are you sure you want to delete this item?</p>,
      };
  }
}