import { useAuth } from '@/providers/auth.provider'
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    // Redirect to home if authenticated (and not loading)
    if (!context.auth.isLoading && context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent
})

function RouteComponent() {
  const auth = useAuth()
  const navigate = useNavigate()

  // Redirect if user becomes authenticated (after loading completes)
  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate])

  // Don't render anything while loading OR if already authenticated
  // This prevents flash of login form when already authenticated
  if (auth.isLoading || auth.isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background px-4'>
        <div className='text-center'>
          <p className='text-muted-foreground'>{auth.isLoading ? 'Checking authentication...' : 'Redirecting...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <div className='w-full max-w-md'>
        <Outlet />
      </div>
    </div>
  )
}
