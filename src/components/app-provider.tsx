'use client'

import RefreshToken from '@/components/refresh-token'
import { generateSocketInstance, getAccessTokenFromLocalStorage, removeTokenFromLocalStorage } from '@/lib/utils'
import { decodeToken } from '@/middleware'
import { RoleType } from '@/types/jwt.types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
      // refetchOnMount: false
    }
  }
})

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => {},
  disconnectSocket: () => {}
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>(undefined)
  const [role, setRoleState] = useState<RoleType | undefined>(undefined)
  const count = useRef(0)

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage()
      if (accessToken) {
        const role = decodeToken(accessToken).role
        setRoleState(role)
        setSocket(generateSocketInstance(accessToken))
      }
      count.current++
    }
  }, [])

  const disconnectSocket = () => {
    socket?.disconnect()
    setSocket(undefined)
  }

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role)
    if (!role) {
      removeTokenFromLocalStorage()
    }
  }

  const isAuth = Boolean(role)

  return (
    <AppContext value={{ role, setRole, isAuth, socket, setSocket, disconnectSocket }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext>
  )
}
