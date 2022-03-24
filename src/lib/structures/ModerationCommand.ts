import type { Args as CommandArgs } from '@sapphire/framework'
import type { GuildMember } from 'discord.js'
import { RavenCommand } from './Command'

export abstract class ModerationCommand extends RavenCommand {
  protected async sendDM(target: GuildMember, content: string) {
    const dm = await target.createDM()

    return await dm.send(content)
  }

  protected getModeratable(targets: GuildMember[]) {
    return targets.filter(user => user.manageable)
  }
}

export namespace ModerationCommand {
  export type Args = CommandArgs
  export interface Options extends RavenCommand.Options { }
}
