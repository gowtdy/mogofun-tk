type Description = {
  description: string
}

type FaqItem = {
  question: string
  answer: string
}

type CharacterDescriptions = {
  [key: string]: {
    description: {
      [locale: string]: Description[]
    }
    faq?: {
      [locale: string]: FaqItem[]
    }
  }
}

/**
* 获取指定角色的预设文案
* @param {string} character - 角色标识符（如 'spongebob', 'patrick', 'squidward'）
* @param {string} locale - 语言代码（如 'en', 'zh'）
* @returns {Array} 预设文案数组
*/
export const getCharacterDescription = (character: string, locale = 'en') => {
  // 只认 description 字段下的多语言内容
  if (ALL_CHARACTER_DESCRIPTIONS[character]?.description) {
    return ALL_CHARACTER_DESCRIPTIONS[character].description[locale] || ALL_CHARACTER_DESCRIPTIONS[character].description['en']
  }
  // 最后兜底到 ariana-grande
  // return ALL_CHARACTER_DESCRIPTIONS['ariana-grande'].description['en']
  return []
}

export const ALL_CHARACTER_DESCRIPTIONS: CharacterDescriptions = {
  
}
