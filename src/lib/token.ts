import { TokenPayload } from '@/types/jwt.types'
import { decode } from 'jsonwebtoken'

export const decodeToken = (token: string) => decode(token) as TokenPayload
