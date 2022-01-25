import { envParseArray } from '#lib/env'
import Command from '#lib/structures/Command'
import { ApplyOptions } from '@sapphire/decorators'
import { PaginatedMessage } from '@sapphire/discord.js-utilities'
import type { CommandOptions } from '@sapphire/framework'
// import { send } from '@sapphire/plugin-editable-commands'
import { Message, MessageEmbed, Snowflake } from 'discord.js'

@ApplyOptions<CommandOptions>({
  description: 'Shows the available commands.',
  aliases: ['h'],
  preconditions: ['GuildTextOnly']
})
export class Ping extends Command {
  public async messageRun(message: Message) {
    return await this.helpMenu(message)
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
        ? this.isOwner(message.author.id)
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

  private isOwner(id: Snowflake) {
    const owners = envParseArray('OWNERS')

    return owners.includes(id)
  }
}
