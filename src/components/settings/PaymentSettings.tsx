import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { PaymentMethod } from '../../db/schema';
import { Plus, Edit2 } from 'lucide-react';
import { PaymentMethodForm } from '../payment/PaymentMethodForm';
import { DeleteButton } from '../shared/DeleteButton';

export function PaymentSettings() {
  const paymentMethods = useLiveQuery(() => db.paymentMethods.toArray());
  const [showForm, setShowForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | undefined>();

  const handleSave = async (data: Partial<PaymentMethod>) => {
    const methodData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (selectedMethod?.id) {
      await db.paymentMethods.update(selectedMethod.id, methodData);
    } else {
      await db.paymentMethods.add({
        ...methodData,
        createdAt: new Date().toISOString(),
      } as PaymentMethod);
    }
    
    setShowForm(false);
    setSelectedMethod(undefined);
  };

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await db.paymentMethods.delete(id);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Payment Methods</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Method
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods?.map((method) => (
          <div key={method.id} className="p-4 border rounded">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{method.name}</h3>
                <div className="text-sm text-gray-500">
                  {method.charge > 0 && `Charge: ${method.charge}% | `}
                  {method.discount > 0 && `Discount: ${method.discount}%`}
                </div>
                {method.installments?.length > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    Installments: {method.installments.map(i => `${i.quantity}x (+${i.charge}%)`).join(', ')}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
              <button
                onClick={() => handleEdit(method)}
                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {method.id && (
                <DeleteButton
                  onDelete={() => handleDelete(method.id!)}
                  type="payment-method"
                  data={method}
                />
              )}
            </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <PaymentMethodForm
          method={selectedMethod}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setSelectedMethod(undefined);
          }}
        />
      )}
    </div>
  );
}