import { publicProcedure, router } from '../trpc'

export const usersRouter = router({
  get: publicProcedure.query(() => {
    return {
      id: '1',
      name: 'John Doe'
    }
  })
})
