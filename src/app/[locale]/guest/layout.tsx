import PublicLayout from '@/app/[locale]/(public)/layout'

export default function GuestLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PublicLayout modal={null}>{children}</PublicLayout>
}
