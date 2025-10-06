import { protectedProcedure, publicProcedure, router } from '../trpc'
import {
  userRegisterResponseSchema,
  userRegisterDto,
  userLoginDto,
  userLoginResponseSchema,
  userResponseSchema,
  refreshTokenDto,
  tokenResponseSchema
} from '@elsie/models'
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
    }),
  refresh: publicProcedure
    .input(refreshTokenDto)
    .output(tokenResponseSchema)
    .mutation(({ input }) => {
      return authService.refresh(input)
    }),
  getMe: protectedProcedure.output(userResponseSchema).query(({ ctx }) => {
    return ctx.user
  })
})
