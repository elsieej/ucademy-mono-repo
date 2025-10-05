import { hash, compare } from 'bcrypt'

const SALT_ROUNDS = 10

export const hashPassword = (password: string) => {
  return hash(password, SALT_ROUNDS)
}

export const verifyPassword = (password: string, hashedPassword: string) => {
  return compare(password, hashedPassword)
}
