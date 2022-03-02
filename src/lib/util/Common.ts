import { envParseArray } from '#lib/env'

export function isOwner(id: string): boolean {
  return envParseArray('OWNERS').includes(id)
}
