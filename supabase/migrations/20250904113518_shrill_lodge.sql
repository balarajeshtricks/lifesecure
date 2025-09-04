/*
  # Life Insurance Lead Management System

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text, customer full name)
      - `email` (text, customer email)
      - `mobile` (text, customer mobile number)
      - `dob` (date, date of birth)
      - `status` (text, lead status)
      - `appointment_date` (text, appointment date if scheduled)
      - `appointment_time` (text, appointment time if scheduled)
      - `appointment_place` (text, appointment location if scheduled)
      - `submitted_at` (timestamp, when lead was created)
      - `updated_at` (timestamp, last status update)
    
    - `admins`
      - `id` (uuid, primary key)
      - `username` (text, admin username)
      - `password_hash` (text, hashed password)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for admin access to customers table
    - Add policies for admin authentication

  3. Initial Data
    - Create default admin user (username: admin, password: admin123)
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  dob date NOT NULL,
  status text NOT NULL DEFAULT 'Registered' CHECK (status IN ('Registered', 'Appointment Scheduled', 'Meeting', 'Closure', 'Not Interested')),
  appointment_date text,
  appointment_time text,
  appointment_place text,
  submitted_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table (admin access only)
CREATE POLICY "Admins can read all customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update customers"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.id = auth.uid()
    )
  );

-- Create policies for admins table
CREATE POLICY "Admins can read own data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Insert default admin user
INSERT INTO admins (username, password_hash) 
VALUES ('admin', crypt('admin123', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_submitted_at ON customers(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for customers table
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();