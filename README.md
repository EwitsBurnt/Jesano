# Electrician Business App

A modern web application for electricians to manage customers, jobs, estimates, and invoices. Built with Next.js, TypeScript, and Supabase.

## Features

- **Customer Management**: Store and manage customer information including contact details and service history
- **Job Tracking**: Create and track jobs with detailed line items
- **Estimates & Invoices**: Generate professional estimates and convert them to invoices
- **Mobile-Friendly**: Designed for use in the field on mobile devices

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL database with built-in APIs)
- **Authentication**: Supabase Auth
- **Hosting**: Vercel (recommended)

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/           # Reusable UI components
├── lib/                  # Utility functions and configuration
├── services/             # Data services for API interactions
└── types/                # TypeScript type definitions
```

## Database Schema

The application uses the following database tables:

- **customers**: Store customer information (name, contact details, address)
- **jobs**: Track jobs associated with customers
- **job_items**: Store line items for each job
- **estimates**: Generate and track estimates for jobs
- **invoices**: Create and manage invoices for completed jobs

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Supabase project at https://supabase.com
4. Set up the database schema (SQL scripts provided below)
5. Copy `.env.example` to `.env.local` and add your Supabase credentials
6. Run the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

Run the following SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  notes TEXT
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  scheduled_date DATE,
  completed_date DATE,
  location TEXT,
  notes TEXT
);

-- Create job_items table
CREATE TABLE job_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  notes TEXT
);

-- Create estimates table
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  estimate_number TEXT NOT NULL UNIQUE,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT
);

-- Create invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_job_items_job_id ON job_items(job_id);
CREATE INDEX idx_estimates_job_id ON estimates(job_id);
CREATE INDEX idx_invoices_job_id ON invoices(job_id);
```

## Deployment

The application can be easily deployed to Vercel:

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Import the project in Vercel
3. Add your environment variables
4. Deploy

## License

MIT
