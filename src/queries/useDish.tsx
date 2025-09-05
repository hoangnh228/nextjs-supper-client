import { dishApiRequest } from '@/apiRequests/dish'
import { revalidateDishes } from '@/lib/actions'
import { UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useDishListQuery = () => {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: dishApiRequest.list
  })
}

export const useDishQuery = ({ id, enabled }: { id: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['dishes', id],
    queryFn: () => dishApiRequest.getDish(id),
    enabled
  })
}

export const useAddDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequest.add,
    onSuccess: async () => {
      // Invalidate client-side cache
      queryClient.invalidateQueries({ queryKey: ['dishes'] })

      // Option 1: Server Action (preferred for forms)
      await revalidateDishes()
    }
  })
}

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) => dishApiRequest.updateDish(id, body),
    onSuccess: async () => {
      // Invalidate client-side cache
      queryClient.invalidateQueries({ queryKey: ['dishes'], exact: true })

      // Revalidate server-side cache
      await revalidateDishes()
    }
  })
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequest.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] })
    }
  })
}
