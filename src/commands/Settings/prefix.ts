import { envParseString } from '#lib/env'
import { RavenCommand } from '#lib/structures/Command'
import { readSettings, writeSettings } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import type { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands'
import type { Message } from 'discord.js'

@ApplyOptions<SubCommandPluginCommandOptions>({
  description: 'Configures the guild prefix',
  subCommands: ['set', 'reset', { input: 'show', default: true }]
})
export class Prefix extends RavenCommand {
  public async show(message: Message) {
    const settings = await readSettings(message.guild!.id)

    return await send(message, `Current guild prefix is: ${settings?.prefix ?? envParseString('PREFIX')}`)
  }

  public async set(message: Message, args: RavenCommand.Args) {
    const prefix = (await args.pickResult('string')).value

    if (!prefix) return await send(message, 'You must provide a prefix!')
    if (prefix.length > 4) return await send(message, 'The new prefix cannot be more than 4 letters long!')

    await writeSettings(message.guild!.id, { prefix })

    return await send(message, `I've set the Guild prefix to \`${prefix}\``)
  }

  public async reset(message: Message) {
    const prefix = envParseString('PREFIX')

    await writeSettings(message.guild!.id, { prefix })

    return await send(message, `I've reset the guild prefix back to ${prefix}`)
  }
}
