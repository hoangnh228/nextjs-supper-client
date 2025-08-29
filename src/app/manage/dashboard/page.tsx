import accountApiRequest from '@/apiRequests/account'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  const res = await accountApiRequest.sMe(accessToken)

  return <div>{res.payload.data.name}</div>
}
