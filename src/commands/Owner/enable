import { RavenCommand } from '#lib/structures/Command'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Enables Pieces',
  preconditions: ['OwnerOnly']
})
export default class Enable extends RavenCommand {
  public async messageRun(message: Message, args: RavenCommand.Args) {
    const piece = await args.pick('piece')

    piece.enabled = true

    return await message.channel.send(`Enabled ${piece.name}`)
  }
}
