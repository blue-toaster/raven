import type { ReminderTaskPayload } from '#lib/@types'
import { getGuild } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks'
import type { Message } from 'discord.js'

@ApplyOptions<ScheduledTask.Options>({
  bullJobOptions: {
    removeOnComplete: true
  }
})
export default class Reminder extends ScheduledTask {
  public async run({ reminder, user, guild }: ReminderTaskPayload): Promise<boolean | Message<boolean>> {
    const _guild = getGuild(guild)

    if (!_guild?.members.cache.has(user)) return false

    const member = await _guild.members.fetch(user)
    const DM = await member.createDM()

    return await DM.send(`I'm here to remind you from ${_guild.name}!\nreminder: ${reminder}`)
  }
}
