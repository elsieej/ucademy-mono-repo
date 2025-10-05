import { publicProcedure, router } from '../trpc'
import { userRegisterResponseSchema, userRegisterDto } from '@elsie/models'
import { authService } from '../services/auth.service'

export const authRouter = router({
  register: publicProcedure
    .input(userRegisterDto)
    .output(userRegisterResponseSchema)
    .mutation(({ input }) => {
      return authService.register(input)
    })
})
