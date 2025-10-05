import { db } from '@/lib/db'
import { logger } from '@/lib/pino'
import { tryCatch } from '@/utils/try-catch'
import { sql } from 'drizzle-orm'

const healthService = {
  check: async () => {
    const [_, error] = await tryCatch(db.execute(sql`SELECT 1`))

    if (error) {
      logger.error(error, '[SERVER][HEALTH] health check failed')
      return {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        services: {
          api: 'healthy',
          db: 'unhealthy'
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        db: 'healthy'
      }
    }
  }
}

export default healthService
