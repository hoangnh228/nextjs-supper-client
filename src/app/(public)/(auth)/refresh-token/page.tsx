'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function RefreshToken() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshToken = searchParams.get('refreshToken')
  const redirectPath = searchParams.get('redirect')

  useEffect(() => {
    if (refreshToken && refreshToken === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => router.push(redirectPath ?? '/')
      })
    } else {
      router.push('/')
    }
  }, [router, refreshToken, redirectPath])

  return <div>Refreshing token...</div>
}
