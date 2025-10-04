import LoginFormComponent from '@/features/auth/login/login-form.component'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/'
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect })
    }
  },
  component: Login
})

function Login() {
  return (
    <>
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-semibold tracking-tight text-foreground mb-2'>Welcome back</h1>
        <p className='text-sm text-muted-foreground'>Enter your email and password to login</p>
      </div>

      <LoginFormComponent />

      <p className='text-center text-sm text-muted-foreground mt-6'>
        Don't have an account?{' '}
        <Link to='/auth/register' search={{ redirect: '/' }} className='font-medium text-foreground hover:underline'>
          Sign up
        </Link>
      </p>
    </>
  )
}
