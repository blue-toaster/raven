import { getGuild, readSettings } from '#util'
import { container } from '@sapphire/pieces'
import { DurationFormatter } from '@sapphire/time-utilities'
import { Guild, GuildMember, GuildResolvable, MessageEmbed, WebhookClient } from 'discord.js'

enum Tasks {
  TemporaryBan = 'endTempban',
  UnlockChannel = 'channelUnlock'
}

enum ModAction {
  Ban = 'Ban',
  TempBan = 'TempBan',
  SoftBan = 'SoftBan',
  Kick = 'Kick',
}

interface LogContext {
  soft?: boolean
  temporary?: boolean
  reason: string
  moderator: string
  target: string
  time?: number
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

      void user.ban({ reason: `${moderator} ${duration ? '[TEMPORARY]' : ''} | ${reason}` })

      if (soft) void user.guild.members.unban(user, 'Soft ban')

      await this.logAction(soft ? ModAction.SoftBan : duration ? ModAction.TempBan : ModAction.Ban, { moderator, reason, time: duration, soft, target: user.toString(), temporary: Boolean(duration) })
    }

    if (duration) return this.addTask(Tasks.TemporaryBan, { users: users.map(u => u.id), guild: this.guild.id }, duration)
  }
  public async kick(users: GuildMember[], moderator: string, reason: string, silent: boolean) {
    for (const user of users) {
      if (!silent) await this.sendDM(user, `You have been kicked from \`${user.guild.name}\` for: ${reason}`)

      void user.kick(`${moderator} | ${reason}`)

      await this.logAction(ModAction.Kick, { moderator, reason, target: user.toString() })
    }
  }

  private async logAction(action: ModAction, context: LogContext) {
    const settings = await readSettings(this.guild.id)

    if (!settings?.modlog) return null
    const hook = new WebhookClient({ url: settings.modlog })

    const embed = new MessageEmbed()
      .setTitle('Moderation Log')
      .setColor(action === ModAction.Ban ? 'RED' : 'YELLOW')
      .addField('Type', action, true)
      .addField('User', context.target, true)
      .addField('Moderator', context.moderator, true)
      .addField('Reason', context.reason, true)

    if (action === ModAction.TempBan && context.time) {
      const formatted = new DurationFormatter().format(context.time)
      embed.addField('Ends', formatted, true)
    }

    return await hook.send({ embeds: [embed] })
  }

  private async sendDM(target: GuildMember, content: string) {
    const dm = await target.createDM()

    return await dm.send(content)
  }

  private addTask(task: Tasks, payload: Record<string, unknown>, duration: number) {
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
