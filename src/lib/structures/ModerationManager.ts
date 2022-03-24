import { getGuild } from '#util'
import { container } from '@sapphire/pieces'
import type { Guild, GuildMember, GuildResolvable } from 'discord.js'

export enum Tasks {
  TemporaryBan = 'endTempban',
  UnlockChannel = 'channelUnlock'
}

const cache = new WeakMap<Guild, ModerationManger>()

export default class ModerationManger {
  public readonly guild: Guild
  public constructor(guild: Guild) {
    this.guild = guild
  }

  public get tasks() {
    return container.tasks
  }
  public async ban(users: GuildMember[], moderator: string, reason: string, duration: number, soft: boolean, silent: boolean) {
    for (const user of users) {
      if (!user.bannable) return

      if (!silent) {
        await this.sendDM(
          user,
          `You have been ${soft ? 'soft banned' : 'banned'} from \`${user.guild.name}\` for: ${reason}`
        )
      }

      void user.ban({ reason: `${moderator} ${ duration ? '[TEMPORARY]' : ''} | ${reason}` })

      if (soft) void user.guild.members.unban(user, 'Soft ban')
    }

    if (duration) return this.addTask(Tasks.TemporaryBan, { users: users.map(u => u.id), guild: this.guild.id }, duration)
  }
  public async kick(users: GuildMember[], moderator: string, reason: string, silent: boolean) {
    for (const user of users) {
      if (!silent) await this.sendDM(user, `You have been kicked from \`${user.guild.name}\` for: ${reason}`)

      void user.kick(`${moderator} | ${reason}`)
    }
  }
  private async sendDM(target: GuildMember, content: string) {
    const dm = await target.createDM()

    return await dm.send(content)
  }
  private addTask(task: Tasks, payload: Record<string, unknown>,  duration: number) {
    this.tasks.create(task, payload, duration)
  }
}

export function getModeration(_guild: GuildResolvable): ModerationManger {
  const guild = getGuild(_guild)
  const cached = cache.get(guild!)
  if (cached !== undefined) return cached

  const manager = new ModerationManger(guild!)

  cache.set(guild!, manager)

  return manager
}
