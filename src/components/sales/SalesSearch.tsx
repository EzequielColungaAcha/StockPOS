import React, { useRef } from 'react';
import { Search, Barcode } from 'lucide-react';
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner';

interface SalesSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function SalesSearch({ search, onSearchChange }: SalesSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useBarcodeScanner({
    onBarcode: (barcode) => {
      onSearchChange(barcode);
      inputRef.current?.focus();
    },
  });

  return (
    <div className='relative'>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
      <input
        ref={inputRef}
        type='text'
        placeholder='Search by client name, DNI, product name or scan barcode...'
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        autoFocus
        className='w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
        <Barcode className='w-5 h-5 text-gray-400' />
      </div>
    </div>
  );
}
