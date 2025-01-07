import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Products } from './pages/Products';
import { Sales } from './pages/Sales';
import { SalesHistory } from './pages/SalesHistory';
import { Clients } from './pages/Clients';
import { Settings } from './pages/Settings';
import { Backup } from './pages/Backup';
import { Providers } from './pages/Providers';
import { Buys } from './pages/Buys';
import { BuysHistory } from './pages/BuysHistory';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Sales />} />
            <Route path='sales/history' element={<SalesHistory />} />
            <Route path='products' element={<Products />} />
            <Route path='buys' element={<Buys />} />
            <Route path='buys/history' element={<BuysHistory />} />
            <Route path='clients' element={<Clients />} />
            <Route path='providers' element={<Providers />} />
            <Route path='settings' element={<Settings />} />
            <Route path='backup' element={<Backup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App