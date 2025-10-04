import { router } from '../trpc'
import { healthRouter } from './health'

export const appRouter = router({
  health: healthRouter
})
