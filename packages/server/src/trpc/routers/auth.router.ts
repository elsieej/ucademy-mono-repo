import { publicProcedure, router } from '../trpc'
import { userRegisterResponseSchema, userRegisterDto, userLoginDto, userLoginResponseSchema } from '@elsie/models'
import { authService } from '../services/auth.service'

export const authRouter = router({
  register: publicProcedure
    .input(userRegisterDto)
    .output(userRegisterResponseSchema)
    .mutation(({ input }) => {
      return authService.register(input)
    }),
  login: publicProcedure
    .input(userLoginDto)
    .output(userLoginResponseSchema)
    .mutation(({ input }) => {
      return authService.login(input)
    })
})
