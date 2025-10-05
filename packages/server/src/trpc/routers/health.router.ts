import { publicProcedure, router } from '../trpc'
import healthService from '../services/heath.service'

export const healthRouter = router({
  check: publicProcedure.query(() => {
    return healthService.check()
  })
})
