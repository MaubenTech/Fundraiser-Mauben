-- Add payment status column to donations table
ALTER TABLE donations 
ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed'));

-- Add index for payment status queries
CREATE INDEX idx_donations_payment_status ON donations(payment_status);
