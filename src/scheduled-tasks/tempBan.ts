import { getGuild } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks'
import type { Snowflake } from 'discord.js'

@ApplyOptions<ScheduledTask.Options>({
  bullJobOptions: {
    removeOnComplete: true
  }
})
export default class endTempban extends ScheduledTask {
  public async run({ users, guild }: { users: Snowflake[], guild: Snowflake }) {
    const _guild = await getGuild(guild)

    if (!_guild?.me!.permissions.has('BAN_MEMBERS')) return false

    users.forEach(user => {
      void _guild?.members.unban(user, 'Temp Ban ended')
    })

    return true
  }
}
