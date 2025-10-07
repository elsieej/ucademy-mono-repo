import { useHealthQuery } from '@/hooks/apis/use-health.api'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/about')({
  component: AboutPage
})

function AboutPage() {
  const checkQuery = useHealthQuery()

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-4xl font-bold mb-4'>About</h1>
        <p className='text-muted-foreground'>Learn more about this application</p>
      </div>

      <div className='border rounded-lg p-6'>
        <h2 className='text-2xl font-semibold mb-4'>Server Status</h2>
        <p className='text-sm text-muted-foreground mb-2'>Health Check:</p>
        {checkQuery.isLoading ? (
          <p className='text-muted-foreground'>Checking...</p>
        ) : checkQuery.isError ? (
          <p className='text-destructive'>Error checking server status</p>
        ) : (
          <p className='text-green-600 font-semibold'>{checkQuery.data?.status}</p>
        )}
      </div>

      <div className='border rounded-lg p-6'>
        <h2 className='text-2xl font-semibold mb-4'>Features</h2>
        <ul className='space-y-2'>
          <li className='flex items-center gap-2'>
            <span className='text-green-600'>✓</span> Authentication & Authorization
          </li>
          <li className='flex items-center gap-2'>
            <span className='text-green-600'>✓</span> tRPC API Integration
          </li>
          <li className='flex items-center gap-2'>
            <span className='text-green-600'>✓</span> Token Refresh Flow
          </li>
          <li className='flex items-center gap-2'>
            <span className='text-green-600'>✓</span> Protected Routes
          </li>
        </ul>
      </div>
    </div>
  )
}
