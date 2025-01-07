import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Provider } from '../db/schema';
import { Plus, Edit2, Search } from 'lucide-react';
import { ProviderForm } from '../components/providers/ProviderForm';
import { DeleteButton } from '../components/shared/DeleteButton';
import { useToast } from '../context/ToastContext';

export function Providers() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<
    Provider | undefined
  >();

  const providers = useLiveQuery(async () => {
    if (!search) return db.providers.toArray();
    const searchLower = search.toLowerCase();
    return db.providers
      .filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchLower) ||
          provider.cuit?.includes(search) ||
          false
      )
      .toArray();
  }, [search]);

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await db.providers.delete(id);
      showToast('Provider deleted successfully', 'success');
    } catch (error) {
      showToast(`Failed to delete provider: ${error}`, 'error');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProvider(undefined);
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Providers</h1>
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          <Plus className='w-4 h-4' />
          Add Provider
        </button>
      </div>

      <div className='mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search providers...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                CUIT
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                Phone
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                Email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {providers?.map((provider) => (
              <tr key={provider.id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {provider.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {provider.cuit}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {provider.phone}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {provider.mail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(provider)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {provider.id && (
                    <DeleteButton
                      onDelete={() => handleDelete(provider.id!)}
                      type="provider"
                      data={provider}
                    />
                  )}
                </div>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProviderForm provider={selectedProvider} onClose={handleCloseForm} />
      )}
    </div>
  );
}
