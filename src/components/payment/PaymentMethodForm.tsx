import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { PaymentMethod, Installment } from '../../db/schema';
import { useToast } from '../../context/ToastContext';

interface PaymentMethodFormProps {
  method?: PaymentMethod;
  onSave: (data: Partial<PaymentMethod>) => Promise<void>;
  onClose: () => void;
}

export function PaymentMethodForm({
  method,
  onSave,
  onClose,
}: PaymentMethodFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    charge: 0,
    discount: 0,
    installments: [] as Installment[],
  });

  useEffect(() => {
    if (method) {
      setFormData({
        name: method.name,
        charge: method.charge,
        discount: method.discount,
        installments: method.installments || [],
      });
    }
  }, [method]);

  const addInstallment = () => {
    setFormData((prev) => ({
      ...prev,
      installments: [
        ...prev.installments,
        { quantity: 1, charge: 0 } as Installment,
      ],
    }));
  };

  const removeInstallment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      installments: prev.installments.filter((_, i) => i !== index),
    }));
  };

  const updateInstallment = (
    index: number,
    field: keyof Installment,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      installments: prev.installments.map((inst, i) =>
        i === index ? { ...inst, [field]: value } : inst
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      showToast(
        method
          ? 'Payment method updated successfully'
          : 'Payment method created successfully',
        'success'
      );
    } catch (error) {
      showToast(`Failed to save payment method: ${error}`, 'error');
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>
            {method ? 'Edit Payment Method' : 'Add Payment Method'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Charge (%)
            </label>
            <input
              type='number'
              value={formData.charge}
              onChange={(e) =>
                setFormData({ ...formData, charge: Number(e.target.value) })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              min='0'
              step='0.01'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Discount (%)
            </label>
            <input
              type='number'
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: Number(e.target.value) })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
              min='0'
              step='0.01'
            />
          </div>

          <div>
            <div className='flex justify-between items-center mb-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Installments
              </label>
              <button
                type='button'
                onClick={addInstallment}
                className='text-blue-600 hover:text-blue-700'
              >
                <Plus className='w-4 h-4' />
              </button>
            </div>

            <div className='space-y-2'>
              {formData.installments.map((inst, index) => (
                <div key={index} className='flex gap-2 items-center'>
                  <input
                    type='number'
                    value={inst.quantity}
                    onChange={(e) =>
                      updateInstallment(
                        index,
                        'quantity',
                        Number(e.target.value)
                      )
                    }
                    className='w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    min='1'
                    placeholder='Qty'
                  />
                  <input
                    type='number'
                    value={inst.charge}
                    onChange={(e) =>
                      updateInstallment(index, 'charge', Number(e.target.value))
                    }
                    className='w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    min='0'
                    step='0.01'
                    placeholder='Charge %'
                  />
                  <button
                    type='button'
                    onClick={() => removeInstallment(index)}
                    className='text-red-600 hover:text-red-700'
                  >
                    <Minus className='w-4 h-4' />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
