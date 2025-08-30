-- Create donations table for storing all donation information
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(20),
  amount DECIMAL(12,2) NOT NULL,
  donation_type VARCHAR(20) NOT NULL CHECK (donation_type IN ('one-time', 'monthly', 'quantity')),
  quantity INTEGER DEFAULT 1,
  tier_name VARCHAR(100),
  tier_badge VARCHAR(100),
  tier_description TEXT,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_amount ON donations(amount);

-- Enable Row Level Security (RLS)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for statistics
CREATE POLICY "Allow public read access for donations" ON donations
  FOR SELECT USING (true);

-- Create policy to allow public insert for new donations
CREATE POLICY "Allow public insert for donations" ON donations
  FOR INSERT WITH CHECK (true);

-- Create policy to allow admin full access (you can modify this based on your admin auth setup)
CREATE POLICY "Allow admin full access" ON donations
  FOR ALL USING (true);
