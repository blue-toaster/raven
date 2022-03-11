import { ApplyOptions } from '@sapphire/decorators'
import { Events, Listener, ListenerOptions } from '@sapphire/framework'
import { RateLimitManager } from '@sapphire/ratelimits'
import type { Message } from 'discord.js'

const manager = new RateLimitManager(2000, 2)

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate
})
export default class messageCreate extends Listener {
  public run(message: Message) {
    const bucket = manager.acquire(message.author.id)

    if (!bucket.limited) return bucket.consume()

    return message.channel.send(`You need to slow down! Time remaining: ${bucket.remainingTime.toFixed(2)}s`)
  }
}
