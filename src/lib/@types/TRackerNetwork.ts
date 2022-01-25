export interface Csgo {
  data: Data
  errors?: ErrorMessage[]
}

interface ErrorMessage {
  code: string
  message: string
  data: Record<never, never>
}

interface Data {
  platformInfo: PlatformInfo
  userInfo: UserInfo
  segments: Segment[]
  availableSegments: any[]
  expiryDate: string
}

interface PlatformInfo {
  platformSlug: string
  platformUserId: string
  platformUserHandle: string
  platformUserIdentifier: string
  avatarUrl: string
  additionalParameters: null
}

interface Segment {
  type: string
  metadata: PurpleMetadata
  expiryDate: string
  stats: { [K in Statistics]: Stat
  }
}

type Statistics = 'timePlayed' | 'score' | 'kills' | 'deaths'
  | 'kd' | 'damage' | 'headshots' | 'dominations'
  | 'shotsFired' | 'shotsHit' | 'shotsAccuracy'
  | 'snipersKilled' | 'bombsPlanted' | 'bombsDefused'
  | 'wins' | 'losses' | 'roundsWon' | 'headshotPct' | 'roundsPlayed'
  | 'matchesPlayed'

interface PurpleMetadata {
  name: string
}

interface Stat {
  rank: null
  percentile: number | null
  displayName: string
  displayCategory: DisplayCategory
  category: Category
  value: number
  displayValue: string
  displayType: DisplayType
}

enum Category {
  Combat = 'combat',
  General = 'general',
  Objective = 'objective',
  Round = 'round',
}

enum DisplayCategory {
  Combat = 'Combat',
  General = 'General',
  Objective = 'Objective',
  Round = 'Round',
}

enum DisplayType {
  Number = 'Number',
  NumberPercentage = 'NumberPercentage',
  NumberPrecision2 = 'NumberPrecision2',
  TimeSeconds = 'TimeSeconds',
}

interface UserInfo {
  userId: null
  isPremium: boolean
  isVerified: boolean
  isInfluencer: boolean
  isPartner: boolean
  countryCode: string
  customAvatarUrl: null
  customHeroUrl: null
  socialAccounts: null
  pageviews: null
  isSuspicious: null
}
