import { envParseArray } from '#lib/env'
import { Precondition, PreconditionResult } from '@sapphire/framework'
import type { Message } from 'discord.js'

const OWNERS = envParseArray('OWNERS')

export class UserPrecondition extends Precondition {
  public run(message: Message): PreconditionResult {
    return OWNERS.includes(message.author.id) ? this.ok() : this.error({ message: 'This command can only be used by the owner.' })
  }
}
