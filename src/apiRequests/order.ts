import http from '@/lib/http'
import {
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType
} from '@/schemaValidations/order.schema'
import queryString from 'query-string'

const orderApiRequest = {
  getOrders: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      `/orders?${queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString()
      })}`
    ),
  getOrderDetail: (id: number) => http.get<GetOrderDetailResType>(`orders/${id}`),
  updateOrder: (id: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`orders/${id}`, body)
}

export default orderApiRequest
