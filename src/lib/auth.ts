import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { supabase } from './supabase'
import { UserRole } from '../types'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user in database
          const { data: user, error } = await supabase
            .from('users')
            .select(`
              id,
              email,
              name,
              role,
              hashedPassword,
              organizationId
            `)
            .eq('email', credentials.email)
            .single()

          if (error || !user) {
            console.error('User lookup error:', error)
            return null
          }

          // Get organization separately to avoid join issues
          const { data: organization } = await supabase
            .from('organizations')
            .select('id, name, slug')
            .eq('id', user.organizationId)
            .single()

          if (!user.hashedPassword) {
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          )

          if (!isPasswordValid) {
            return null
          }

          // Return user object (password excluded)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            organizationId: user.organizationId,
            organization: organization || null
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.role = user.role
        token.organizationId = user.organizationId
        token.organization = user.organization
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.organizationId = token.organizationId as string
        session.user.organization = token.organization as any
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login?error=true'
  }
})

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Helper function to verify passwords
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Helper function to create admin user (Supabase version)
export async function createAdminUser(
  email: string,
  password: string,
  name: string,
  organizationId: string
) {
  const hashedPassword = await hashPassword(password)

  const userId = randomUUID()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email,
      hashedPassword,
      name,
      role: 'ADMIN' as UserRole,
      organizationId,
      emailVerified: now,
      createdAt: now,
      updatedAt: now
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
