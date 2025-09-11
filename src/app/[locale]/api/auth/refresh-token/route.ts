import authApiRequest from '@/apiRequests/auth'
import { HttpError } from '@/lib/http'
import { decode } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) {
    return NextResponse.json({ message: 'Refresh token not found' }, { status: 401 })
  }

  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken })

    const decodedAccessToken = decode(payload.data.accessToken) as { exp: number }
    const decodedRefreshToken = decode(payload.data.refreshToken) as { exp: number }

    cookieStore.set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: decodedAccessToken.exp * 1000
    })

    cookieStore.set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: decodedRefreshToken.exp * 1000
    })

    return NextResponse.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(error.payload, {
        status: error.status
      })
    }

    return NextResponse.json({ message: (error as Error).message ?? 'Internal server error' }, { status: 401 })
  }
}
