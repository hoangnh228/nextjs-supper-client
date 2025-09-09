'use client'

import socket from '@/lib/socket'
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
        router.push('/login')
      }
    })

    const onRefreshToken = (force?: boolean) =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval as NodeJS.Timeout)
          router.push('/login')
        },
        force
      })

    onRefreshToken()

    // timeout interval must be less than expired time of access token
    // eg: access token is expired in 10 seconds, we will check 1s per time
    const timeOut = 1000
    interval = setInterval(onRefreshToken, timeOut)

    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('refresh-token', onRefreshTokenSocket)

    return () => {
      clearInterval(interval)
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('refresh-token', onRefreshTokenSocket)
    }
  }, [pathname, router])

  return null
}
