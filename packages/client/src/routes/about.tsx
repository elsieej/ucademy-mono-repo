import { useTRPC } from '@/lib/trpc'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About
})

function About() {
  const trpc = useTRPC()
  const checkQuery = useQuery(trpc.health.check.queryOptions())
  return <div className='p-2'>Hello from About! {checkQuery.data?.status}</div>
}
