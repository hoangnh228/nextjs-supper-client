'use client'

import RefreshToken from '@/components/refresh-token'
import { decodeToken, getAccessTokenFromLocalStorage, removeTokenFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { createContext, useContext, useEffect, useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
})

const AppContext = createContext<{
  isAuth: boolean
  role: RoleType | undefined
  setRole: (role?: RoleType | undefined) => void
}>({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: () => {}
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined)

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodeToken(accessToken).role
      setRoleState(role)
    }
  }, [])

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role)
    if (!role) {
      removeTokenFromLocalStorage()
    }
  }

  const isAuth = Boolean(role)

  return (
    <AppContext value={{ role, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext>
  )
}
