import { RavenCommand } from '#lib/structures/Command'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import type { Message } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Returns bot latency'
})
export class Ping extends RavenCommand {
  public async messageRun(message: Message) {
    const msg = await send(message, 'Ping?')
    const ping = Math.round(this.container.client.ws.ping)
    const apiPing = (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)

    const content = `Pong!\nBot Latency: ${ping}ms\nAPI Latency: ${apiPing}ms`

    return send(message, content)
  }
}
