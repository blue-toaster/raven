import fs from 'fs'
import { join } from 'path'

fs.rmSync(join(process.cwd(), 'build'), { recursive: true })
