import envConfig from '@/config'
import { redirect } from '@/i18n/navigation'
import {
  getAccessTokenFromLocalStorage,
  normalizePath,
  removeTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/lib/utils'
import { LoginResType } from '@/schemaValidations/auth.schema'
import Cookies from 'js-cookie'

type CustomOptions = Omit<RequestInit, 'method' | 'body'> & {
  baseUrl?: string
  body?: unknown
}

const ENTITY_ERROR_STATUS = 422
const UNAUTHORIZED_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: unknown
  }

  constructor({ status, payload, message = 'Http Error' }: { status: number; payload: unknown; message?: string }) {
    super(message)
    this.status = status
    this.payload = payload as EntityErrorPayload
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS
  payload: EntityErrorPayload

  constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({ status, payload, message: 'Entity Error' })
    this.status = status
    this.payload = payload
  }
}

let clientLogoutRequest: Promise<Response> | null = null
const isClient = typeof window !== 'undefined'

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined
  if (options?.body instanceof FormData) {
    body = options.body
  } else if (options?.body) {
    body = JSON.stringify(options.body)
  }

  const baseHeaders: { [key: string]: string } = body instanceof FormData ? {} : { 'Content-Type': 'application/json' }

  if (isClient) {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl

  const fullUrl = `${baseUrl}/${normalizePath(url)}`
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    } as HeadersInit,
    body,
    method
  })

  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload
  }

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: typeof ENTITY_ERROR_STATUS
          payload: EntityErrorPayload
        }
      )
    } else if (res.status === UNAUTHORIZED_STATUS) {
      const locale = Cookies.get('NEXT_LOCALE')
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch('/api/auth/logout', {
            method: 'POST',
            body: null,
            headers: {
              ...baseHeaders
            } as HeadersInit
          })
        }

        try {
          await clientLogoutRequest
        } catch (error) {
          console.error(error)
        } finally {
          removeTokenFromLocalStorage()
          clientLogoutRequest = null

          // redirect to login may infinite loop if not process right way
          // because in login page, we call api which need accessToken to be set
          // but if accessToken was removed and redirect to login page, it will infinite loop.
          location.href = `/${locale}/login`
        }
      } else {
        // this is case when access token is not expired yet
        // and we call api in Nextjs server (route handler or server component) to server backend
        const accessToken = (options?.headers as { Authorization?: string }).Authorization?.split('Bearer ')[1]
        redirect({ href: `/logout?accessToken=${accessToken}`, locale: locale as string })
      }
    } else {
      throw new HttpError(data)
    }
  }

  if (isClient) {
    const normalizedUrl = normalizePath(url)
    if (['api/auth/login', 'api/guest/auth/login'].includes(normalizedUrl)) {
      const { accessToken, refreshToken } = (payload as LoginResType).data
      setAccessTokenToLocalStorage(accessToken)
      setRefreshTokenToLocalStorage(refreshToken)
      window.dispatchEvent(new Event('auth-change'))
    } else if (['api/auth/logout', 'api/guest/auth/logout'].includes(normalizedUrl)) {
      removeTokenFromLocalStorage()
      window.dispatchEvent(new Event('auth-change'))
    }
  }

  return data
}

const http = {
  get: <Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) =>
    request<Response>('GET', url, options),
  post: <Response>(url: string, body: unknown, options?: Omit<CustomOptions, 'body'> | undefined) =>
    request<Response>('POST', url, { ...options, body }),
  put: <Response>(url: string, body: unknown, options?: Omit<CustomOptions, 'body'> | undefined) =>
    request<Response>('PUT', url, { ...options, body }),
  delete: <Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) =>
    request<Response>('DELETE', url, { ...options })
}

export default http
