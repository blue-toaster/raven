import type { PrismaClient } from '@prisma/client'
import { Env } from './env/types'

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env { }
  }
}

declare module 'discord.js' {
  interface Client {
    prisma: PrismaClient
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never
  }
}
