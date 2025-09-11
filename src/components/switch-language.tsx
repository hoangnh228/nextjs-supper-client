'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Locale, locales } from '@/config'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
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

  const handleChange = (value: Locale) => {
    router.replace(pathname, { locale: value as Locale })
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
