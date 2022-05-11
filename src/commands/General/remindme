import { RavenCommand } from '#lib/structures/Command'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import { DurationFormatter } from '@sapphire/time-utilities'
import type { Message } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Put a reminder for yourself',
  aliases: ['remind']
})
export class Reminder extends RavenCommand {
  public async messageRun(message: Message, args: RavenCommand.Args) {
    const time = await args.pickResult('time')
    const reminder = await args.restResult('string')


    if (!reminder.success) return await send(message, 'You must provide a reminder!')
    if (!time.success) return await send(message, 'You must provide a time! (i.e. 1d > 1 day, 1m > 1 minute, etc)')

    void this.container.tasks.create('reminder', { reminder: reminder.value, user: message.author.id, guild: message.guild!.id }, time.value)

    return await send(message, `I shall remind you in: ${new DurationFormatter().format(time.value)}`)
  }
}
