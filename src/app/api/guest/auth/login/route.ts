import guestApiRequest from '@/apiRequests/guest'
import { HttpError } from '@/lib/http'
import { GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { decode } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = (await request.json()) as GuestLoginBodyType
  const cookieStore = await cookies()

  try {
    const { payload } = await guestApiRequest.sLogin(body)
    const { accessToken, refreshToken } = payload.data

    const decodedAccessToken = decode(accessToken) as { exp: number }
    const decodedRefreshToken = decode(refreshToken) as { exp: number }

    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: decodedAccessToken.exp * 1000
    })

    cookieStore.set('refreshToken', refreshToken, {
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

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
