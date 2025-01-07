import { useEffect, useRef } from 'react';

interface BarcodeScannerOptions {
  onBarcode: (barcode: string) => void;
  enabled?: boolean;
  timeout?: number;
}

export function useBarcodeScanner({ onBarcode, enabled = true, timeout = 50 }: BarcodeScannerOptions) {
  const barcodeBuffer = useRef('');
  const lastKeyTime = useRef(Date.now());

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime.current;
      
      if (timeDiff > timeout) {
        barcodeBuffer.current = '';
      }
      
      lastKeyTime.current = currentTime;
      
      if (/[\d]/.test(e.key)) {
        barcodeBuffer.current += e.key;
      } else if (e.key === 'Enter' && barcodeBuffer.current.length > 0) {
        e.preventDefault();
        const barcode = barcodeBuffer.current;
        barcodeBuffer.current = '';
        onBarcode(barcode);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [enabled, timeout, onBarcode]);
}