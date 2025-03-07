export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          notes?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_date: string | null
          completed_date: string | null
          location: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id: string
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_date?: string | null
          completed_date?: string | null
          location?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          scheduled_date?: string | null
          completed_date?: string | null
          location?: string | null
          notes?: string | null
        }
      }
      job_items: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          job_id: string
          description: string
          quantity: number
          unit_price: number
          total_price: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id: string
          description: string
          quantity: number
          unit_price: number
          total_price?: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          notes?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          job_id: string
          invoice_number: string
          issue_date: string
          due_date: string
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          subtotal: number
          tax_rate: number
          tax_amount: number
          total_amount: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id: string
          invoice_number: string
          issue_date: string
          due_date: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          subtotal: number
          tax_rate: number
          tax_amount?: number
          total_amount?: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id?: string
          invoice_number?: string
          issue_date?: string
          due_date?: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          total_amount?: number
          notes?: string | null
        }
      }
      estimates: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          job_id: string
          estimate_number: string
          issue_date: string
          expiry_date: string
          status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          subtotal: number
          tax_rate: number
          tax_amount: number
          total_amount: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id: string
          estimate_number: string
          issue_date: string
          expiry_date: string
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          subtotal: number
          tax_rate: number
          tax_amount?: number
          total_amount?: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          job_id?: string
          estimate_number?: string
          issue_date?: string
          expiry_date?: string
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          total_amount?: number
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 