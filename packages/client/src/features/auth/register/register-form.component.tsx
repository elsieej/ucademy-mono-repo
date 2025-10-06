import InputWithStrengthPassword from '@/components/custom/input-with-password-strength'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthRegisterMutation } from '@/hooks/apis/use-auth.api'
import { useAuth } from '@/providers/auth.provider'
import { type UserRegisterConfirmPasswordDto, userRegisterConfirmPasswordDto } from '@elsie/models'
import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const RegisterFormComponent = () => {
  const { updateUser } = useAuth()
  const emailInputId = useId()
  const nameInputId = useId()
  const passwordInputId = useId()
  const confirmPasswordInputId = useId()
  const { mutate: register, isPending } = useAuthRegisterMutation({
    meta: {
      successMessage: 'User registered successfully',
      errorMessage: 'Failed to register user'
    },
    onSuccess(data, _1, _2, context) {
      toast.success(context.meta?.successMessage)
      updateUser(data.user)
    },
    onError(_1, _2, _3, context) {
      toast.error(context.meta?.errorMessage)
    }
  })

  const form = useForm<UserRegisterConfirmPasswordDto>({
    resolver: zodResolver(userRegisterConfirmPasswordDto),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = (data: UserRegisterConfirmPasswordDto) => {
    const { name, email, password } = data
    register({ name, email, password })
  }

  return (
    <Card className='border-border shadow-sm'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='pb-6 space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <div className='space-y-2'>
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type='text' id={nameInputId} placeholder='enter your name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

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

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type='password' id={confirmPasswordInputId} placeholder='confirm your password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className='flex flex-col gap-4'>
            <Button type='submit' className='w-full' disabled={isPending}>
              Register
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default RegisterFormComponent
