import { RavenCommand } from '#lib/structures/Command'
import { readSettings, writeSettings } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import type { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands'
import { Message, WebhookClient } from 'discord.js'

@ApplyOptions<SubCommandPluginCommandOptions>({
  description: 'Configures the guild Moderation Log',
  subCommands: ['set', 'disable', { input: 'show', default: true,  }]
})
export class ModLog extends RavenCommand {
  public async show(message: Message) {
    const settings = await readSettings(message.guild!.id)
    const channel = this.container.client.channels.resolve(settings!.modlog_channel!)

    return await send(message, `Current Mod Log channel is: ${channel?.toString() ?? 'Not set'}`)
  }

  public async set(message: Message, args: RavenCommand.Args) {
    const channel = await args.pick('guildTextChannel')

    const hook = await channel.createWebhook('Raven Mod Log', { avatar: this.container.client.user?.avatarURL() })

    await writeSettings(message.guild!.id, { modlog: hook.url })

    return await send(message, `I've set the Mod Log channel to ${channel.toString()}`)
  }

  public async disable(message: Message) {
    const settings = await readSettings(message.guild!.id)

    if (!settings?.modlog) return send(message, 'The Moderation Log channel is not set!')

    await new WebhookClient({ url: settings.modlog }).delete('Deletion requested')
    
    await writeSettings(message.guild!.id, { modlog: null })

    return await send(message, 'I\'ve disabled Moderation Logging')
  }
}
