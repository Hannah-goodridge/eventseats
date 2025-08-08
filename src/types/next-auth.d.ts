import { UserRole } from './index'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: UserRole
      organizationId: string
      organization?: {
        id: string
        name: string
        slug: string
      } | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: UserRole
    organizationId: string
    organization?: {
      id: string
      name: string
      slug: string
    } | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    organizationId: string
    organization?: {
      id: string
      name: string
      slug: string
    } | null
  }
}
