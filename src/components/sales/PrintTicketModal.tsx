import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { Sale } from '../../db/schema';
import { SaleTicket } from './SaleTicket';
import { useReactToPrint } from 'react-to-print';

interface PrintTicketModalProps {
  sale: Sale;
  onClose: () => void;
}

export function PrintTicketModal({ sale, onClose }: PrintTicketModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => ticketRef.current,
    pageStyle: `
      @page { 
        size: 80mm auto;
        margin: 0;
      }
      @media print {
        body { 
          margin: 0;
          padding: 0;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl font-semibold">Print Sale Ticket</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          <div ref={ticketRef} className="print-content">
            <SaleTicket sale={sale} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
}