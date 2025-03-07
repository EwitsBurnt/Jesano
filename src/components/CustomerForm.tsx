'use client';

import { useState, FormEvent } from 'react';
import { Customer, CustomerInsert } from '@/services/customerService';

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (customer: CustomerInsert) => Promise<void>;
  onCancel: () => void;
}

export default function CustomerForm({ initialData, onSubmit, onCancel }: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CustomerInsert>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zip: initialData?.zip || '',
    notes: initialData?.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Customer name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting customer form:', error);
      alert('Failed to save customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          {initialData ? 'Edit Customer' : 'Add New Customer'}
        </h2>
        
        <div className="space-y-4">
          {/* Name - Required */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
          
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>
          
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-900">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-900">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-900">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-900">
                ZIP Code
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-900">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
      </div>
    </form>
  );
} 