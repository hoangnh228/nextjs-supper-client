'use client'
import { useAppStore } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { useGuestLoginMutation } from '@/queries/useGuest'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function GuestLoginForm() {
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const tableNumber = Number(params.number) || 1
  const token = searchParams.get('token')
  const guestLoginMutation = useGuestLoginMutation()
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber: tableNumber as number
    } as GuestLoginBodyType
  })

  useEffect(() => {
    if (!token) {
      router.push('/')
    }
  }, [token, router])

  const onSubmit = async (body: GuestLoginBodyType) => {
    if (guestLoginMutation.isPending) return
    try {
      const res = await guestLoginMutation.mutateAsync(body)
      setRole(res.payload.data.guest.role)
      setSocket(generateSocketInstance(res.payload.data.accessToken))
      toast.success(res.payload.message)
      router.push('/guest/menu')
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (error) => {
              console.warn(error)
            })}
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='name'>Tên khách hàng</Label>
                      <Input id='name' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
