'use client'

import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu'
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true
  }
]

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
    const handler = () => setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
    window.addEventListener('auth-change', handler as EventListener)
    return () => window.removeEventListener('auth-change', handler as EventListener)
  }, [])

  if (isAuth === null) return null

  return menuItems.map((item) => {
    if ((item.authRequired && !isAuth) || (!item.authRequired && isAuth)) {
      return null
    }

    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
