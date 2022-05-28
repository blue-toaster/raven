import { Args as CommandArgs, Command, PieceContext, RegisterBehavior } from '@sapphire/framework'

export abstract class RavenCommand extends Command {
  public usage?: string
  constructor(Context: PieceContext, options: RavenCommandOptions) {
    super(Context, {
      chatInputCommand: {
        register: true,
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite
      },
      ...options
    })

    this.usage = `${this.name} ${options.usage ?? ''}`
  }
}

export interface RavenCommandOptions extends Command.Options {
  usage?: string
}

export namespace RavenCommand {
  export type Args = CommandArgs
  export interface Options extends RavenCommandOptions { }
  export type ChatInputInteraction = Command.ChatInputInteraction
}
