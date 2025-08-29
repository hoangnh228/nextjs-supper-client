'use client'

import RefreshToken from '@/components/refresh-token'
import { getAccessTokenFromLocalStorage, removeTokenFromLocalStorage } from '@/lib/utils'
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
  setIsAuth: (isAuth: boolean) => void
}>({
  isAuth: false,
  setIsAuth: () => {}
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuthState] = useState(false)
  const setIsAuth = (isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true)
    } else {
      setIsAuthState(false)
      removeTokenFromLocalStorage()
    }
  }

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) setIsAuth(true)
  }, [])

  return (
    <AppContext value={{ isAuth, setIsAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext>
  )
}
