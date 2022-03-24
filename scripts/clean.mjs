import fse from 'fs-extra'
import { join } from 'path'

if (!fse.existsSync(join(process.cwd(), 'build'))) {
  process.exit(0)
}

await fse.rm(join(process.cwd(), 'build'), { recursive: true })
