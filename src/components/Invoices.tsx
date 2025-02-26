'use client';

import { useState, Fragment, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, FileText, Send, Package, X } from 'lucide-react';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { invoiceOperations, type Invoice, type Product } from '@/services/invoices';

const emptyInvoice: Partial<Invoice> = {
  invoiceNo: '',
  date: new Date().toLocaleDateString('en-GB'),
  customerDetails: {
    name: '',
    phone: 0,
    email: '',
    address: ''
  },
  gst: false,
  po: false,
  quotation: false,
  gstDetails: {
    gstName: '',
    gstNo: '',
    gstPhone: null,
    gstEmail: '',
    gstAddress: ''
  },
  products: [],
  transport: {
    deliveredBy: '',
    deliveryDate: ''
  },
  paidStatus: '',
  aquakartOnlineUser: false,
  aquakartInvoice: false,
  paymentType: ''
};

function InvoiceDialog({ isOpen, onClose, invoice = null }: { isOpen: boolean; onClose: () => void; invoice?: Invoice | null }) {
  const [formData, setFormData] = useState<Partial<Invoice>>(invoice || emptyInvoice);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    productName: '',
    productQuantity: 1,
    productPrice: 0,
    productSerialNo: ''
  });

  useEffect(() => {
    setFormData(invoice || emptyInvoice);
  }, [invoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (invoice) {
        await invoiceOperations.updateInvoice(formData);
      } else {
        await invoiceOperations.createInvoice(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const addProduct = () => {
    if (newProduct.productName && newProduct.productPrice) {
      setFormData({
        ...formData,
        products: [...(formData.products || []), { ...newProduct } as Product]
      });
      // Reset the form
      setNewProduct({
        productName: '',
        productQuantity: 1,
        productPrice: 0,
        productSerialNo: ''
      });
    }
  };

  const removeProduct = (index: number) => {
    const updatedProducts = [...(formData.products || [])];
    updatedProducts.splice(index, 1);
    setFormData({
      ...formData,
      products: updatedProducts
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-gray-900 mb-6"
                >
                  {invoice ? 'Edit Invoice' : 'Create New Invoice'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                      <input
                        type="text"
                        value={formData.invoiceNo}
                        onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        placeholder="DD/MM/YYYY"
                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={formData.customerDetails?.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            customerDetails: { ...formData.customerDetails!, name: e.target.value }
                          })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="number"
                          value={formData.customerDetails?.phone}
                          onChange={(e) => setFormData({
                            ...formData,
                            customerDetails: { ...formData.customerDetails!, phone: Number(e.target.value) }
                          })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="text"
                          value={formData.customerDetails?.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            customerDetails: { ...formData.customerDetails!, email: e.target.value }
                          })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea
                          value={formData.customerDetails?.address}
                          onChange={(e) => setFormData({
                            ...formData,
                            customerDetails: { ...formData.customerDetails!, address: e.target.value }
                          })}
                          rows={3}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invoice Options */}
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.gst}
                        onChange={(e) => setFormData({ ...formData, gst: e.target.checked })}
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">GST Invoice</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.po}
                        onChange={(e) => setFormData({ ...formData, po: e.target.checked })}
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">PO</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.quotation}
                        onChange={(e) => setFormData({ ...formData, quotation: e.target.checked })}
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Quotation</span>
                    </label>
                  </div>

                  {/* GST Details */}
                  {formData.gst && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">GST Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GST Name</label>
                          <input
                            type="text"
                            value={formData.gstDetails?.gstName}
                            onChange={(e) => setFormData({
                              ...formData,
                              gstDetails: { ...formData.gstDetails!, gstName: e.target.value }
                            })}
                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                          <input
                            type="text"
                            value={formData.gstDetails?.gstNo}
                            onChange={(e) => setFormData({
                              ...formData,
                              gstDetails: { ...formData.gstDetails!, gstNo: e.target.value }
                            })}
                            className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Products</h4>
                    
                    {/* Product List */}
                    <div className="space-y-4 mb-4">
                      {formData.products?.map((product, index) => (
                        <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                          <Package className="h-5 w-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="font-medium">{product.productName}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {product.productQuantity} × ₹{product.productPrice}
                              {product.productSerialNo && ` • S/N: ${product.productSerialNo}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Product Form */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                          type="text"
                          value={newProduct.productName}
                          onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                        <input
                          type="text"
                          value={newProduct.productSerialNo}
                          onChange={(e) => setNewProduct({ ...newProduct, productSerialNo: e.target.value })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input
                          type="number"
                          value={newProduct.productQuantity}
                          onChange={(e) => setNewProduct({ ...newProduct, productQuantity: Number(e.target.value) })}
                          min="1"
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                          type="number"
                          value={newProduct.productPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, productPrice: Number(e.target.value) })}
                          min="0"
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addProduct}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </button>
                  </div>

                  {/* Transport Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Transport Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivered By</label>
                        <input
                          type="text"
                          value={formData.transport?.deliveredBy}
                          onChange={(e) => setFormData({
                            ...formData,
                            transport: { ...formData.transport!, deliveredBy: e.target.value }
                          })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                        <input
                          type="date"
                          value={formData.transport?.deliveryDate}
                          onChange={(e) => setFormData({
                            ...formData,
                            transport: { ...formData.transport!, deliveryDate: e.target.value }
                          })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <select
                          value={formData.paidStatus}
                          onChange={(e) => setFormData({ ...formData, paidStatus: e.target.value })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        >
                          <option value="">Select Status</option>
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                          <option value="partial">Partial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                        <select
                          value={formData.paymentType}
                          onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                          className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200 text-base"
                        >
                          <option value="">Select Type</option>
                          <option value="cash">Cash</option>
                          <option value="card">Card</option>
                          <option value="upi">UPI</option>
                          <option value="bank">Bank Transfer</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                      {invoice ? 'Update Invoice' : 'Create Invoice'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceOperations.getInvoices();
      setInvoices(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice?.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice?.customerDetails?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedInvoice(null);
    setIsDialogOpen(true);
  };

  const calculateTotal = (products: Invoice['products']) => {
    const total = products.reduce((sum, product) => sum + (product.productPrice * product.productQuantity), 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(total);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800">
        <p className="font-medium">Error</p>
        <p className="mt-1 text-sm">{error}</p>
        <button
          onClick={fetchInvoices}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Retry
        </button>
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

      {/* Search */}
      <div className="mt-6 max-w-md">
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

      {/* Invoices Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Invoice</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          {invoice.invoiceNo}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {invoice.customerDetails.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        {calculateTotal(invoice.products)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-cyan-600 hover:text-cyan-900 mr-4"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="text-cyan-600 hover:text-cyan-900 mr-4"
                          title="Send Invoice"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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

export default Invoices;