import { useTRPC } from '@/lib/trpc'
import type { UserRegisterResponseSchema } from '@elsie/models'
import { useMutation } from '@tanstack/react-query'

export const useAuthRegisterMutation = (onSuccess?: (data: UserRegisterResponseSchema) => void) => {
  const trpc = useTRPC()
  return useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess
    })
  )
}
