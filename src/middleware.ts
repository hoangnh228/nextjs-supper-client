import { defaultLocale, locales } from '@/config'
import { Role } from '@/constants/type'
import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { decodeToken } from './lib/token'

const manageRoutes = ['/vi/manage', '/en/manage']
const guestRoutes = ['/vi/guest', '/en/guest']
const onlyOwnerRoutes = ['/vi/manage/accounts', '/en/manage/accounts']
const privateRoutes = [...manageRoutes, ...guestRoutes, ...onlyOwnerRoutes]
const unAuthRoutes = ['/vi/login', '/en/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files, API routes, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale
  })

  const response = handleI18nRouting(request)

  const accessToken = request.cookies.get('accessToken')?.value ?? ''
  const refreshToken = request.cookies.get('refreshToken')?.value ?? ''

  // 1. if not authenticated, not allow to access private routes
  if (privateRoutes.some((route) => pathname.startsWith(route)) && !refreshToken) {
    // Get locale from pathname or use default
    const locale = pathname.startsWith('/en') ? 'en' : 'vi'
    const url = new URL(`/${locale}/login`, request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // 2. if authenticated
  if (refreshToken) {
    // 2.1. if try to access unAuthRoutes, redirect to home page
    if (unAuthRoutes.some((route) => pathname.startsWith(route))) {
      // return NextResponse.redirect(new URL('/', request.url))
      response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
      return response
    }

    // 2.2. if accessToken is expired, redirect to refresh-token page
    if (privateRoutes.some((route) => pathname.startsWith(route)) && !accessToken) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      // return NextResponse.redirect(url)
      response.headers.set('x-middleware-rewrite', url.toString())
      return response
    }

    // 2.3. if not permission, redirect to home page
    const role = decodeToken(accessToken).role
    const isGuestAccessToManageRoutes = role === Role.Guest && manageRoutes.some((route) => pathname.startsWith(route))
    const isNotGuestAccessToGuestRoutes = role !== Role.Guest && guestRoutes.some((route) => pathname.startsWith(route))
    const isNotOwnerAccessToOwnerRoutes =
      role !== Role.Owner && onlyOwnerRoutes.some((route) => pathname.startsWith(route))
    if (isGuestAccessToManageRoutes || isNotGuestAccessToGuestRoutes || isNotOwnerAccessToOwnerRoutes) {
      // return NextResponse.redirect(new URL('/', request.url))
      response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
      return response
    }
  }

  // return NextResponse.next()
  return response
}

// Middleware matcher configuration for Next.js 15
// export const matcher = ['/manage/:path*', '/guest/:path*', '/login']
export const matcher = [
  // Match all pathnames except for static files and API routes
  '/((?!_next/static|_next/image|favicon.ico).*)'
]
