import type { ChatInputCommandErrorPayload, Events } from '@sapphire/framework'
import { Listener } from '@sapphire/framework'

export class UserEvent extends Listener<typeof Events.ChatInputCommandError>  {
  public async run(error: Error, { interaction }: ChatInputCommandErrorPayload): Promise<void> {
    // `context: { silent: true }` should make UserError silent:
    // Use cases for this are for example permissions error when running the `eval` command.
    return await interaction.reply({ content: error.message ?? 'Something went wrong...', allowedMentions: { users: [interaction.user.id], roles: [] }, ephemeral: true })
  }
}
