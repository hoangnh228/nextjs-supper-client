'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Locale, locales } from '@/config'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function SwitchLanguage() {
  return (
    <Suspense>
      <SwitchLanguageMain />
    </Suspense>
  )
}

export function SwitchLanguageMain() {
  const t = useTranslations('SwitchLanguage')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const handleChange = (value: Locale) => {
    const locale = params.locale
    const newPathname = pathname.replace(`/${locale}`, `/${value}`)
    const fullUrl = `${newPathname}?${searchParams.toString()}`
    router.replace(fullUrl)
    router.refresh()
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className='w-[130px]'>
        <SelectValue placeholder={t('title')} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {t(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
