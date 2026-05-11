export interface CharacterConfig {
  slug: string
  headerImage: string
  author: string
  views: string
  defaultCategory: string
  defaultModel: string
}

export const characterConfigs: Record<string, CharacterConfig> = {
};

export function getCharacterConfig(slug: string): CharacterConfig | null {
  return characterConfigs[slug] || null
}

export function getAllCharacterSlugs(): string[] {
  return Object.keys(characterConfigs)
} 
