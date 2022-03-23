import { RavenCommand } from '#lib/structures/Command'
import { ApplyOptions } from '@sapphire/decorators'
import type { Message } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Reloads Pieces',
  preconditions: ['OwnerOnly']
})
export default class Enable extends RavenCommand {
  public async messageRun(message: Message, args: RavenCommand.Args) {
    const { success, value } = await args.pickResult('piece')

    if (!success) return await message.channel.send('Could not resolve Piece name')
    const piece = value

    await piece.reload()

    return await message.channel.send(`Reloaded \`${piece.name}\``)
  }
}
