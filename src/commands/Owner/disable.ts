import { RavenCommand } from '#lib/structures/Command'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Disables Pieces',
  preconditions: ['OwnerOnly']
})
export default class Disable extends RavenCommand {
  public async messageRun(message: Message, args: RavenCommand.Args) {
    const piece = await args.pick('piece')

    piece.enabled = false

    return await message.channel.send(`Disabled ${piece.name}`)
  }
}
