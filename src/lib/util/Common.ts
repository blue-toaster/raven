import { envParseArray } from '#lib/env'
import type { PackageJson } from '#types'
import { sleep } from '@artiefuzzz/utils'
import { container } from '@sapphire/framework'
import { send } from '@sapphire/plugin-editable-commands'
import { Time } from '@sapphire/time-utilities'
import { Guild, GuildResolvable, Message, MessageEmbed, MessageOptions, User, UserResolvable } from 'discord.js'
import { join } from 'path'
import { mainDir, RandomLoadingMessage } from './constants'

export function getPkg(): PackageJson {
  return require(join(mainDir,'..', 'package.json'))
}

export function isOwner(id: string): boolean {
  return envParseArray('OWNERS').includes(id)
}

export function getUser(user: UserResolvable): User | null {
  return container.client.users.resolve(user)
}

export function getGuild(guild: GuildResolvable): Guild | null {
  return container.client.guilds.resolve(guild)
}

export function seconds(number: number): number {
  return number * Time.Second
}

export function minutes(number: number): number {
  return number * Time.Minute
}

export function hours(number: number): number {
  return number * Time.Hour
}

export function years(number: number): number {
  return number * Time.Year
}

/**
 * Send a temporary message to a channel.
 * @params message Used to send the channel
 * @returns Promise<Message | boolean>
 */
export async function sendTemporaryMessage(
  message: Message,
  options: string | MessageOptions,
  time = 0
): Promise<Message | boolean> {
  if (typeof options === 'string') options = { content: options }

  const _message = await message.channel.send(options)

  if (time === 0) void _message.delete()

  await sleep(time)

  try {
    // @ts-expect-error
    return void _message.delete()
  } catch {
    return false
  }
}

/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export function pickRandom<T>(array: readonly T[]): T {
  const { length } = array
  return array[Math.floor(Math.random() * length)]
}

/**
 * Sends a loading message to the current channel
 * @param message The message data for which to send the loading message
 */
export function sendLoadingMessage(message: Message): Promise<typeof message> {
  return send(message, { embeds: [new MessageEmbed().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')] })
}
