import React, { useRef } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { exportDatabase, importDatabase, clearDatabase } from '../db';
import { useToast } from '../context/ToastContext';

export function Backup() {
  const { showToast, showConfirmToast } = useToast();

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = async () => {
    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}-${month}-${year}_${hours}-${minutes}`;

      const data = await exportDatabase();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Backup_StockPOS_${formattedDate}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Database exported successfully', 'success');
    } catch (error) {
      showToast(`Failed to export database: ${error}`, 'error');
    }
  };

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importDatabase(text);
      showToast('Database imported successfully', 'success');
    } catch (error) {
      showToast(`Failed to import database: ${error}`, 'error');
    }
  };

  const handleClear = async () => {
    const confirmed = await showConfirmToast(
      'Are you sure you want to clear all data?'
    );

    if (confirmed) {
      try {
        await clearDatabase();
        showToast('Database cleared successfully', 'success');
      } catch (error) {
        showToast(`Failed to clear database: ${error}`, 'error');
      }
    }
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Database Backup</h1>

      <div className='flex flex-col gap-5'>
        <div className='p-6 bg-white rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>Export Database</h2>
          <p className='text-gray-600 mb-4'>
            Download a backup of your entire database as a JSON file.
          </p>
          <button
            onClick={handleExport}
            className='flex max-w-4xl items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            <Download className='w-4 h-4' />
            Export
          </button>
        </div>

        <div className='p-6 bg-white rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>Import Database</h2>
          <p className='text-gray-600 mb-4'>
            Restore your database from a backup file.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className='flex max-w-4xl items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
          >
            <Upload className='w-4 h-4' />
            Import
          </button>
          <input
            ref={fileInputRef}
            type='file'
            accept='.json'
            onChange={handleImport}
            className='hidden'
          />
        </div>

        <div className='p-6 bg-white rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>Clear Database</h2>
          <p className='text-gray-600 mb-4'>
            Remove all data from the database. This action cannot be undone!
          </p>
          <button
            onClick={handleClear}
            className='flex max-w-4xl items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
          >
            <Trash2 className='w-4 h-4' />
            Clear Database
          </button>
        </div>
      </div>
    </div>
  );
}
