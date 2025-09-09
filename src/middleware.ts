import { Role } from '@/constants/type'
import { decodeToken } from '@/lib/utils'
import { NextResponse, type NextRequest } from 'next/server'

const manageRoutes = ['/manage']
const guestRoutes = ['/guest']
const onlyOwnerRoutes = ['/manage/accounts']
const privateRoutes = [...manageRoutes, ...guestRoutes, ...onlyOwnerRoutes]
const unAuthRoutes = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value ?? ''
  const refreshToken = request.cookies.get('refreshToken')?.value ?? ''

  // 1. if not authenticated, not allow to access private routes
  if (privateRoutes.some((route) => pathname.startsWith(route)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // 2. if authenticated
  if (refreshToken) {
    // 2.1. if try to access unAuthRoutes, redirect to home page
    if (unAuthRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 2.2. if accessToken is expired, redirect to refresh-token page
    if (privateRoutes.some((route) => pathname.startsWith(route)) && !accessToken) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // 2.3. if not permission, redirect to home page
    const role = decodeToken(accessToken).role
    const isGuestAccessToManageRoutes = role === Role.Guest && manageRoutes.some((route) => pathname.startsWith(route))
    const isNotGuestAccessToGuestRoutes = role !== Role.Guest && guestRoutes.some((route) => pathname.startsWith(route))
    const isNotOwnerAccessToOwnerRoutes =
      role !== Role.Owner && onlyOwnerRoutes.some((route) => pathname.startsWith(route))
    if (isGuestAccessToManageRoutes || isNotGuestAccessToGuestRoutes || isNotOwnerAccessToOwnerRoutes) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/guest/:path*', '/login']
}
