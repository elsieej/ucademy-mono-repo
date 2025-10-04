import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import { config } from './constants/config'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
)
app.use(express.json())

const httpServer = createServer(app)

httpServer.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})
