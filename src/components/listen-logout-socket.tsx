import { useAppContext } from '@/components/app-provider'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token']
export default function ListenLogoutSocket() {
  const { mutateAsync, isPending } = useLogoutMutation()
  const { setRole, disconnectSocket, socket } = useAppContext()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return

    async function onLogout() {
      if (isPending) return
      try {
        await mutateAsync()
        setRole(undefined)
        disconnectSocket()
        router.push('/login')
      } catch (error: unknown) {
        handleErrorApi({ error })
      }
    }

    socket?.on('logout', onLogout)

    return () => {
      socket?.off('logout', onLogout)
    }
  }, [socket, pathname, mutateAsync, isPending, setRole, disconnectSocket, router])
  return null
}
