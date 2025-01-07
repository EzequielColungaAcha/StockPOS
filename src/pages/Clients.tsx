import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Client } from '../db/schema';
import { ClientList } from '../components/clients/ClientList';
import { ClientForm } from '../components/clients/ClientForm';
import { Plus, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function Clients() {
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [search, setSearch] = useState('');

  const clients = useLiveQuery(async () => {
    if (!search) return db.clients.toArray();
    const searchLower = search.toLowerCase();
    return db.clients
      .filter(
        (client) =>
          client.name.toLowerCase().includes(searchLower) ||
          client.dni?.toLowerCase().includes(searchLower) ||
          false
      )
      .toArray();
  }, [search]);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await db.clients.delete(id);
      showToast('Client deleted successfully', 'success');
    } catch (error) {
      showToast(`Failed to delete client: ${error}`, 'error');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedClient(undefined);
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Clients</h1>
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          <Plus className='w-4 h-4' />
          Add Client
        </button>
      </div>

      <div className='mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search clients...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {showForm && (
        <ClientForm client={selectedClient} onClose={handleCloseForm} />
      )}
      <ClientList
        clients={clients || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
