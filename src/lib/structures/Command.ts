/* eslint-disable @typescript-eslint/no-namespace */
import type { Args } from '@sapphire/framework'
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands'

export default abstract class Command extends SubCommandPluginCommand<Args, Command> {
}
