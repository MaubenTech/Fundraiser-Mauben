-- Create pledges table for users who can't donate immediately
CREATE TABLE IF NOT EXISTS pledges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(20),
  amount DECIMAL(12, 2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  donation_type VARCHAR(20) NOT NULL CHECK (donation_type IN ('one-time', 'monthly', 'quantity')),
  tier_name VARCHAR(100) NOT NULL,
  tier_badge VARCHAR(100) NOT NULL,
  tier_description TEXT,
  pledge_date DATE NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_pledges_email ON pledges(donor_email);
CREATE INDEX IF NOT EXISTS idx_pledges_status ON pledges(status);
CREATE INDEX IF NOT EXISTS idx_pledges_pledge_date ON pledges(pledge_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pledges_updated_at BEFORE UPDATE ON pledges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
