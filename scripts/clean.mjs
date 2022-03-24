import fs from 'fs/promises'
import { join } from 'path'

await fs.rm(join(process.cwd(), 'build'), { recursive: true })
