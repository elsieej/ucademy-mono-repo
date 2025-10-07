import { UserResponseSchema, UserId } from '@elsie/models'

type CachedUser = {
  user: UserResponseSchema
  timestamp: number
}

class UserCache {
  private cache: Map<UserId, CachedUser> = new Map()
  private readonly TTL = 60000 // 1 minute

  set(userId: UserId, user: UserResponseSchema): void {
    this.cache.set(userId, {
      user,
      timestamp: Date.now()
    })
  }

  get(userId: UserId): UserResponseSchema | null {
    const cached = this.cache.get(userId)

    if (!cached) {
      return null
    }

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(userId)
      return null
    }

    return cached.user
  }

  invalidate(userId: UserId): void {
    this.cache.delete(userId)
  }

  clear(): void {
    this.cache.clear()
  }

  // Cleanup expired entries periodically
  startCleanup(interval: number = 5 * 60 * 1000): NodeJS.Timeout {
    return setInterval(() => {
      const now = Date.now()
      for (const [userId, cached] of this.cache.entries()) {
        if (now - cached.timestamp > this.TTL) {
          this.cache.delete(userId)
        }
      }
    }, interval)
  }
}

export const userCache = new UserCache()
