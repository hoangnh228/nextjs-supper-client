import http from '@/lib/http'
import { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from '@/schemaValidations/order.schema'

const orderApiRequest = {
  getOrders: () => http.get<GetOrdersResType>('/orders'),
  updateOrder: (id: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`orders/${id}`, body)
}

export default orderApiRequest
