import { getRootData } from '@sapphire/pieces'
import { join } from 'path'

export const mainDir = getRootData().root
export const rootDir = join(mainDir, '..')

export const RandomLoadingMessage = ['Computing...', 'Thinking...', 'Cooking some food...', 'Give me a moment...', 'Loading...', 'Hold on...']

