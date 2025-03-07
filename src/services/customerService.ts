import { supabase, handleSupabaseError, ensureAnonymousSession } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type Customer = Database['public']['Tables']['customers']['Row'];
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

/**
 * Service for managing customer data
 */
export const customerService = {
  /**
   * Get all customers
   */
  async getAll(): Promise<Customer[]> {
    try {
      await ensureAnonymousSession();
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get a customer by ID
   */
  async getById(id: string): Promise<Customer | null> {
    try {
      await ensureAnonymousSession();
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Create a new customer
   */
  async create(customer: CustomerInsert): Promise<Customer> {
    try {
      await ensureAnonymousSession();
      
      // Set timestamps
      const now = new Date().toISOString();
      const customerWithTimestamps = {
        ...customer,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('customers')
        .insert(customerWithTimestamps)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create customer');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update an existing customer
   */
  async update(id: string, customer: CustomerUpdate): Promise<Customer> {
    try {
      await ensureAnonymousSession();
      
      // Set updated timestamp
      const customerWithTimestamp = {
        ...customer,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('customers')
        .update(customerWithTimestamp)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Customer not found');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Delete a customer
   */
  async delete(id: string): Promise<void> {
    try {
      await ensureAnonymousSession();
      
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Search for customers by name or email
   */
  async search(query: string): Promise<Customer[]> {
    try {
      await ensureAnonymousSession();
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }
}; 