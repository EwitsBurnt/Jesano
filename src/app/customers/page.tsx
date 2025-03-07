'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomerList from '@/components/CustomerList';
import CustomerForm from '@/components/CustomerForm';
import { Customer, customerService } from '@/services/customerService';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading customers...');
      const data = await customerService.getAll();
      console.log('Customers loaded:', data);
      setCustomers(data);
    } catch (err) {
      console.error('Error loading customers:', err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormVisible(true);
  };

  const handleDelete = async (customerId: string) => {
    try {
      await customerService.delete(customerId);
      setCustomers(customers.filter(c => c.id !== customerId));
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err; // Let the component handle the error
    }
  };

  const handleFormSubmit = async (customerData: any) => {
    try {
      if (editingCustomer) {
        // Update existing customer
        const updatedCustomer = await customerService.update(editingCustomer.id, customerData);
        setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      } else {
        // Create new customer
        const newCustomer = await customerService.create(customerData);
        setCustomers([...customers, newCustomer]);
      }
      
      // Reset form state
      setEditingCustomer(null);
      setIsFormVisible(false);
    } catch (err) {
      console.error('Error saving customer:', err);
      throw err; // Let the form component handle the error
    }
  };

  const handleFormCancel = () => {
    setEditingCustomer(null);
    setIsFormVisible(false);
  };

  const handleAddNewClick = () => {
    setEditingCustomer(null);
    setIsFormVisible(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Customer Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            className="float-right font-bold"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      {isFormVisible ? (
        <CustomerForm 
          initialData={editingCustomer || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          {loading ? (
            <div className="text-center py-8 text-gray-900">
              <p>Loading customers...</p>
            </div>
          ) : (
            <CustomerList 
              customers={customers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddNew={handleAddNewClick}
            />
          )}
        </>
      )}
    </div>
  );
} 