import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { PaymentMethod, Installment } from '../../db/schema';

interface PaymentMethodSelectorProps {
  selectedMethod?: PaymentMethod;
  onSelect: (method: PaymentMethod, installment?: Installment) => void;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  const paymentMethods = useLiveQuery(() => db.paymentMethods.toArray());
  const [selectedInstallment, setSelectedInstallment] = useState<Installment>();

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedInstallment(undefined);
    onSelect(method);
  };

  const handleInstallmentChange = (installment: Installment) => {
    setSelectedInstallment(installment);
    onSelect(selectedMethod!, installment);
  };

  return (
    <div className='space-y-4 bg-white p-4 rounded-lg shadow'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Payment Method
        </label>
        <select
          value={selectedMethod?.id || ''}
          onChange={(e) => {
            const method = paymentMethods?.find(
              (m) => m.id === Number(e.target.value)
            );
            if (method) handleMethodChange(method);
          }}
          className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
        >
          <option value=''>Select payment method</option>
          {paymentMethods?.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
              {method.charge > 0 && ` (+${method.charge}%)`}
              {method.discount > 0 && ` (-${method.discount}%)`}
            </option>
          ))}
        </select>
      </div>

      {selectedMethod && selectedMethod?.installments?.length > 0 && (
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Installments
          </label>
          <select
            value={selectedInstallment?.quantity || ''}
            onChange={(e) => {
              const installment = selectedMethod.installments.find(
                (i) => i.quantity === Number(e.target.value)
              );
              if (installment) handleInstallmentChange(installment);
            }}
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
          >
            <option value=''>Select installments</option>
            {selectedMethod.installments.map((inst) => (
              <option key={inst.quantity} value={inst.quantity}>
                {inst.quantity}x {inst.charge > 0 ? `(+${inst.charge}%)` : ''}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
