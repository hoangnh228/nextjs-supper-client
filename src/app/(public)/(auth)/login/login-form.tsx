'use client'

import { useAppStore } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { useLoginMutation } from '@/queries/useAuth'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const clearTokens = searchParams.get('clearTokens')
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const t = useTranslations('LoginPage')

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (body: LoginBodyType) => {
    // when click submit, react hook form will validate form by zod scheme on client first
    // if not pass, will not call api
    if (loginMutation.isPending) return

    try {
      const res = await loginMutation.mutateAsync(body)
      toast.success(res.payload.message)
      setRole(res.payload.data.account.role)
      setSocket(generateSocketInstance(res.payload.data.accessToken))
      router.push('/manage/dashboard')
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  useEffect(() => {
    if (clearTokens) setRole(undefined)
  }, [clearTokens, setRole])

  return (
    <Card className='mx-auto max-w-sm w-full'>
      <CardHeader>
        <CardTitle className='text-2xl'>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
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
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>{t('email')}</Label>
                      <Input id='email' type='email' placeholder='m@example.com' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>{t('password')}</Label>
                      </div>
                      <Input id='password' type='password' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                {t('login')}
              </Button>
              <Button variant='outline' className='w-full' type='button'>
                {t('loginWithGoogle')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
