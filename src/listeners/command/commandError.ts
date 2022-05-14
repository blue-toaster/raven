import { ChatInputCommandErrorPayload, Events, Listener, UserError } from '@sapphire/framework'

export class UserEvent extends Listener<typeof Events.ChatInputCommandError>  {
  public async run(error: Error, { interaction }: ChatInputCommandErrorPayload): Promise<void> {
    // `context: { silent: true }` should make UserError silent:
    // Use cases for this are for example permissions error when running the `eval` command.
    if (error instanceof UserError) {
      return await interaction.reply({ content: error.message ?? 'Something went wrong...', allowedMentions: { users: [interaction.user.id], roles: [] }, ephemeral: true })
    }

    return this.container.logger.error(error.message)
  }
}
