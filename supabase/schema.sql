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

-- Set up Row Level Security (RLS) policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow full access to authenticated users" ON customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON jobs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON job_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON estimates FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to authenticated users" ON invoices FOR ALL TO authenticated USING (true); 