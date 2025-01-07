import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { Provider } from '../../db/schema';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ProviderFormProps {
  provider?: Provider;
  onClose: () => void;
}

export function ProviderForm({ provider, onClose }: ProviderFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    mail: '',
    cuit: '',
  });

  useEffect(() => {
    if (provider) {
      setFormData({
        name: provider.name,
        address: provider.address || '',
        phone: provider.phone || '',
        mail: provider.mail || '',
        cuit: provider.cuit || '',
      });
    }
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      if (provider?.id) {
        await db.providers.update(provider.id, data);
        showToast('Provider updated successfully', 'success');
      } else {
        await db.providers.add({
          ...data,
          createdAt: new Date().toISOString(),
        });
        showToast('Provider created successfully', 'success');
      }

      onClose();
    } catch (error) {
      showToast(`Failed to save provider: ${error}`, 'error');
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>
            {provider ? 'Edit Provider' : 'Add New Provider'}
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
              CUIT
            </label>
            <input
              type='text'
              value={formData.cuit}
              onChange={(e) =>
                setFormData({ ...formData, cuit: e.target.value })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Address
            </label>
            <input
              type='text'
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Phone
            </label>
            <input
              type='tel'
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              value={formData.mail}
              onChange={(e) =>
                setFormData({ ...formData, mail: e.target.value })
              }
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
            />
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
