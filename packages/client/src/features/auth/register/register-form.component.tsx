import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useId } from 'react'

const RegisterFormComponent = () => {
  const emailInputId = useId()
  const nameInputId = useId()
  const passwordInputId = useId()
  const confirmPasswordInputId = useId()

  return (
    <Card className='border-border shadow-sm'>
      <form>
        <CardContent className='pb-6 space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor={nameInputId} className='text-sm font-medium'>
              Name
            </Label>
            <Input type='text' id={nameInputId} placeholder='enter your name' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor={emailInputId} className='text-sm font-medium'>
              Email
            </Label>
            <Input type='email' id={emailInputId} placeholder='enter your email' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor={passwordInputId} className='text-sm font-medium'>
              Password
            </Label>
            <Input type='password' id={passwordInputId} placeholder='enter your password' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor={confirmPasswordInputId} className='text-sm font-medium'>
              Confirm Password
            </Label>
            <Input type='password' id={confirmPasswordInputId} placeholder='confirm your password' />
          </div>
        </CardContent>

        <CardFooter className='flex flex-col gap-4'>
          <Button type='submit' className='w-full'>
            Register
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default RegisterFormComponent
