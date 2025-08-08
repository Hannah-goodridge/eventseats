import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserRole } from '../types'

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
    email: string
    name?: string | null
    role: UserRole
    organizationId: string
    organization: {
      id: string
      name: string
      slug: string
    }
  }
}

export async function requireAuth(
  request: NextRequest,
  requiredRoles: UserRole[] = [UserRole.ADMIN, UserRole.STAFF]
): Promise<AuthenticatedRequest> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (!token) {
    throw new Error('Authentication required')
  }

  if (!requiredRoles.includes(token.role as UserRole)) {
    throw new Error('Insufficient permissions')
  }

  // Add user to request
  const authenticatedRequest = request as AuthenticatedRequest
  authenticatedRequest.user = {
    id: token.sub!,
    email: token.email!,
    name: token.name,
    role: token.role as UserRole,
    organizationId: token.organizationId as string,
    organization: token.organization as any
  }

  return authenticatedRequest
}

export async function requireAdminAuth(request: NextRequest): Promise<AuthenticatedRequest> {
  return requireAuth(request, [UserRole.ADMIN])
}

export async function requireStaffAuth(request: NextRequest): Promise<AuthenticatedRequest> {
  return requireAuth(request, [UserRole.ADMIN, UserRole.STAFF])
}

export function withAuth<T extends any[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<NextResponse>,
  requiredRoles: UserRole[] = [UserRole.ADMIN, UserRole.STAFF]
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const authenticatedRequest = await requireAuth(request, requiredRoles)
      return await handler(authenticatedRequest, ...args)
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

export function withAdminAuth<T extends any[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<NextResponse>
) {
  return withAuth(handler, [UserRole.ADMIN])
}

export function withStaffAuth<T extends any[]>(
  handler: (request: AuthenticatedRequest, ...args: T) => Promise<NextResponse>
) {
  return withAuth(handler, [UserRole.ADMIN, UserRole.STAFF])
}
