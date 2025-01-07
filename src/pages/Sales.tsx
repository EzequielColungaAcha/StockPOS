import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Product,
  PaymentMethod,
  Installment,
  Client,
  Sale,
} from '../db/schema';
import { Search } from 'lucide-react';
import { SaleCart } from '../components/sales/SaleCart';
import { ProductList } from '../components/sales/ProductList';
import { PaymentMethodSelector } from '../components/sales/PaymentMethodSelector';
import { ClientSelector } from '../components/sales/ClientSelector';
import { PrintTicketModal } from '../components/sales/PrintTicketModal';
import {
  getProductsWithStock,
  searchProductsWithStock,
  getProductByBarcode,
} from '../db/queries';
import { createSale } from '../services/sales';
import { useToast } from '../context/ToastContext';

export function Sales() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>();
  const [selectedInstallment, setSelectedInstallment] = useState<Installment>();
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [ticketSale, setTicketSale] = useState<Sale>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const products = useLiveQuery(
    () => (search ? searchProductsWithStock(search) : getProductsWithStock()),
    [search]
  );

  const addToCart = useCallback(
    (product: Product) => {
      const cartCount = cart.filter((item) => item.id === product.id).length;
      if (cartCount < product.stock) {
        setCart([...cart, product]);
        searchInputRef.current?.focus();
      }
    },
    [cart]
  );

  // Focus search input on component mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Handle barcode scanner input
  useEffect(() => {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();

    const handleKeyPress = async (e: KeyboardEvent) => {
      const currentTime = Date.now();

      if (currentTime - lastKeyTime > 100) {
        barcodeBuffer = '';
      }

      lastKeyTime = currentTime;

      if (/[\d]/.test(e.key)) {
        barcodeBuffer += e.key;
      } else if (e.key === 'Enter' && barcodeBuffer.length > 0) {
        const product = await getProductByBarcode(barcodeBuffer);
        if (product && product.stock > 0) {
          const cartCount = cart.filter(
            (item) => item.id === product.id
          ).length;
          if (cartCount < product.stock) {
            addToCart(product);
          }
        }
        barcodeBuffer = '';
        setSearch('');
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [addToCart, cart]);

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
    searchInputRef.current?.focus();
  };

  const handlePaymentMethodSelect = (
    method: PaymentMethod,
    installment?: Installment
  ) => {
    setSelectedPayment(method);
    setSelectedInstallment(installment);
    searchInputRef.current?.focus();
  };

  const handleClientSelect = (client?: Client) => {
    setSelectedClient(client);
    searchInputRef.current?.focus();
  };

  const handleCompleteSale = async (status: 'completed' | 'pending') => {
    if (!selectedPayment) {
      showToast('Please select a payment method', 'warning');
      return;
    }

    if (selectedPayment.installments?.length > 0 && !selectedInstallment) {
      showToast('Please select installment option', 'warning');
      return;
    }

    try {
      const sale = await createSale(
        cart,
        selectedPayment,
        selectedInstallment,
        status,
        selectedClient
      );

      showToast(`Sale ${status} successfully`, 'success');

      // Always print ticket (comment to disable)
      setTicketSale(sale);

      // Ask if user wants to print ticket (uncomment to enable)
      // const shouldPrint = await showConfirmToast('Would you like to print the sale ticket?');
      // if (shouldPrint) {
      // setTicketSale(sale);
      // }

      // Reset form
      setCart([]);
      setSelectedPayment(undefined);
      setSelectedInstallment(undefined);
      setSelectedClient(undefined);
      searchInputRef.current?.focus();
    } catch (error) {
      showToast(`Failed to complete sale: ${error}`, 'error');
    }
  };

  return (
    <div className='h-full flex gap-4'>
      <div className='flex-1'>
        <div className='mb-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              ref={searchInputRef}
              type='text'
              placeholder='Search products or scan barcode...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        <ProductList
          products={products || []}
          onAddToCart={addToCart}
          cartItems={cart}
          searchInputRef={searchInputRef}
        />
      </div>

      <div className='w-96 space-y-4'>
        <ClientSelector
          selectedClient={selectedClient}
          onSelect={handleClientSelect}
        />
        <PaymentMethodSelector
          selectedMethod={selectedPayment}
          onSelect={handlePaymentMethodSelect}
        />
        <SaleCart
          items={cart}
          paymentMethod={selectedPayment}
          installment={selectedInstallment}
          onRemoveItem={removeFromCart}
          onCompleteSale={handleCompleteSale}
        />
      </div>

      {ticketSale && (
        <PrintTicketModal
          sale={ticketSale}
          onClose={() => setTicketSale(undefined)}
        />
      )}
    </div>
  );
}
