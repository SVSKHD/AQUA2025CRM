'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Tab } from '@headlessui/react';
import { invoiceOperations, type Invoice } from '@/services/invoices';
import InvoiceDialog from './invoices/InvoiceDialog';
import InvoiceList from './invoices/InvoiceList';
import PaginationControls from './invoices/PaginationControls';

interface TabItem {
  name: string;
  filter: (invoice: Invoice) => boolean;
}

const tabs: TabItem[] = [
  { name: 'All', filter: () => true },
  { name: 'Regular', filter: (invoice) => !invoice.gst && !invoice.po && !invoice.quotation },
  { name: 'GST', filter: (invoice) => invoice.gst },
  { name: 'PO', filter: (invoice) => invoice.po },
  { name: 'Quotation', filter: (invoice) => invoice.quotation }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Dummy data for development
const dummyInvoices: Invoice[] = [
  { 
    _id: '1',
    invoiceNo: 'INV-2025-001',
    date: '15/03/2025',
    customerDetails: {
      name: 'John Doe',
      phone: 9876543210,
      email: 'john@example.com',
      address: '123 Main St, City'
    },
    gst: true,
    po: false,
    quotation: false,
    gstDetails: {
      gstName: 'John Doe Enterprises',
      gstNo: 'GST123456789',
      gstPhone: null,
      gstEmail: 'accounts@johndoe.com',
      gstAddress: '123 Business Park'
    },
    products: [
      {
        productName: 'Water Softener',
        productQuantity: 1,
        productPrice: 15000,
        productSerialNo: 'WS-001'
      }
    ],
    transport: {
      deliveredBy: 'Express Delivery',
      deliveryDate: '2025-03-20'
    },
    paidStatus: 'paid',
    aquakartOnlineUser: false,
    aquakartInvoice: true,
    paymentType: 'upi'
  },
  {
    _id: '2',
    invoiceNo: 'INV-2025-002',
    date: '16/03/2025',
    customerDetails: {
      name: 'Jane Smith',
      phone: 9876543211,
      email: 'jane@example.com',
      address: '456 Park Ave, City'
    },
    gst: false,
    po: true,
    quotation: false,
    gstDetails: {
      gstName: '',
      gstNo: '',
      gstPhone: null,
      gstEmail: '',
      gstAddress: ''
    },
    products: [
      {
        productName: 'RO System',
        productQuantity: 1,
        productPrice: 25000,
        productSerialNo: 'RO-001'
      },
      {
        productName: 'Installation Kit',
        productQuantity: 1,
        productPrice: 2000,
        productSerialNo: 'IK-001'
      }
    ],
    transport: {
      deliveredBy: 'In-house',
      deliveryDate: '2025-03-21'
    },
    paidStatus: 'pending',
    aquakartOnlineUser: true,
    aquakartInvoice: true,
    paymentType: 'card'
  }
];

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await invoiceOperations.getInvoices();
      // If no data from API, use dummy data
      setInvoices(response.data.length > 0 ? response.data : dummyInvoices);
      setError(null);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      // Fallback to dummy data on error
      setInvoices(dummyInvoices);
      setError('Using demo data. API connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices
    .filter(tabs[selectedTab].filter)
    .filter(invoice =>
      invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination calculations
  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedInvoice(null);
    setIsDialogOpen(true);
  };

  const calculateTotal = (products: Invoice['products']) => {
    return products.reduce((sum, product) => sum + (product.productPrice * product.productQuantity), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage customer invoices and payment status
          </p>
          {error && (
            <p className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
              {error}
            </p>
          )}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </button>
        </div>
      </div>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <div className="mt-6 flex items-center space-x-6">
          <div className="max-w-md flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-base placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              />
            </div>
          </div>
          <Tab.List className="flex space-x-2 rounded-lg bg-gray-100 p-1">
            {tabs.map((tab, index) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'rounded-md px-3 py-2 text-sm font-medium',
                    selected
                      ? 'bg-white text-cyan-700 shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
        </div>

        <Tab.Panels className="mt-4">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            >
              <div className="mt-4 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <InvoiceList
                        invoices={currentInvoices}
                        onEdit={handleEdit}
                        calculateTotal={calculateTotal}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      {totalItems > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      <InvoiceDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
      />
    </div>
  );
}