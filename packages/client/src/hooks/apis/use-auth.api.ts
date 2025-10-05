import { useTRPC } from '@/lib/trpc'
import { useMutation } from '@tanstack/react-query'

export const useAuthRegisterMutation = () => {
  const trpc = useTRPC()
  return useMutation(trpc.auth.register.mutationOptions())
}
