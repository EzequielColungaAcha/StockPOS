import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { Client } from '../../db/schema';
import { Search, UserPlus } from 'lucide-react';
import { QuickClientForm } from './QuickClientForm';
import { normalizeString } from '../../utils/string';

interface ClientSelectorProps {
  selectedClient?: Client;
  onSelect: (client?: Client) => void;
}

export function ClientSelector({
  selectedClient,
  onSelect,
}: ClientSelectorProps) {
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);

  const clients = useLiveQuery(async () => {
    if (!search) return [];

    // Check if search contains only numbers (DNI search)
    const isNumericSearch = /^\d+$/.test(search);
    // Check if search contains only letters (name search)
    const isLetterSearch = /^[a-zA-ZÀ-ÿ\s]+$/.test(search);

    if (isNumericSearch) {
      return db.clients
        .filter((client) => client.dni?.includes(search) || false)
        .limit(5)
        .toArray();
    } else if (isLetterSearch) {
      const normalizedSearch = normalizeString(search);
      return db.clients
        .filter((client) =>
          normalizeString(client.name).includes(normalizedSearch)
        )
        .limit(5)
        .toArray();
    }

    // If mixed characters, return empty array to force QuickClientForm
    return [];
  }, [search]);

  const handleQuickAdd = () => {
    setShowQuickForm(true);
    setShowResults(false);
  };

  const handleQuickSave = (client: Client) => {
    onSelect(client);
    setSearch(client.name);
    setShowQuickForm(false);
  };

  // Determine initial form data based on search type
  const getInitialFormData = () => {
    const isNumericSearch = /^\d+$/.test(search);
    const isLetterSearch = /^[a-zA-Z\s]+$/.test(search);

    if (isNumericSearch) {
      return { name: '', dni: search };
    } else if (isLetterSearch) {
      return { name: search, dni: '' };
    }
    return { name: '', dni: '' };
  };

  useEffect(() => {
    if (search.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [search]);

  useEffect(() => {
    setSearch('');
  }, [selectedClient]);

  return (
    <div className='bg-white p-4 rounded-lg shadow'>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        Client
      </label>
      <div className='relative'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <input
            type='text'
            placeholder='Search clients...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className='w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {showResults && (
          <div className='absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border'>
            {clients && clients.length > 0
              ? clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      onSelect(client);
                      setSearch(client.name);
                      setShowResults(false);
                    }}
                    className='w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none'
                  >
                    <div className='font-medium'>{client.name}</div>
                    {client.dni && (
                      <div className='text-sm text-gray-500'>
                        DNI: {client.dni}
                      </div>
                    )}
                  </button>
                ))
              : !!search && (
                  <button
                    onClick={handleQuickAdd}
                    className='w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none flex items-center gap-2 text-blue-600'
                  >
                    <UserPlus className='w-4 h-4' />
                    <span>Add new client</span>
                  </button>
                )}
          </div>
        )}
      </div>

      {selectedClient && (
        <div className='mt-2 flex justify-between items-center p-2 bg-gray-50 rounded'>
          <div>
            <div className='font-medium'>{selectedClient.name}</div>
            {selectedClient.dni && (
              <div className='text-sm text-gray-500'>
                DNI: {selectedClient.dni}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              onSelect(undefined);
            }}
            className='text-sm text-red-600 hover:text-red-800'
          >
            Remove
          </button>
        </div>
      )}

      {showQuickForm && (
        <QuickClientForm
          initialData={getInitialFormData()}
          onSave={handleQuickSave}
          onClose={() => setShowQuickForm(false)}
        />
      )}
    </div>
  );
}
