import { useTRPC } from '@/lib/trpc'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAuthGetMeQuery = (
  queryOptions?: Parameters<ReturnType<typeof useTRPC>['auth']['getMe']['queryOptions']>[0]
) => {
  const trpc = useTRPC()
  return useQuery(trpc.auth.getMe.queryOptions(queryOptions))
}

export const useAuthRegisterMutation = (
  mutationOptions?: Parameters<ReturnType<typeof useTRPC>['auth']['register']['mutationOptions']>[0]
) => {
  const trpc = useTRPC()
  return useMutation(trpc.auth.register.mutationOptions(mutationOptions))
}

export const useAuthLoginMutation = (
  mutationOptions?: Parameters<ReturnType<typeof useTRPC>['auth']['login']['mutationOptions']>[0]
) => {
  const trpc = useTRPC()
  return useMutation(trpc.auth.login.mutationOptions(mutationOptions))
}

export const useAuthRefreshMutation = (
  mutationOptions?: Parameters<ReturnType<typeof useTRPC>['auth']['refresh']['mutationOptions']>[0]
) => {
  const trpc = useTRPC()
  return useMutation(trpc.auth.refresh.mutationOptions(mutationOptions))
}
