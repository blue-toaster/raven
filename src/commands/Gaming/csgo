import { envParseString } from '#lib/env'
import { RavenCommand } from '#lib/structures/Command'
import type { Csgo } from '#types'
import { request } from '@artiefuzzz/lynx'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import { Message, MessageEmbed } from 'discord.js'

@ApplyOptions<RavenCommand.Options>({
  description: 'Information about a CS:GO player (Steam only)'
})
export class CSGO extends RavenCommand {
  public async messageRun(message: Message, args: RavenCommand.Args) {
    const user = (await args.pickResult('string')).value

    if (!user) {
      return await send(message, 'Please include a username')
    }

    const res = await request<Csgo>(`https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${user}`)
      .headers({
        'TRN-Api-Key': envParseString('TRN_API_KEY')
      })
      .send()

    const json = res.json

    if (json.errors) return await send(message, 'User does not exist!')

    const { data } = json
    const { stats } = data.segments[0]

    const embed = new MessageEmbed()
      .setTitle(`CSGO Statistics for ${data.platformInfo.platformUserHandle}`)
      .setTimestamp()
      .setColor('YELLOW')
      .setThumbnail(data.platformInfo.avatarUrl)
      .setFooter({ text: `steamId: ${data.platformInfo.platformUserId} / ${data.platformInfo.platformUserHandle}` })
      .addFields([
        { name: stats.kills.displayName, value: stats.kills.displayValue, inline: true },
        { name: stats.deaths.displayName, value: stats.deaths.displayValue, inline: true },
        { name: stats.damage.displayName, value: stats.damage.displayValue, inline: true },
        { name: stats.wins.displayName, value: stats.wins.displayValue, inline: true },
        { name: stats.losses.displayName, value: stats.losses.displayValue, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: stats.roundsWon.displayName, value: stats.roundsWon.displayValue, inline: true },
        { name: stats.roundsPlayed.displayName, value: stats.roundsPlayed.displayValue, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: stats.bombsPlanted.displayName, value: stats.bombsPlanted.displayValue, inline: true },
        { name: stats.bombsDefused.displayName, value: stats.bombsDefused.displayValue, inline: true }
      ])

    return await send(message, { embeds: [embed] })
  }
}
