import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserRole } from '../types'
import { ApiError } from './api-utils'

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
    throw new ApiError('Authentication required', 401)
  }

  if (!requiredRoles.includes(token.role as UserRole)) {
    throw new ApiError('Insufficient permissions', 403)
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
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
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
