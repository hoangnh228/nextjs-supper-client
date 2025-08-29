import { EntityError, HttpError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = <TFieldValues extends FieldValues>({
  error,
  setError
}: {
  error: unknown
  setError?: UseFormSetError<TFieldValues>
}) => {
  if (error instanceof EntityError) {
    error.payload.errors.forEach((error) => {
      setError?.(error.field as Path<TFieldValues>, {
        message: error.message,
        type: 'server'
      })
    })
  } else {
    toast.error((error as HttpError).payload.message ?? 'Something went wrong')
  }
}

export const normalizePath = (path: string) => (path.startsWith('/') ? path.slice(1) : path)

const isBrowser = typeof window !== 'undefined'
export const getAccessTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('accessToken') : null)
export const getRefreshTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem('refreshToken') : null)

export const setAccessTokenToLocalStorage = (accessToken: string) =>
  isBrowser && localStorage.setItem('accessToken', accessToken)
export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
  isBrowser && localStorage.setItem('refreshToken', refreshToken)
