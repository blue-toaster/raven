import type { RavenCommand } from '#lib/structures/Command'
import { ModerationCommand } from '#lib/structures/ModerationCommand'
import { ApplyOptions } from '@sapphire/decorators'
import type { ChatInputCommand } from '@sapphire/framework'
import type { Message, TextChannel } from 'discord.js'

@ApplyOptions<ModerationCommand.Options>({
  description: 'Deletes multiple messages at once',
  flags: ['silent'],
  requiredClientPermissions: ['MANAGE_MESSAGES'],
  requiredUserPermissions: ['MANAGE_MESSAGES'],
  preconditions: ['GuildTextOnly']
})
export default class Purge extends ModerationCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry): void {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addNumberOption((option) => {
            return option
              .setName('limit')
              .setDescription('How many messages should we delete?')
              .setRequired(true)
              .setMinValue(2)
              .setMaxValue(100)
          })
    )
  }

  public override async chatInputRun(interaction: RavenCommand.ChatInputInteraction): Promise<Message | unknown> {
    const limit = interaction.options.getNumber('limit', true)

    const messages = await interaction.channel?.messages.fetch({ limit: limit + 1 })

    await (interaction.channel as TextChannel).bulkDelete(messages!)

    return await interaction.reply(
      `Successfully deleted ${limit} messages(s)`
    )
  }
}
