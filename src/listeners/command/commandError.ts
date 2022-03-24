import type { CommandErrorPayload, Events } from '@sapphire/framework'
import { Listener } from '@sapphire/framework'

export class UserEvent extends Listener<typeof Events.CommandError> {
  public async run(error: Error, { message, context }: CommandErrorPayload) {
    // `context: { silent: true }` should make UserError silent:
    // Use cases for this are for example permissions error when running the `eval` command.
    if (Reflect.get(Object(context), 'silent')) return

    return message.channel.send({ content: error.message, allowedMentions: { users: [message.author.id], roles: [] } })
  }
}
