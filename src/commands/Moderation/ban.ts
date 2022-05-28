import type { RavenCommand } from '#lib/structures/Command'
import { ModerationCommand } from '#lib/structures/ModerationCommand'
import { getModeration } from '#lib/structures/ModerationManager'
import { ApplyOptions } from '@sapphire/decorators'
import { ChatInputCommand, RegisterBehavior } from '@sapphire/framework'
import type { GuildMember, Message } from 'discord.js'

@ApplyOptions<ModerationCommand.Options>({
  description: 'Bans discord members',
  aliases: ['b', 'hammer'],
  requiredUserPermissions: ['BAN_MEMBERS'],
  requiredClientPermissions: ['BAN_MEMBERS'],
  preconditions: ['GuildTextOnly']
})
export default class Ban extends ModerationCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry): void {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addUserOption((option) => {
            return option
              .setName('user')
              .setDescription('The user to ban')
              .setRequired(true)
          })
          .addStringOption((option) =>
            option
              .setName('reason')
              .setDescription('Why is this user being banned?')
              .setRequired(false)
          )
          .addBooleanOption((option) => {
            return option
              .setName('soft')
              .setDescription('Unbans the user after the ban')
              .setRequired(false)
          })
          .addBooleanOption((option) => {
            return option
              .setName('silent')
              .setDescription('Should we tell the user that they\'ve been banned?')
              .setRequired(false)
          }),
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    )
  }

  public override async chatInputRun(interaction: RavenCommand.ChatInputInteraction): Promise<Message | unknown> {
    const user = interaction.options.getMember('user', true) as GuildMember
    const reason = interaction.options.getString('reason', false)
    const soft = interaction.options.getBoolean('soft', false) ?? false
    const silent = interaction.options.getBoolean('silent', false) ?? false

    const manageable = user.manageable

    if (!manageable) {
      return await interaction.reply(
        'The specified user cannot be banned.'
      )
    }


    await getModeration(interaction.guild!).ban(user, interaction.user.tag, reason ?? 'No reason provided', soft, silent)

    return await interaction.reply(
      `Successfully banned ${user.toString()}`
    )
  }
}
