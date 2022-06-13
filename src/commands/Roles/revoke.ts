import { RavenCommand } from '#lib/structures/Command'
import { ApplyOptions } from '@sapphire/decorators'
import { ChatInputCommand, RegisterBehavior } from '@sapphire/framework'
import type { Message, Role } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Removes a users\' specified role',
  requiredClientPermissions: ['MANAGE_ROLES'],
  requiredUserPermissions: ['MANAGE_ROLES']
})
export class Ping extends RavenCommand {
  public override registerApplicationCommands(registry: ChatInputCommand.Registry): void {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addRoleOption((option) => {
            return option
              .setName('role')
              .setDescription('Role to remove from the mentioned user')
              .setRequired(true)
          })
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('User to remove the specified role from')
              .setRequired(true)
          ),
      {
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    )
  }
    
  public override async chatInputRun(interaction: RavenCommand.ChatInputInteraction): Promise<Message | unknown> {
    const guild = interaction.guild!
    const role = interaction.options.getRole('role', true) as Role
    const user = interaction.options.getUser('user', true)
    const member = guild.members.resolve(user)!
    const botRole = guild.me!.roles.botRole!.position

    if (role.position > botRole) {
      return await interaction.reply('I am not allowed to remove that role from the user. (My role position is below the specified role)')
    }

    if (member.roles.highest.position > botRole) {
      return await interaction.reply('User has a higher role than me.')
    }

    if (!member.roles.cache.has(role.id)) {
      return await interaction.reply('The user does not have the specified role.')
    }

    await member.roles.remove(role)

    return await interaction.reply(`Revoked ${role.toString()} role from ${user.username}`)
  }
}
