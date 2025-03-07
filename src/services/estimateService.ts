import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { jobService } from './jobService';

export type Estimate = Database['public']['Tables']['estimates']['Row'];
export type EstimateInsert = Database['public']['Tables']['estimates']['Insert'];
export type EstimateUpdate = Database['public']['Tables']['estimates']['Update'];

/**
 * Service for managing estimate data
 */
export const estimateService = {
  /**
   * Get all estimates
   */
  async getAll(): Promise<Estimate[]> {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .order('issue_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get estimates for a specific job
   */
  async getByJobId(jobId: string): Promise<Estimate[]> {
    try {
      const { data, error } = await supabase
        .from('estimates')
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
   * Get an estimate by ID
   */
  async getById(id: string): Promise<Estimate | null> {
    try {
      const { data, error } = await supabase
        .from('estimates')
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
   * Create a new estimate from job data
   */
  async createFromJob(
    jobId: string, 
    estimateNumber: string, 
    issueDate: string, 
    expiryDate: string, 
    taxRate: number,
    notes?: string
  ): Promise<Estimate> {
    try {
      // Get job items to calculate subtotal
      const jobItems = await jobService.getJobItems(jobId);
      const subtotal = jobItems.reduce((sum, item) => sum + item.total_price, 0);
      const taxAmount = subtotal * (taxRate / 100);
      const totalAmount = subtotal + taxAmount;

      // Create estimate object
      const now = new Date().toISOString();
      const estimate: EstimateInsert = {
        job_id: jobId,
        estimate_number: estimateNumber,
        issue_date: issueDate,
        expiry_date: expiryDate,
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
        .from('estimates')
        .insert(estimate)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create estimate');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update an existing estimate
   */
  async update(id: string, estimate: EstimateUpdate): Promise<Estimate> {
    try {
      // Recalculate totals if needed
      let updatedEstimate = { ...estimate };
      
      if (estimate.subtotal !== undefined && estimate.tax_rate !== undefined) {
        const taxAmount = estimate.subtotal * (estimate.tax_rate / 100);
        const totalAmount = estimate.subtotal + taxAmount;
        
        updatedEstimate = {
          ...updatedEstimate,
          tax_amount: taxAmount,
          total_amount: totalAmount,
        };
      }
      
      // Set updated timestamp
      updatedEstimate.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('estimates')
        .update(updatedEstimate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Estimate not found');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Delete an estimate
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('estimates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update estimate status
   */
  async updateStatus(id: string, status: Estimate['status']): Promise<Estimate> {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Estimate not found');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Generate a new estimate number
   * Format: EST-YYYYMMDD-XXXX (where XXXX is a sequential number)
   */
  async generateEstimateNumber(): Promise<string> {
    try {
      // Get current date in YYYYMMDD format
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      // Get the latest estimate with this date prefix
      const { data, error } = await supabase
        .from('estimates')
        .select('estimate_number')
        .ilike('estimate_number', `EST-${dateStr}-%`)
        .order('estimate_number', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      // Determine the next sequence number
      let sequenceNumber = 1;
      if (data && data.length > 0) {
        const lastEstimateNumber = data[0].estimate_number;
        const lastSequence = parseInt(lastEstimateNumber.split('-')[2], 10);
        sequenceNumber = lastSequence + 1;
      }
      
      // Format the sequence number with leading zeros
      const sequenceStr = sequenceNumber.toString().padStart(4, '0');
      
      return `EST-${dateStr}-${sequenceStr}`;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Convert an estimate to an invoice
   * This creates a new invoice based on the estimate data
   */
  async convertToInvoice(estimateId: string, invoiceNumber: string, dueDate: string): Promise<string> {
    try {
      // Get the estimate
      const estimate = await this.getById(estimateId);
      if (!estimate) throw new Error('Estimate not found');
      
      // Create invoice data
      const now = new Date().toISOString();
      const invoiceData = {
        job_id: estimate.job_id,
        invoice_number: invoiceNumber,
        issue_date: now.slice(0, 10), // Today's date
        due_date: dueDate,
        status: 'draft',
        subtotal: estimate.subtotal,
        tax_rate: estimate.tax_rate,
        tax_amount: estimate.tax_amount,
        total_amount: estimate.total_amount,
        notes: estimate.notes ? `Converted from estimate ${estimate.estimate_number}. ${estimate.notes}` : `Converted from estimate ${estimate.estimate_number}.`,
        created_at: now,
        updated_at: now,
      };
      
      // Insert the invoice
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select('id')
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create invoice from estimate');
      
      // Update the estimate status to 'accepted'
      await this.updateStatus(estimateId, 'accepted');
      
      return data.id;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }
}; 