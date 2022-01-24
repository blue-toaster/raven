import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework'
import { send } from '@sapphire/plugin-editable-commands'
import type { Message } from 'discord.js'

@ApplyOptions<CommandOptions>({
  description: 'Returns bot latency'
})
export class UserCommand extends Command {
  public async messageRun(message: Message) {
    const msg = await send(message, 'Ping?')
    const ping = Math.round(this.container.client.ws.ping)
    const apiPing = (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)

    const content = `Pong!\nBot Latency: ${ping}ms\nAPI Latency: ${apiPing}ms`

    return send(message, content)
  }
}
