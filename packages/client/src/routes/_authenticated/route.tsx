import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth.provider'
import { createFileRoute, Link, Outlet, redirect, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    // Wait for auth check to complete
    if (context.auth.isLoading) {
      return
    }

    // Redirect to login if not authenticated
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/auth/login', search: { redirect: location.href } })
    }
  },
  component: AuthenticatedLayout
})

function AuthenticatedLayout() {
  const auth = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    auth.logout()
    router.navigate({ to: '/auth/login' })
  }

  // Show loading while checking auth
  if (auth.isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Shared Header */}
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-8'>
            <Link to='/' className='text-xl font-bold'>
              My App
            </Link>
            <nav className='flex items-center gap-4'>
              <Link
                to='/'
                className='text-sm font-medium transition-colors hover:text-primary'
                activeProps={{ className: 'text-primary' }}
              >
                Home
              </Link>
              <Link
                to='/about'
                className='text-sm font-medium transition-colors hover:text-primary'
                activeProps={{ className: 'text-primary' }}
              >
                About
              </Link>
            </nav>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-muted-foreground'>Welcome, {auth.user?.name}</span>
            <Button variant='outline' size='sm' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Child routes render here */}
      <main className='flex-1 container mx-auto px-4 py-8'>
        <Outlet />
      </main>

      {/* Shared Footer */}
      <footer className='border-t py-6 text-center text-sm text-muted-foreground'>
        <p>&copy; 2025 My App. All rights reserved.</p>
      </footer>
    </div>
  )
}
