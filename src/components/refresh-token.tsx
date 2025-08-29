'use client'

import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// these paths are not check refresh token
const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token']

export default function RefreshToken() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return

    let interval: NodeJS.Timeout | null = null

    // must check first time, because interval will start after timeOut
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval as NodeJS.Timeout)
        router.push('/logout')
      }
    })

    // timeout interval must be less than expired time of access token
    // eg: access token is expired in 10 seconds, we will check 1s per time
    const timeOut = 1000
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval as NodeJS.Timeout)
            router.push('/logout')
          }
        }),
      timeOut
    )

    return () => clearInterval(interval)
  }, [pathname, router])

  return null
}
