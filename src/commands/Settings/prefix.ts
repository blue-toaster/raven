import { envParseString } from '#lib/env'
import Command from '#lib/structures/Command'
import { ApplyOptions } from '@sapphire/decorators'
import type { Args } from '@sapphire/framework'
import { send } from '@sapphire/plugin-editable-commands'
import type { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands'
import type { Message } from 'discord.js'

@ApplyOptions<SubCommandPluginCommandOptions>({
  description: 'Set guild prefix',
  subCommands: ['set', 'reset', { input: 'show', default: true }]
})
export class Prefix extends Command {
  public async show(message: Message) {
    const settings = await this.container.client.prisma.guildSettings.findUnique({
      where: {
        guildId: message.guild!.id
      }
    })

    return await send(message, `Current guild prefix is: ${settings?.prefix ?? envParseString('PREFIX')}`)
  }

  public async set(message: Message, args: Args) {
    const prefix = (await args.pickResult('string')).value

    if (!prefix) return await send(message, 'You must provide a prefix!')

    await this.container.client.prisma.guildSettings.update({
      where: {
        guildId: message.guild!.id
      },
      data: {
        prefix
      }
    })

    return await send(message, `I've set the Guild prefix to \`${prefix}\``)
  }

  public async reset(message: Message, args: Args) {
    const prefix = envParseString('PREFIX')

    await this.container.client.prisma.guildSettings.update({
      where: {
        guildId: message.guild!.id
      },
      data: {
        prefix
      }
    })

    return await send(message, `I've reset the guild prefix back to ${prefix}`)
  }
}
