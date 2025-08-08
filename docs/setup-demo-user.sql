-- EventSeats Demo Data Setup
-- Run this SQL in your Supabase SQL Editor to create demo data
-- This will set up a complete demo venue with seating and admin user

-- Insert demo organization
INSERT INTO organizations (id, name, slug, email, phone, address, currency, timezone, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Demo Community Centre',
  'demo-community-centre',
  'info@democentre.org',
  '+44 1234 567890',
  '123 Community Street, Demo City, DC1 2AB',
  'GBP',
  'Europe/London',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Insert demo venue (using the organization ID)
INSERT INTO venues (id, name, slug, description, address, capacity, "organizationId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Main Hall',
  'main-hall',
  'Our main event space with flexible seating arrangements',
  '123 Community Street, Demo City, DC1 2AB',
  100,
  o.id,
  NOW(),
  NOW()
FROM organizations o
WHERE o.slug = 'demo-community-centre'
ON CONFLICT ("organizationId", slug) DO NOTHING;

-- Insert demo seating layout
INSERT INTO seating_layouts (id, name, description, rows, columns, "layoutData", "venueId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'Standard Layout',
  'Flexible event seating - 5 rows, 10 seats per row',
  5,
  10,
  '{"type": "grid", "sections": [{"name": "Main", "startRow": 1, "endRow": 5, "startSeat": 1, "endSeat": 10}]}',
  v.id,
  NOW(),
  NOW()
FROM venues v
JOIN organizations o ON v."organizationId" = o.id
WHERE o.slug = 'demo-community-centre' AND v.slug = 'main-hall'
ON CONFLICT DO NOTHING;

-- Insert demo seats (5 rows of 10 seats each)
WITH layout_info AS (
  SELECT sl.id as layout_id
  FROM seating_layouts sl
  JOIN venues v ON sl."venueId" = v.id
  JOIN organizations o ON v."organizationId" = o.id
  WHERE o.slug = 'demo-community-centre' AND v.slug = 'main-hall'
  LIMIT 1
),
seat_data AS (
  SELECT
    gen_random_uuid() as id,
    chr(64 + row_num) as row,
    seat_num::text as number,
    CASE WHEN row_num = 1 AND seat_num <= 2 THEN true ELSE false END as "isAccessible",
    CASE WHEN row_num = 1 AND seat_num = 1 THEN true ELSE false END as "isWheelchairSpace",
    layout_info.layout_id as "seatingLayoutId",
    NOW() as "createdAt",
    NOW() as "updatedAt"
  FROM layout_info,
       generate_series(1, 5) as row_num,  -- Only 5 rows for demo
       generate_series(1, 10) as seat_num
)
INSERT INTO seats (id, row, number, "isAccessible", "isWheelchairSpace", "seatingLayoutId", "createdAt", "updatedAt")
SELECT * FROM seat_data
ON CONFLICT ("seatingLayoutId", row, number) DO NOTHING;

-- Insert demo admin user (password: demo123)
-- Note: This is a bcrypt hash of "demo123"
INSERT INTO users (id, email, name, role, "hashedPassword", "emailVerified", "organizationId", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'admin@democentre.org',
  'Admin User',
  'ADMIN',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXig2.wrNZL2', -- bcrypt hash of "demo123"
  NOW(),
  o.id,
  NOW(),
  NOW()
FROM organizations o
WHERE o.slug = 'demo-community-centre'
ON CONFLICT (email) DO UPDATE SET
  "hashedPassword" = EXCLUDED."hashedPassword",
  "updatedAt" = NOW();

-- Verify the setup
SELECT 'EventSeats demo setup completed!' as message;

-- Show what was created
SELECT o.name as organization, v.name as venue, sl.name as seating_layout, count(s.id) as seat_count
FROM organizations o
JOIN venues v ON v."organizationId" = o.id
JOIN seating_layouts sl ON sl."venueId" = v.id
LEFT JOIN seats s ON s."seatingLayoutId" = sl.id
WHERE o.slug = 'demo-community-centre'
GROUP BY o.name, v.name, sl.name;

-- Show admin user details
SELECT u.email, u.name, u.role, o.name as organization
FROM users u
JOIN organizations o ON u."organizationId" = o.id
WHERE u.email = 'admin@democentre.org';

-- Display login instructions
SELECT
  '🎪 EventSeats Demo Ready!' as title,
  '📧 Email: admin@democentre.org' as login_email,
  '🔑 Password: demo123' as login_password,
  '🌐 Login at: /admin/login' as login_url;
