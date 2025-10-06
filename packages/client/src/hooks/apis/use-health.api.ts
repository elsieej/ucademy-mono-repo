import { useTRPC } from '@/lib/trpc'
import { useQuery } from '@tanstack/react-query'

export const useHealthQuery = (
  queryOptions?: Parameters<ReturnType<typeof useTRPC>['health']['check']['queryOptions']>[0]
) => {
  const trpc = useTRPC()
  return useQuery(trpc.health.check.queryOptions(queryOptions))
}
