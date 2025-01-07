import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  Store,
  ShoppingCart,
  Users,
  Settings,
  Database,
  Truck,
  History,
  PackagePlus,
} from 'lucide-react';
import { useProductAlerts } from '../hooks/useProductAlerts';
import { useSalesAlerts } from '../hooks/useSalesAlerts';

export function Layout() {
  const { lowStockCount } = useProductAlerts();
  const { pendingSalesCount } = useSalesAlerts();

  return (
    <div className='flex h-screen bg-gray-100'>
      <aside className='w-64 bg-white shadow-md'>
        <nav className='p-4 space-y-2'>
          <Link
            to='/'
            className='flex items-center space-x-2 p-2 hover:bg-gray-100 rounded'
          >
            <ShoppingCart className='w-5 h-5' />
            <span>New Sale</span>
          </Link>
          <Link
            to='/sales/history'
            className='flex items-center justify-between p-2 hover:bg-gray-100 rounded group'
          >
            <div className='flex items-center space-x-2'>
              <History className='w-5 h-5' />
              <span>Sales History</span>
            </div>
            {pendingSalesCount ? (
              <span className='bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs font-medium'>
                {pendingSalesCount}
              </span>
            ) : null}
          </Link>
          <Link
            to='/products'
            className='flex items-center justify-between p-2 hover:bg-gray-100 rounded group'
          >
            <div className='flex items-center space-x-2'>
              <Store className='w-5 h-5' />
              <span>Products</span>
            </div>
            {lowStockCount ? (
              <span className='bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium'>
                {lowStockCount}
              </span>
            ) : null}
          </Link>
          <Link
            to='/buys'
            className='flex items-center space-x-2 p-2 hover:bg-gray-100 rounded'
          >
            <PackagePlus className='w-5 h-5' />
            <span>New Purchase</span>
          </Link>
          <Link
            to='/buys/history'
            className='flex items-center space-x-2 p-2 hover:bg-gray-100 rounded'
          >
            <History className='w-5 h-5' />
            <span>Purchase History</span>
          </Link>
          <Link
            to='/clients'
            className='flex items-center space-x-2 p-2 hover:bg-gray-100 rounded'
          >
            <Users className='w-5 h-5' />
            <span>Clients</span>
          </Link>
          <Link
            to='/providers'
            className='flex items-center space-x-2 p-2 hover:bg-gray-100 rounded'
          >
            <Truck className='w-5 h-5' />
            <span>Providers</span>
          </Link>
          <Link
            to='/settings'
            className='flex items-center space-x-2 p-2 hover:bg-gray-100 rounded'
          >
            <Settings className='w-5 h-5' />
            <span>Settings</span>
          </Link>
          <Link
            to='/backup'
            className='flex items-center space-x-2 p-2 hover:bg-gray-100 rounded'
          >
            <Database className='w-5 h-5' />
            <span>Backup</span>
          </Link>
        </nav>
      </aside>

      <main className='flex-1 overflow-auto'>
        <div className='p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}