-- Add missing venue fields to existing venues table
-- Run this script if you have an existing database that needs the new venue fields

-- Add new columns to venues table (if they don't exist)
DO $$
BEGIN
    -- Add city column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'venues' AND column_name = 'city') THEN
        ALTER TABLE venues ADD COLUMN city TEXT;
    END IF;

    -- Add postcode column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'venues' AND column_name = 'postcode') THEN
        ALTER TABLE venues ADD COLUMN postcode TEXT;
    END IF;

    -- Add phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'venues' AND column_name = 'phone') THEN
        ALTER TABLE venues ADD COLUMN phone TEXT;
    END IF;

    -- Add email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'venues' AND column_name = 'email') THEN
        ALTER TABLE venues ADD COLUMN email TEXT;
    END IF;

    -- Add website column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'venues' AND column_name = 'website') THEN
        ALTER TABLE venues ADD COLUMN website TEXT;
    END IF;
END $$;

-- Update existing demo venue with proper information
UPDATE venues
SET
    name = 'Demo Community Centre',
    city = 'Demo City',
    postcode = 'DC1 2AB',
    phone = '+44 1234 567890',
    email = 'info@democentre.org',
    website = 'https://democentre.org'
WHERE name = 'Main Hall' OR name LIKE '%Demo%';

-- Show the updated venue information
SELECT
    name,
    address,
    city,
    postcode,
    phone,
    email,
    website
FROM venues
LIMIT 5;
