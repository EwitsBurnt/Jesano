'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Customer } from '@/services/customerService';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => Promise<void>;
  onAddNew: () => void;
}

export default function CustomerList({ customers, onEdit, onDelete, onAddNew }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchLower))
    );
  });

  const handleDelete = async (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        setIsDeleting(customerId);
        await onDelete(customerId);
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold mb-2 md:mb-0 text-gray-900">Customers</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={onAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="p-6 text-center text-gray-700">
          {searchTerm ? 'No customers match your search.' : 'No customers found. Add your first customer!'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email || '—'}</div>
                    <div className="text-sm text-gray-700">{customer.phone || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.address ? `${customer.address}` : '—'}
                    </div>
                    <div className="text-sm text-gray-700">
                      {customer.city && customer.state
                        ? `${customer.city}, ${customer.state} ${customer.zip || ''}`
                        : customer.city || customer.state || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(customer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      disabled={isDeleting === customer.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {isDeleting === customer.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 