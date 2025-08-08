import { createClient } from '@supabase/supabase-js'
import * as bcrypt from 'bcryptjs'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function seedAdminUser() {
  try {
    console.log('🎪 EventSeats - Seeding demo data...')

    // First, create a demo organization
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .upsert({
        name: 'Demo Community Centre',
        slug: 'demo-community-centre',
        email: 'info@democentre.org',
        phone: '+44 1234 567890',
        address: '123 Community Street, Demo City, DC1 2AB',
        currency: 'GBP',
        timezone: 'Europe/London'
      }, {
        onConflict: 'slug'
      })
      .select()
      .single()

    if (orgError) {
      throw new Error(`Failed to create organization: ${orgError.message}`)
    }

    console.log('✅ Organization created:', organization.name)

    // Create a demo venue
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .upsert({
        name: 'Main Hall',
        slug: 'main-hall',
        description: 'Our main event space with flexible seating arrangements',
        address: '123 Community Street, Demo City, DC1 2AB',
        capacity: 50,
        organizationId: organization.id
      }, {
        onConflict: 'organizationId,slug'
      })
      .select()
      .single()

    if (venueError) {
      throw new Error(`Failed to create venue: ${venueError.message}`)
    }

    console.log('✅ Venue created:', venue.name)

    // Create a basic seating layout
    const { data: seatingLayout, error: layoutError } = await supabase
      .from('seating_layouts')
      .upsert({
        name: 'Standard Layout',
        description: 'Flexible event seating - 5 rows, 10 seats per row',
        rows: 5,
        columns: 10,
        layoutData: {
          type: 'grid',
          sections: [
            {
              name: 'Main',
              startRow: 1,
              endRow: 5,
              startSeat: 1,
              endSeat: 10
            }
          ]
        },
        venueId: venue.id
      }, {
        onConflict: 'venueId,name'
      })
      .select()
      .single()

    if (layoutError) {
      throw new Error(`Failed to create seating layout: ${layoutError.message}`)
    }

    console.log('✅ Seating layout created:', seatingLayout.name)

    // Create seats for the layout (5 rows of 10 seats each)
    const seats = []
    for (let row = 1; row <= 5; row++) {
      const rowLetter = String.fromCharCode(64 + row) // A, B, C, D, E
      for (let seat = 1; seat <= 10; seat++) {
        seats.push({
          row: rowLetter,
          number: seat.toString(),
          isAccessible: row === 1 && seat <= 2, // First two seats in row A are accessible
          isWheelchairSpace: row === 1 && seat === 1, // First seat is wheelchair space
          seatingLayoutId: seatingLayout.id
        })
      }
    }

    // Create seats in batches
    const { error: seatsError } = await supabase
      .from('seats')
      .upsert(seats, {
        onConflict: 'seatingLayoutId,row,number'
      })

    if (seatsError) {
      throw new Error(`Failed to create seats: ${seatsError.message}`)
    }

    console.log('✅ Created 50 seats (5 rows × 10 seats)')

    // Hash the password
    const hashedPassword = await hashPassword('demo123')

    // Create admin user
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .upsert({
        email: 'admin@democentre.org',
        hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        organizationId: organization.id,
        emailVerified: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single()

    if (userError) {
      throw new Error(`Failed to create admin user: ${userError.message}`)
    }

    console.log('✅ Admin user created:', adminUser.email)

    console.log('\n🎪 EventSeats demo setup completed successfully!')
    console.log('\n📋 Demo credentials:')
    console.log('📧 Email: admin@democentre.org')
    console.log('🔑 Password: demo123')
    console.log('')
    console.log('⚠️  IMPORTANT: Change these credentials before going to production!')
    console.log('\n🌐 Next steps:')
    console.log('1. Visit http://localhost:3000/admin/login')
    console.log('2. Sign in with the credentials above')
    console.log('3. Create your first show and start taking bookings!')
    console.log('\n📚 Documentation: https://eventseats.hannahgoodridge.dev/docs')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seed function if this script is called directly
if (require.main === module) {
  seedAdminUser()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export default seedAdminUser
