// import { getUserLocale } from '@/services/locale'
// import { getRequestConfig } from 'next-intl/server'

// export default getRequestConfig(async () => {
//   // Static for now, we'll change this later
//   const locale = await getUserLocale()

//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default
//   }
// })

import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
