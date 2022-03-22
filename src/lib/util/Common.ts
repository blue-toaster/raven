import { envParseArray } from '#lib/env'
import { sleep } from '@artiefuzzz/utils'
import { container } from '@sapphire/framework'
import { send } from '@sapphire/plugin-editable-commands'
import { Time } from '@sapphire/time-utilities'
import { GuildResolvable, Message, MessageEmbed, MessageOptions, UserResolvable } from 'discord.js'
import { RandomLoadingMessage } from './constants'

export function isOwner(id: string): boolean {
  return envParseArray('OWNERS').includes(id)
}

export async function getUser(user: UserResolvable) {
  return await container.client.users.resolve(user)?.fetch()
}

export async function getGuild(guild: GuildResolvable) {
  return await container.client.guilds.resolve(guild)?.fetch()
}

export function seconds(number: number) {
  return number * Time.Second
}

export function minutes(number: number) {
  return number * Time.Minute
}

export function hours(number: number) {
  return number * Time.Hour
}

export function years(number: number) {
  return number * Time.Year
}

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
