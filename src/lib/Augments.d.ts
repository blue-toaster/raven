import type { PrismaClient } from '@prisma/client'
import type { Piece } from '@sapphire/framework'
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

declare module '@sapphire/pieces' {
  interface Container {
    prisma: PrismaClient
    analytics?: AnalyiticData | Nullish
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never
  }

  interface ArgType {
    duration: Date
    time: number
    piece: Piece
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env { }
  }
}
