import { getGuild } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks'
import type { Guild, Snowflake } from 'discord.js'

@ApplyOptions<ScheduledTask.Options>({
  bullJobOptions: {
    removeOnComplete: true
  }
})
export default class Reminder extends ScheduledTask {
  public async run({ reminder, user, guild }: { reminder: string, user: Snowflake, guild: Guild }) {
    const _guild = await getGuild(guild)

    if (!_guild?.members.cache.has(user)) return false

    const member = await _guild.members.fetch(user)
    const DM = await member.createDM()

    return await DM.send(`I'm here to remind you from ${_guild.name}!\nreminder: ${reminder}`)
  }
}
