import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { jobService } from './jobService';

export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];

/**
 * Service for managing invoice data
 */
export const invoiceService = {
  /**
   * Get all invoices
   */
  async getAll(): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('issue_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get invoices for a specific job
   */
  async getByJobId(jobId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('job_id', jobId)
        .order('issue_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get an invoice by ID
   */
  async getById(id: string): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from('invoices')
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
   * Create a new invoice from job data
   */
  async createFromJob(
    jobId: string, 
    invoiceNumber: string, 
    issueDate: string, 
    dueDate: string, 
    taxRate: number,
    notes?: string
  ): Promise<Invoice> {
    try {
      // Get job items to calculate subtotal
      const jobItems = await jobService.getJobItems(jobId);
      const subtotal = jobItems.reduce((sum, item) => sum + item.total_price, 0);
      const taxAmount = subtotal * (taxRate / 100);
      const totalAmount = subtotal + taxAmount;

      // Create invoice object
      const now = new Date().toISOString();
      const invoice: InvoiceInsert = {
        job_id: jobId,
        invoice_number: invoiceNumber,
        issue_date: issueDate,
        due_date: dueDate,
        status: 'draft',
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        notes,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('invoices')
        .insert(invoice)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create invoice');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update an existing invoice
   */
  async update(id: string, invoice: InvoiceUpdate): Promise<Invoice> {
    try {
      // Recalculate totals if needed
      let updatedInvoice = { ...invoice };
      
      if (invoice.subtotal !== undefined && invoice.tax_rate !== undefined) {
        const taxAmount = invoice.subtotal * (invoice.tax_rate / 100);
        const totalAmount = invoice.subtotal + taxAmount;
        
        updatedInvoice = {
          ...updatedInvoice,
          tax_amount: taxAmount,
          total_amount: totalAmount,
        };
      }
      
      // Set updated timestamp
      updatedInvoice.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('invoices')
        .update(updatedInvoice)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Invoice not found');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Delete an invoice
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update invoice status
   */
  async updateStatus(id: string, status: Invoice['status']): Promise<Invoice> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Invoice not found');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Generate a new invoice number
   * Format: INV-YYYYMMDD-XXXX (where XXXX is a sequential number)
   */
  async generateInvoiceNumber(): Promise<string> {
    try {
      // Get current date in YYYYMMDD format
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      // Get the latest invoice with this date prefix
      const { data, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .ilike('invoice_number', `INV-${dateStr}-%`)
        .order('invoice_number', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      // Determine the next sequence number
      let sequenceNumber = 1;
      if (data && data.length > 0) {
        const lastInvoiceNumber = data[0].invoice_number;
        const lastSequence = parseInt(lastInvoiceNumber.split('-')[2], 10);
        sequenceNumber = lastSequence + 1;
      }
      
      // Format the sequence number with leading zeros
      const sequenceStr = sequenceNumber.toString().padStart(4, '0');
      
      return `INV-${dateStr}-${sequenceStr}`;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }
}; 