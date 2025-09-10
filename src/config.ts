import { z } from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string()
})

export const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL
})

if (!configProject.success) {
  console.error(configProject.error)
  throw new Error('Invalid environment variables')
}

const envConfig = configProject.data
export default envConfig

export type Locale = (typeof locales)[number]

export const locales = ['vi', 'en'] as const
export const defaultLocale: Locale = 'vi'
