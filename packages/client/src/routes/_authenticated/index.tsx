import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth.provider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: HomePage
})

function HomePage() {
  const auth = useAuth()

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-4xl font-bold mb-4'>Welcome to Your Dashboard</h1>
        <p className='text-muted-foreground'>You're logged in as {auth.user?.email}</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Profile</h3>
          <p className='text-sm text-muted-foreground mb-4'>Manage your account settings</p>
          <Button variant='outline' size='sm'>
            View Profile
          </Button>
        </div>

        <div className='border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Settings</h3>
          <p className='text-sm text-muted-foreground mb-4'>Configure your preferences</p>
          <Button variant='outline' size='sm'>
            Open Settings
          </Button>
        </div>

        <div className='border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-2'>Help</h3>
          <p className='text-sm text-muted-foreground mb-4'>Get support and documentation</p>
          <Button variant='outline' size='sm'>
            Get Help
          </Button>
        </div>
      </div>
    </div>
  )
}
