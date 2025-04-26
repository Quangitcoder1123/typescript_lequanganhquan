-- Create payment_types table
CREATE TABLE IF NOT EXISTS payment_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Insert default payment types
INSERT INTO payment_types (name) VALUES 
    ('Theo tháng'),
    ('Theo quý'),
    ('Theo năm')
ON CONFLICT (name) DO NOTHING;

-- Create room_rentals table
CREATE TABLE IF NOT EXISTS room_rentals (
    id SERIAL PRIMARY KEY,
    room_code VARCHAR(50) NOT NULL UNIQUE,
    tenant_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    payment_type_id INTEGER REFERENCES payment_types(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 