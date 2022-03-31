import type { TempBanTaskPayload } from '#lib/@types'
import { getGuild } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks'

@ApplyOptions<ScheduledTask.Options>({
  bullJobOptions: {
    removeOnComplete: true
  }
})
export default class endTempBan extends ScheduledTask {
  public run({ users, guild }: TempBanTaskPayload) {
    const _guild = getGuild(guild)

    if (!_guild?.me!.permissions.has('BAN_MEMBERS')) return false

    users.forEach(user => {
      void _guild?.members.unban(user, 'Temp Ban ended')
    })

    return true
  }
}
