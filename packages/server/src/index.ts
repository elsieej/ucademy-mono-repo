import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { createServer } from 'http'
import { config } from './constants/config'
import { logger } from './libs/pino'
import { createContext } from './trpc/context'
import { appRouter } from './trpc/routers'

const app = express()
const port = config.port
const httpServer = createServer(app)

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext
  })
)

httpServer.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
