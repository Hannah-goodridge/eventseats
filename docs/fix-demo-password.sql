-- EventSeats - Fix Demo User Password
-- Run this in Supabase SQL Editor to update the admin user with correct password hash

-- Update the admin user with a proper bcrypt hash for "demo123"
UPDATE users
SET "hashedPassword" = '$2b$12$S8oL/s/Ug0lCtR4sKDJa/Ofoc01qxKVpkFbNTeIbqd1iB2dBQYZZm',
    "updatedAt" = NOW()
WHERE email = 'admin@democentre.org';

-- Verify the update
SELECT
  'Password updated for EventSeats demo user' as message,
  email,
  name,
  role,
  "organizationId"
FROM users
WHERE email = 'admin@democentre.org';

-- Show login instructions
SELECT
  '🎪 EventSeats Demo Login' as title,
  '📧 Email: admin@democentre.org' as login_email,
  '🔑 Password: demo123' as login_password,
  '🌐 Login at: /admin/login' as login_url;
