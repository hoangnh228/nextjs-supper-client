'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Locale, locales } from '@/config'
import { setUserLocale } from '@/services/locale'
import { useLocale, useTranslations } from 'next-intl'

export default function SwitchLanguage() {
  const t = useTranslations('SwitchLanguage')
  const locale = useLocale()
  const handleChange = (value: Locale) => {
    setUserLocale(value)
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
