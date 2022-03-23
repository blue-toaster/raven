import { getGuild } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks'
import type { Snowflake, TextChannel } from 'discord.js'

@ApplyOptions<ScheduledTask.Options>({
  bullJobOptions: {
    removeOnComplete: true
  }
})
export default class EndChannelLock extends ScheduledTask {
  public async run({ channel, guild }: { channel: Snowflake, guild: Snowflake }) {
    const _guild = await getGuild(guild)
    const role = _guild!.roles.everyone
    const _channel: TextChannel = _guild?.channels.cache.get(channel) as TextChannel

    return void _channel.permissionOverwrites.edit(role, { SEND_MESSAGES: true })
  }
}
