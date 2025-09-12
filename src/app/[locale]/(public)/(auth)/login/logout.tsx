'use client'

import { useAppStore } from '@/components/app-provider'
import { useRouter } from '@/i18n/navigation'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

function LogoutComponent() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshToken = searchParams.get('refreshToken')
  const accessToken = searchParams.get('accessToken')
  const ref = useRef<ReturnType<typeof useLogoutMutation>['mutateAsync'] | null>(null)
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)

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
        setRole(undefined)
        disconnectSocket()
      })
    } else if (accessToken !== getAccessTokenFromLocalStorage()) {
      router.push('/')
    }
  }, [mutateAsync, router, refreshToken, accessToken, setRole, disconnectSocket])

  return null
}

export default function Logout() {
  return (
    <Suspense>
      <LogoutComponent />
    </Suspense>
  )
}
