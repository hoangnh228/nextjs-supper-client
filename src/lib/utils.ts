import authApiRequest from '@/apiRequests/auth'
import guestApiRequest from '@/apiRequests/guest'
import envConfig from '@/config'
import { DishStatus, OrderStatus, Role, TableStatus } from '@/constants/type'
import { EntityError, HttpError } from '@/lib/http'
import { TokenPayload } from '@/types/jwt.types'
import { clsx, type ClassValue } from 'clsx'
import { format } from 'date-fns'
import { decode } from 'jsonwebtoken'
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'
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
export const removeTokenFromLocalStorage = () =>
  isBrowser && localStorage.removeItem('accessToken') && localStorage.removeItem('refreshToken')

export const checkAndRefreshToken = async (param?: {
  onError?: () => void
  onSuccess?: () => void
  force?: boolean
}) => {
  // should not take logic get access and refresh token out of this function (checkAndRefreshToken)
  // because to each time checkAndRefreshToken called, we will have a new access and refresh token
  // to avoid issue get old access and refresh token and use in next request
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()

  // if not logged in
  if (!accessToken || !refreshToken) return

  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)

  // token time is calculated in epoch time (seconds)
  // when use new Date().getTime(), it will return epoch time (milliseconds)
  const now = new Date().getTime() / 1000 - 1

  // if refresh token is expired, logout
  // decodedRefreshToken.exp = 10s
  // new Date().getTime() / 1000 = 9.5s
  if (decodedRefreshToken.exp <= now) {
    removeTokenFromLocalStorage()
    return param?.onError?.()
  }

  // eg: access token is expired in 10 seconds
  // we will check if 1/3 time left, we will refresh token
  // time left is calculated by: decodedAccessToken.exp - now
  // expired time is calculated by: decodedAccessToken.exp - decodedAccessToken.iat
  if (param?.force || decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    try {
      const role = decodedAccessToken.role
      const res = await (role === Role.Guest ? guestApiRequest : authApiRequest).refreshToken()
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      param?.onSuccess?.()
    } catch {
      param?.onError?.()
    }
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) =>
  envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token

export const decodeToken = (token: string) => decode(token) as TokenPayload

export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}
