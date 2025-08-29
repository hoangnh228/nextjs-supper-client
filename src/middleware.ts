import { NextResponse, type NextRequest } from 'next/server'

const privateRoutes = ['/manage']
const unAuthRoutes = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value ?? ''
  const refreshToken = request.cookies.get('refreshToken')?.value ?? ''

  // if not authenticated, not allow to access private routes
  if (privateRoutes.some((route) => pathname.startsWith(route)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // if authenticated, not allow to access unAuthRoutes
  if (unAuthRoutes.some((route) => pathname.startsWith(route)) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // if authenticated, but accessToken is expired, redirect to logout page
  if (privateRoutes.some((route) => pathname.startsWith(route)) && !accessToken && refreshToken) {
    const url = new URL('/refresh-token', request.url)
    url.searchParams.set('refreshToken', refreshToken)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/login']
}
