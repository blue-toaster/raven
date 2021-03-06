/**
 * @license Apache License, Version 2.0
 * @copyright Skyra Project
 *
 * Changes made: Renamed types
 */

export type BooleanString = 'true' | 'false'
export type IntegerString = `${bigint}`

export type EnvAny = keyof Env
export type EnvString = { [K in EnvAny]: Env[K] extends BooleanString | IntegerString ? never : K }[EnvAny]
export type EnvBoolean = { [K in EnvAny]: Env[K] extends BooleanString ? K : never }[EnvAny]
export type EnvInteger = { [K in EnvAny]: Env[K] extends IntegerString ? K : never }[EnvAny]

export interface Env {
  DISCORD_TOKEN: string
  PREFIX: string
  OWNERS: string
  TRN_API_KEY: string
  INFLUX_ENABLED: BooleanString
  INFLUX_ORG: string
  INFLUX_BUCKET: string
  INFLUX_URL: string
  INFLUX_TOKEN: string
  REDIS_HOST: string
  REDIS_PASSWD: string
  REDIS_PORT: IntegerString
  REDIS_DB: IntegerString
}
