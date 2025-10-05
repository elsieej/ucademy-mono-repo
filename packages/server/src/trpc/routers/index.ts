import { router } from '../trpc'
import { healthRouter } from './health.router'
import { authRouter } from './auth.router'
import { usersRouter } from './users.router'

export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
  users: usersRouter
})
