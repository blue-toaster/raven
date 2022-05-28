import { RavenCommand } from '#lib/structures/Command'
import { getModeration } from '#lib/structures/ModerationManager'
import { ApplyOptions } from '@sapphire/decorators'
import { ChatInputCommand, RegisterBehavior } from '@sapphire/framework'
import type { GuildMember, Message } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Kicks discord members',
  aliases: ['k', 'boot'],
  requiredUserPermissions: ['KICK_MEMBERS'],
  requiredClientPermissions: ['KICK_MEMBERS'],
  preconditions: ['GuildTextOnly']
})
export default class Kick extends RavenCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry): void {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addUserOption((option) => {
            return option
              .setName('user')
              .setDescription('The user to kick')
              .setRequired(true)
          })
          .addStringOption((option) =>
            option
              .setName('reason')
              .setDescription('Why is this user being kicked?')
              .setRequired(false)
          )
          .addBooleanOption((option) => {
            return option
              .setName('silent')
              .setDescription('Should we tell the user that they\'ve been kicked?')
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
    const silent = interaction.options.getBoolean('silent', false) ?? false

    const manageable = user.manageable

    if (!manageable) {
      return await interaction.reply(
        'The specified user cannot be kicked.'
      )
    }


    await getModeration(interaction.guild!).kick(user, interaction.user.tag, reason ?? 'No reason provided', silent)

    return await interaction.reply(
      `Successfully kicked ${user.toString()}`
    )
  }
}
