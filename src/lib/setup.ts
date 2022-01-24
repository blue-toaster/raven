process.env.NODE_ENV ??= 'development'

import '@sapphire/plugin-editable-commands/register'
import '@sapphire/plugin-hmr/register'
import '@sapphire/plugin-logger/register'
import * as colorette from 'colorette'
import { config } from 'dotenv-cra'
import { join } from 'path'
import 'reflect-metadata'
import { inspect } from 'util'
import { srcDir } from './Constants'

config({ path: join(srcDir, '.env') })

inspect.defaultOptions.depth = 1

colorette.createColors({ useColor: true })
