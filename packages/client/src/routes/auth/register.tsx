import RegisterFormComponent from '@/features/auth/register/register-form.component'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/register')({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || '/'
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect })
    }
  },
  component: Register
})

function Register() {
  return (
    <>
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-semibold tracking-tight text-foreground mb-2'>Create an account</h1>
        <p className='text-sm text-muted-foreground'>Enter your information to get started</p>
      </div>

      <RegisterFormComponent />

      <p className='text-center text-sm text-muted-foreground mt-6'>
        Already have an account?{' '}
        <Link to='/auth/login' search={{ redirect: '/' }} className='font-medium text-foreground hover:underline'>
          Login
        </Link>
      </p>
    </>
  )
}
