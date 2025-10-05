import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import { config } from './constants/config'
import { logger } from './lib/pino'
import { createContext } from './trpc/context'
import { appRouter } from './trpc/routers'

export type AppRouter = typeof appRouter

const app = express()
app.use(
  cors({
    origin: config.corsOrigin
  })
)
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
  logger.info({ port }, `[SERVER] is running on port ${port}`)
})
