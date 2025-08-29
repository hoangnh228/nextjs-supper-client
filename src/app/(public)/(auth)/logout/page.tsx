'use client'

import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Logout() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshToken = searchParams.get('refreshToken')
  const accessToken = searchParams.get('accessToken')
  const ref = useRef<ReturnType<typeof useLogoutMutation>['mutateAsync'] | null>(null)

  useEffect(() => {
    if (
      !ref.current &&
      ((refreshToken && refreshToken === getRefreshTokenFromLocalStorage()) ||
        (accessToken && accessToken === getAccessTokenFromLocalStorage()))
    ) {
      ref.current = mutateAsync
      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null
        }, 1000)
        router.push('/login')
      })
    } else {
      router.push('/')
    }
  }, [mutateAsync, router, refreshToken, accessToken])

  return <div>Logging out...</div>
}
