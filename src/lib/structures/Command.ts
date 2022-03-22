import type { Args as CommandArgs, PieceContext } from '@sapphire/framework'
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands'

export abstract class RavenCommand extends SubCommandPluginCommand<CommandArgs, RavenCommand> {
  public usage?: string
  constructor(Context: PieceContext, options: RavenCommandOptions) {
    super(Context, options)

    this.usage = `${this.name} ${options.usage ?? ''}`
  }
}

export interface RavenCommandOptions extends SubCommandPluginCommand.Options {
  usage?: string
}

export namespace RavenCommand {
  export type Args = CommandArgs
  export interface Options extends RavenCommandOptions { }
}
