import LoginForm from '@/app/[locale]/(public)/(auth)/login/login-form'
import envConfig, { Locale } from '@/config'
import { htmlToTextForDescription } from '@/lib/utils-server'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = await getTranslations('LoginPage')
  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/login`

  return {
    title: t('title'),
    description: htmlToTextForDescription(t('description')),
    alternates: {
      canonical: url
    }
  }
}

export default function Login() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
