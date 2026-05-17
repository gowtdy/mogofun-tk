import { config } from '~/config/config'

const { cdnHost } = config

export interface TrendingCharacter {
  slug: string
  name: string
  title: string
  image: string
  usage: string
  creator: string
}

export const TRENDING_CHARACTERS: TrendingCharacter[] = [
] 