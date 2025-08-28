import { NextResponse, type NextRequest } from 'next/server'

const privateRoutes = ['/manage']
const unAuthRoutes = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = Boolean(request.cookies.get('accessToken')?.value)

  // if not authenticated, not allow to access private routes
  if (privateRoutes.some((route) => pathname.startsWith(route)) && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // if authenticated, not allow to access unAuthRoutes
  if (unAuthRoutes.some((route) => pathname.startsWith(route)) && isAuth) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/login']
}
