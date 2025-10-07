import InputWithStrengthPassword from '@/components/custom/input-with-password-strength'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthLoginMutation } from '@/hooks/apis/use-auth.api'
import { useAuth } from '@/providers/auth.provider'
import { type UserLoginDto, userLoginDto } from '@elsie/models'
import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const LoginFormComponent = () => {
  const { login } = useAuth()
  const emailInputId = useId()
  const passwordInputId = useId()
  const { mutate: loginMutation, isPending } = useAuthLoginMutation({
    meta: {
      successMessage: 'User logged in successfully',
      errorMessage: 'Failed to login user'
    },
    onSuccess(data, _1, _2, context) {
      toast.success(context.meta?.successMessage)
      login(data)
    },
    onError(_1, _2, _3, context) {
      toast.error(context.meta?.errorMessage)
    }
  })

  const form = useForm<UserLoginDto>({
    resolver: zodResolver(userLoginDto),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (data: UserLoginDto) => {
    const { email, password } = data
    loginMutation({ email, password })
  }

  return (
    <Card className='border-border shadow-sm'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='pb-6 space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' id={emailInputId} placeholder='enter your email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputWithStrengthPassword id={passwordInputId} placeholder='enter your password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className='flex flex-col gap-4'>
            <Button type='submit' className='w-full' disabled={isPending}>
              Login
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default LoginFormComponent
