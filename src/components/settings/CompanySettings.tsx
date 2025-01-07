import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { Edit2 } from 'lucide-react';
import { CompanyForm } from './CompanyForm';

export function CompanySettings() {
  const company = useLiveQuery(() =>
    db.companies.toArray().then((companies) => companies[0])
  );
  const [showForm, setShowForm] = useState(false);

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>Company Information</h2>
        <button
          onClick={() => setShowForm(true)}
          className='text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50'
        >
          <Edit2 className='w-4 h-4' />
        </button>
      </div>

      <div className='space-y-4'>
        {company?.image && (
          <div className='flex justify-center'>
            <img
              src={company.image}
              alt='Company logo'
              className='h-32 object-contain'
            />
          </div>
        )}

        <div className='grid grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-500'>
              Company Name
            </label>
            <p className='mt-1 text-lg'>{company?.name || '-'}</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-500'>
              CUIT
            </label>
            <p className='mt-1 text-lg'>{company?.cuit || '-'}</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-500'>
              Address
            </label>
            <p className='mt-1 text-lg'>{company?.address || '-'}</p>
          </div>
        </div>
      </div>

      {showForm && (
        <CompanyForm company={company} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
