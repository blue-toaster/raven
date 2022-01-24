import { Env } from './env/types'

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env { }
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never
  }
}
