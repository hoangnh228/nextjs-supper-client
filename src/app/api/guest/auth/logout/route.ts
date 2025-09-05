import guestApiRequest from '@/apiRequests/guest'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ message: 'Cannot retrieve access token or refresh token' }, { status: 200 })
  }

  try {
    const res = await guestApiRequest.sLogout({ accessToken, refreshToken })
    return NextResponse.json(res.payload)
  } catch {
    return NextResponse.json({ message: 'Error occurred while calling to API server backend' }, { status: 200 })
  }
}
