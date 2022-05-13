import { RavenCommand } from '#lib/structures/Command'
import { ApplyOptions } from '@sapphire/decorators'
import { isMessageInstance } from '@sapphire/discord.js-utilities'
import type { Message } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Returns bot latency',
  chatInputCommand: {
    register: true
  }
})
export class Ping extends RavenCommand {
  public override async chatInputRun(interaction: RavenCommand.ChatInputInteraction): Promise<Message | unknown> {
    const msg = await interaction.reply({ content: 'Pong!', fetchReply: true, ephemeral: true })

    if (isMessageInstance(msg)) {
      const ping = Math.round(this.container.client.ws.ping)
      const apiPing = msg.createdTimestamp - interaction.createdTimestamp
  
      const content = `Pong!\nBot Latency: ${ping}ms\nAPI Latency: ${apiPing}ms`

      return await interaction.editReply(content)
    }

    return interaction.reply('Failed to ping...')
  }
}
