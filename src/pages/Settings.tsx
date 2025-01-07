import React from 'react';
import { CompanySettings } from '../components/settings/CompanySettings';
import { PaymentSettings } from '../components/settings/PaymentSettings';

export function Settings() {
  return (
    <div className='mx-auto space-y-6'>
      <h1 className='text-2xl font-bold mb-6'>Settings</h1>
      <CompanySettings />
      <PaymentSettings />
    </div>
  );
}
