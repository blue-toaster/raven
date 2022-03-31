import type { Snowflake } from 'discord.js'

export interface TempBanTaskPayload {
  users: Snowflake[]
  guild: Snowflake
}

export interface ChannelUnlockTaskPayload {
  guild: Snowflake
  channel: Snowflake
}

export interface ReminderTaskPayload {
  reminder: string
  user: Snowflake
  guild: Snowflake
}
