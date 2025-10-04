import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useId } from 'react'

const LoginFormComponent = () => {
  const emailInputId = useId()
  const passwordInputId = useId()

  return (
    <Card className='border-border shadow-sm'>
      <form>
        <CardContent className='pb-6 space-y-4'>
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
        </CardContent>

        <CardFooter className='flex flex-col gap-4'>
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default LoginFormComponent
