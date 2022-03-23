import { RavenCommand } from '#lib/structures/Command'
import { sendLoadingMessage } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { PaginatedMessage } from '@sapphire/discord.js-utilities'
import { send } from '@sapphire/plugin-editable-commands'
import { Collection, EmbedField, Message, MessageEmbed } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Shows the available commands.',
  aliases: ['h'],
  preconditions: ['GuildTextOnly']
})
export class Help extends RavenCommand {
  public async messageRun(message: Message, args: RavenCommand.Args) {
    const command = await args.pickResult('string')
    if (command.success) return await this.commandHelp(message, command.value)
    return await this.helpMenu(message)
  }

  private async commandHelp(message: Message, commandName: string) {
    const command = this.container.stores.get('commands').get(commandName.toLowerCase())

    if (typeof command === 'undefined') {
      return await send(message, 'That command does not exit.')
    }

    let fields: EmbedField[] = []

    if (command.description) {
      fields.push({ name: 'Description 🗒️', value: command.description, inline: false })
    }

    if (command.detailedDescription) {
      fields.push({ name: 'Detailed Description 📝', value: command.detailedDescription as string, inline: false })
    }

    if (command.aliases) {
      fields.push({ name: 'Aliases ➕', value: command.aliases.map(a => `\`${a}\``).join(', '), inline: false })
    }

    const embed = new MessageEmbed()
      .setTitle(`Help Page | ${command.name}`)

    if (fields) embed.addFields(fields)

    return await send(message, { embeds: [embed] })
  }

  private async helpMenu(message: Message) {
    const res = await sendLoadingMessage(message)

    const paginatedMessage = new PaginatedMessage({
      template: new MessageEmbed()
        .setTitle('Help Menu • Raven')
        .setColor('RANDOM')
    })

    const commandsByCategory = await this.getCommands(message)

    for (const [category, commands] of commandsByCategory) {
      paginatedMessage.addPageEmbed((embed) => {
        return embed
          .addField(category, commands.map(this.formatCommand.bind(this)).join('\n'))
          .setColor('WHITE')
          .setTimestamp()
      })
    }

    await paginatedMessage.run(res, message.author)
    return res
  }

  private formatCommand(command: RavenCommand) {
    return `• ${command.name} • ${command.description}`
  }

  /**
   * @license Apache License, Version 2.0
   * @copyright Skyra Project, 2019
   * 
   * https://github.com/skyra-project/skyra/blob/e97a42370955f32401cd875515011f57673c5297/src/commands/General/help.ts#L188
   */
  private async getCommands(message: Message) {
    const commands = this.container.stores.get('commands')
    const filtered = new Collection<string, RavenCommand[]>()

    await Promise.all(commands.map(async (cmd) => {
      const command = cmd as RavenCommand

      if (!command.enabled) return

      const result = await command.preconditions.run(message, command, { command: null! })
      if (!result.success) return

      const category = filtered.get(command.fullCategory!.join(' - '))
      if (category) category.push(command)
      else filtered.set(command.fullCategory!.join(' - '), [command])
    }))

    return filtered.sort((_, __, f, s) => {
      if (f > s) return 1
      if (s > f) return -1

      return 0
    })
  }
}
