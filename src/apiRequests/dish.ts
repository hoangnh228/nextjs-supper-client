import http from '@/lib/http'
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'

export const dishApiRequest = {
  list: () => http.get<DishListResType>('dishes', { next: { tags: ['dishes'] } }),
  getDish: (id: number) => http.get<DishResType>(`dishes/${id}`),
  add: (body: CreateDishBodyType) => http.post<DishResType>(`dishes`, body),
  updateDish: (id: number, body: UpdateDishBodyType) => http.put<DishResType>(`dishes/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`dishes/${id}`)
}
