type Title = {
    title: string
    subtitle: string
  }
  
  type PageTitles = {
    [key: string]: {
      [locale: string]: Title[]
    }
  }

  /**
 * 获取指定角色的预设文案
 * @param {string} character - 角色标识符（如 'spongebob', 'patrick', 'squidward'）
 * @param {string} locale - 语言代码（如 'en', 'zh'）
 * @returns {Array} 预设文案数组
 */
export const getPageTitle = (page: string, locale = 'en') => {
    // 如果找不到指定语言的预设，则返回英文预设，如果也没有英文预设，则返回空数组
    return ALL_PAGE_TITLES[page]?.[locale] || ALL_PAGE_TITLES[page]?.['en'] || ALL_PAGE_TITLES['index']['en']
}

export const ALL_PAGE_TITLES: PageTitles = {
    // index
    index: {
      en: [
        {
          title: 'Best AI Cover & AI Voice Over',
          subtitle: 'Easily create AI covers and AI voice overs with your favorite voices anytime, anywhere'
        }
      ],
      zh: [
        {
          title: '最佳AI翻唱 & AI配音生成器',
          subtitle: '随时随地将你喜欢的歌曲转换成不同的高品质歌声'
        }
      ],
      'zh-tw': [
        {
          title: '最佳AI翻唱 & AI配音生成器',
          subtitle: '隨時隨地將你喜歡的歌曲轉換成不同的高品質歌聲'
        }
      ],
      'ja': [
        {
          title: '最高のAIカバー＆AIボイスオーバー',
          subtitle: 'いつでもどこでもお気に入りの声でAIカバーとAIボイスオーバーを簡単に作成'
        }
      ],
      'fr': [
        {
          title: 'Meilleure Reprise IA et Voix Off IA',
          subtitle: 'Créez facilement des covers AI et des voix off avec vos voix préférées à tout moment et en tout lieu'
        }
      ],
      'es': [
        {
          title: 'Mejor Cover AI y Voz en Off AI',
          subtitle: 'Crea fácilmente covers AI y voces en off con tus voces favoritas en cualquier momento y lugar'
        }
      ]
    },
    'sound-effects': {
      en: [
        {
          title: 'Best AI Sound Effect Generator',
          subtitle: 'Transform your text descriptions into high-quality sound effects with our AI text to sound effect technology'
        }
      ],
      zh: [
        {
          title: '最佳AI音效生成器',
          subtitle: '使用我们的AI文本转音效技术，将您的文本描述转化为高质量音效'
        }
      ],
      'zh-tw': [
        {
          title: '最佳 AI 音效生成器',
          subtitle: '使用我們的 AI 文字轉音效技術，將您的文字描述轉換為高品質音效'
        }
      ],
      'ja': [
        {
          title: '最高のAIサウンドエフェクトジェネレーター',
          subtitle: 'テキスト説明を高品質なサウンドエフェクトに変換するAIテキストからサウンドエフェクト技術'
        }
      ],
      'fr': [
        {
          title: "Meilleur générateur d'effets sonores IA",
          subtitle: 'Transformez vos descriptions textuelles en effets sonores de haute qualité avec notre technologie IA de texte vers effet sonoren'
        }
      ],
      'es': [
        {
          title: 'Mejor Generador de Efectos de Sonido AI',
          subtitle: 'Transforma tus descripciones de texto en efectos de sonido de alta calidad con nuestra tecnología AI de texto a efecto de sonido'
        }
      ]
    }
  }
