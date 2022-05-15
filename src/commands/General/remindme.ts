import { RavenCommand } from '#lib/structures/Command'
import { seconds } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import type { ChatInputCommand } from '@sapphire/framework'
import { Duration } from '@sapphire/time-utilities'
import type { Message } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Set a reminder for later'
})
export class Ping extends RavenCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry): void {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) => {
            return option
              .setName('time')
              .setDescription('When should we remind you? (i.e. 1m = 1 minute, 1d = 1 day, etc)')
              .setRequired(true)
          })
          .addStringOption((option) =>
            option
              .setName('reminder')
              .setDescription('What are we reminding you?')
              .setRequired(true)
          )
    )
  }
  
  public override async chatInputRun(interaction: RavenCommand.ChatInputInteraction): Promise<Message | unknown> {
    const _duration  = interaction.options.getString('time', true)
    const reminder  = interaction.options.getString('reminder', true)

    const duration = this.parseTime(_duration)

    void this.container.tasks.create('reminder', { reminder: reminder, user: interaction.user.id, guild: interaction.guild!.id }, duration)

    return await interaction.reply({ content: 'Reminder set!', ephemeral: true })
  }

  private parseTime(parameter: string): number {
    const number = Number(parameter)

    if (!Number.isNaN(number)) return seconds(number)

    const duration = new Duration(parameter).offset

    if (!Number.isNaN(duration)) return duration

    const date = Date.parse(parameter)

    if (!Number.isNaN(date)) return date - Date.now()

    return NaN
  }
}
