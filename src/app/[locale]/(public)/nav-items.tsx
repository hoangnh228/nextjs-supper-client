'use client'

import { useAppStore } from '@/components/app-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Role } from '@/constants/type'
import { cn } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const menuItems: {
  title: string
  href: string
  role?: RoleType[]
  hideWhenLogin?: boolean
}[] = [
  {
    title: 'Trang chủ',
    href: '/'
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLogin: true
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavItems({ className }: { className?: string }) {
  // const { role, setRole, disconnectSocket } = useAppStore((state) => state)
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)

  const logoutMutation = useLogoutMutation()
  const router = useRouter()

  const handleLogout = async () => {
    await logoutMutation.mutateAsync()
    setRole(undefined)
    disconnectSocket()
    router.push('/login')
  }

  return (
    <>
      {menuItems.map((item) => {
        // logged in only show logged in items
        const isAuth = item.role && role && item.role.includes(role)

        // menu show no matter logged in or not
        const isShow = (item.role === undefined && !item.hideWhenLogin) || (!role && item.hideWhenLogin)

        if (isAuth || isShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }

        return null
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>Đăng xuất</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn đăng xuất không? Việc đăng xuất có thể làm mất thông tin hóa đơn và bàn ăn đã đặt.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Đăng xuất</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
