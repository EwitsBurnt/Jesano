import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Database } from '@/types/supabase';

export type Job = Database['public']['Tables']['jobs']['Row'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
export type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export type JobItem = Database['public']['Tables']['job_items']['Row'];
export type JobItemInsert = Database['public']['Tables']['job_items']['Insert'];
export type JobItemUpdate = Database['public']['Tables']['job_items']['Update'];

/**
 * Service for managing job data
 */
export const jobService = {
  /**
   * Get all jobs
   */
  async getAll(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get jobs for a specific customer
   */
  async getByCustomerId(customerId: string): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get a job by ID
   */
  async getById(id: string): Promise<Job | null> {
    try {
      const { data, error } = await supabase
        .from('jobs')
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
   * Create a new job
   */
  async create(job: JobInsert): Promise<Job> {
    try {
      // Set timestamps
      const now = new Date().toISOString();
      const jobWithTimestamps = {
        ...job,
        created_at: now,
        updated_at: now,
        status: job.status || 'pending',
      };

      const { data, error } = await supabase
        .from('jobs')
        .insert(jobWithTimestamps)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create job');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update an existing job
   */
  async update(id: string, job: JobUpdate): Promise<Job> {
    try {
      // Set updated timestamp
      const jobWithTimestamp = {
        ...job,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('jobs')
        .update(jobWithTimestamp)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Job not found');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Delete a job
   */
  async delete(id: string): Promise<void> {
    try {
      // First delete all job items
      const { error: itemsError } = await supabase
        .from('job_items')
        .delete()
        .eq('job_id', id);
      
      if (itemsError) throw itemsError;
      
      // Then delete the job
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Get all items for a job
   */
  async getJobItems(jobId: string): Promise<JobItem[]> {
    try {
      const { data, error } = await supabase
        .from('job_items')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Add an item to a job
   */
  async addJobItem(item: JobItemInsert): Promise<JobItem> {
    try {
      // Calculate total price
      const totalPrice = item.quantity * item.unit_price;
      
      // Set timestamps
      const now = new Date().toISOString();
      const itemWithDetails = {
        ...item,
        total_price: totalPrice,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('job_items')
        .insert(itemWithDetails)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to add job item');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Update a job item
   */
  async updateJobItem(id: string, item: JobItemUpdate): Promise<JobItem> {
    try {
      // Calculate total price if quantity and unit_price are provided
      let totalPrice = undefined;
      if (item.quantity !== undefined && item.unit_price !== undefined) {
        totalPrice = item.quantity * item.unit_price;
      }
      
      // Set updated timestamp
      const itemWithDetails = {
        ...item,
        total_price: totalPrice,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('job_items')
        .update(itemWithDetails)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Job item not found');
      
      return data;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  /**
   * Delete a job item
   */
  async deleteJobItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('job_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }
}; 