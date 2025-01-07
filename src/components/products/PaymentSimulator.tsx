import React, { useState } from 'react';
import { PaymentMethod, Installment } from '../../db/schema';

interface PaymentSimulatorProps {
  finalPrice: number;
  paymentMethods?: PaymentMethod[];
}

export function PaymentSimulator({
  finalPrice,
  paymentMethods,
}: PaymentSimulatorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>();
  const [selectedInstallment, setSelectedInstallment] = useState<Installment>();

  // Calculate simulated price based on payment method and installment
  const simulatedPrice = selectedMethod
    ? finalPrice * (1 + (selectedMethod.charge - selectedMethod.discount) / 100)
    : finalPrice;

  // Add installment charge if applicable
  const finalSimulatedPrice = selectedInstallment
    ? simulatedPrice * (1 + selectedInstallment.charge / 100)
    : simulatedPrice;

  return (
    <div className='space-y-3'>
      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Simulate Payment Method (not saved)
        </label>
        <select
          value={selectedMethod?.id || ''}
          onChange={(e) => {
            const method = paymentMethods?.find(
              (m) => m.id === Number(e.target.value)
            );
            setSelectedMethod(method);
            setSelectedInstallment(undefined);
          }}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
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
          <label className='block text-sm font-medium text-gray-700'>
            Installments
          </label>
          <select
            value={selectedInstallment?.quantity || ''}
            onChange={(e) => {
              const installment = selectedMethod.installments.find(
                (i) => i.quantity === Number(e.target.value)
              );
              setSelectedInstallment(installment);
            }}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
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

      {selectedMethod && (
        <div className='mt-2 p-3 bg-gray-50 rounded-md space-y-1'>
          <p className='font-medium text-lg'>
            Simulated Price: ${finalSimulatedPrice.toFixed(2)}
          </p>
          <div className='text-sm text-gray-600 space-y-1'>
            <p>Base Final Price: ${finalPrice.toFixed(2)}</p>
            {selectedMethod.charge > 0 && (
              <p>
                Payment Method Charge: +$
                {(simulatedPrice - finalPrice).toFixed(2)} (
                {selectedMethod.charge}%)
              </p>
            )}
            {selectedMethod.discount > 0 && (
              <p className='text-green-600'>
                Discount: -$
                {((finalPrice * selectedMethod.discount) / 100).toFixed(2)} (
                {selectedMethod.discount}%)
              </p>
            )}
            {selectedInstallment && (
              <>
                <p>
                  Installment Charge: +$
                  {(finalSimulatedPrice - simulatedPrice).toFixed(2)} (
                  {selectedInstallment.charge}%)
                </p>
                <p className='mt-2 font-medium'>
                  {selectedInstallment.quantity}x of $
                  {(finalSimulatedPrice / selectedInstallment.quantity).toFixed(
                    2
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
