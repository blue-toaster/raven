import Command from '#lib/structures/Command'
import { isOwner } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { PaginatedMessage } from '@sapphire/discord.js-utilities'
import type { Args, CommandOptions } from '@sapphire/framework'
import { send } from '@sapphire/plugin-editable-commands'
import { EmbedField, Message, MessageEmbed } from 'discord.js'

@ApplyOptions<CommandOptions>({
  description: 'Shows the available commands.',
  aliases: ['h'],
  preconditions: ['GuildTextOnly']
})
export class Help extends Command {
  public async messageRun(message: Message, args: Args) {
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
      .addFields(fields)

    return await send(message, { embeds: [embed] })
  }

  private async helpMenu(message: Message) {
    let categories: string[] = []

    this.container.stores.get('commands').map(command => {
      if (categories.includes(command.category!)) return undefined

      return categories.push(command.category!)
    })

    const paginatedMessage = new PaginatedMessage({
      template: new MessageEmbed()
        .setColor('RANDOM')
    })

    for (const category of categories) {
      const commands = this.container.stores.get('commands').filter((command) => category === 'Owner'
        ? isOwner(message.author.id) && command.category === 'Owner'
        : command.category === category).map(c => `\`${c.name}\``)

      if (commands.length !== 0) {
        paginatedMessage.addPageEmbed((embed) =>
          embed
            .addField(category, commands.join(', '))
            .setTimestamp()
        )
      }
    }

    await paginatedMessage.run(message, message.author)
    return message
  }
}
