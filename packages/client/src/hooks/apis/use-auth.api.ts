import { useTRPC } from '@/lib/trpc'
import { useMutation } from '@tanstack/react-query'

export const useAuthRegisterMutation = (
  mutationOptions?: Parameters<ReturnType<typeof useTRPC>['auth']['register']['mutationOptions']>[0]
) => {
  const trpc = useTRPC()
  return useMutation(trpc.auth.register.mutationOptions(mutationOptions))
}
