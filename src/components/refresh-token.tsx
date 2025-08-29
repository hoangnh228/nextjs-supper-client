'use client'

import authApiRequest from '@/apiRequests/auth'
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/lib/utils'
import { decode } from 'jsonwebtoken'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// these paths are not check refresh token
const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token']

export default function RefreshToken() {
  const pathname = usePathname()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return

    let interval: NodeJS.Timeout | null = null
    const checkAndRefreshToken = async () => {
      // should not take logic get access and refresh token out of this function (checkAndRefreshToken)
      // because to each time checkAndRefreshToken called, we will have a new access and refresh token
      // to avoid issue get old access and refresh token and use in next request
      const accessToken = getAccessTokenFromLocalStorage()
      const refreshToken = getRefreshTokenFromLocalStorage()

      // if not logged in
      if (!accessToken || !refreshToken) return

      const decodedAccessToken = decode(accessToken) as { exp: number; iat: number }
      const decodedRefreshToken = decode(refreshToken) as { exp: number; iat: number }

      // token time is calculated in epoch time (seconds)
      // when use new Date().getTime(), it will return epoch time (milliseconds)
      const now = Math.round(new Date().getTime() / 1000)

      // if access token is expired, dont process anymore
      if (decodedAccessToken.exp <= now) return

      // eg: access token is expired in 10 seconds
      // we will check if 1/3 time left, we will refresh token
      // time left is calculated by: decodedAccessToken.exp - now
      // expired time is calculated by: decodedAccessToken.exp - decodedAccessToken.iat
      if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
        try {
          const res = await authApiRequest.refreshToken()
          setAccessTokenToLocalStorage(res.payload.data.accessToken)
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
        } catch {
          clearInterval(interval as NodeJS.Timeout)
        }
      }
    }

    // must check first time, because interval will start after timeOut
    checkAndRefreshToken()

    // timeout interval must be less than expired time of access token
    // eg: access token is expired in 10 seconds, we will check 1s per time
    const timeOut = 1000
    interval = setInterval(checkAndRefreshToken, timeOut)

    return () => clearInterval(interval)
  }, [pathname])

  return null
}
