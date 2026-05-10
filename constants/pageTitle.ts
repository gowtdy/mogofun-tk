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
    },
    'vocal-isolator': {
      en: [
        {
          title: 'Best Vocal Isolator Online',
          subtitle: 'Instantly extract vocals from a song, music, audio or video, anytime, anywhere'
        }
      ],
      zh: [
        {
          title: '最佳在线人声分离工具',
          subtitle: '从任何音乐、音频和视频中即时提取人声'
        }
      ],
      'zh-tw': [
        {
          title: '最佳線上人聲分離工具',
          subtitle: '從任何音樂、音頻和視頻中即時提取人聲'
        }
      ],
      'ja': [
        {
          title: '最高のオンラインボーカル分離ツール',
          subtitle: '音楽、オーディオ、ビデオから即座にボーカルを抽出'
        }
      ],
      'fr': [
        {
          title: 'Meilleur Séparateur Vocal en Ligne',
          subtitle: 'Extrayez instantanément les voix de toute musique, audio et vidéo'
        }
      ],
      'es': [
        {
          title: 'Mejor Separador de Voces en Línea',
          subtitle: 'Extrae voces instantáneamente de cualquier música, audio y video'
        }
      ]
    },
    'vocal-remover': {
      en: [
        {
          title: 'Best Vocal Remover Online',
          subtitle: 'Instantly remove vocals from a song, music, audio or video, anytime, anywhere'
        }
      ],
      zh: [
        {
          title: '最佳在线人声去除工具',
          subtitle: '使用我们的人声去除工具，立即从歌曲、音乐、音频和视频中移除人声'
        }
      ],
      'zh-tw': [
        {
          title: '最佳在線AI人聲消除工具',
          subtitle: '使用我們的人聲消除工具，立即從歌曲、音樂、音頻和視頻中移除人聲'
        }
      ],
      'ja': [
        {
          title: '最高のAIボーカルリムーバーオンライン',
          subtitle: '当社のボーカルリムーバーツールで、楽曲、音楽、音声、動画から瞬時にボーカルを除去'
        }
      ],
      'fr': [
        {
          title: 'Meilleur Suppresseur de Voix IA en Ligne',
          subtitle: "Supprimez instantanément les voix de n'importe quelle chanson, musique, audio et vidéo avec notre outil de suppression de voix"
        }
      ],
      'es': [
        {
          title: 'Mejor Eliminador de Voces IA en Línea',
          subtitle: 'Elimina instantáneamente las voces de cualquier canción, música, audio y video con nuestra herramienta de eliminación de voces'
        }
      ]
    },
    'audio-extractor': {
      en: [
        {
          title: 'Audio Extractor',
          subtitle: 'Online audio extractor to extract audio from your uploaded video'
        }
      ],
      zh: [
        {
          title: '音频提取',
          subtitle: '在线音频提取工具，从您上传的视频中提取高质量音频'
        }
      ],
      'zh-tw': [
        {
          title: '音頻提取',
          subtitle: '線上音頻提取工具，從您上傳的視頻中提取高質量音頻'
        }
      ],
      'ja': [
        {
          title: '音声抽出ツール',
          subtitle: 'アップロードしたビデオから音声を抽出するオンライン音声抽出ツール'
        }
      ],
      'fr': [
        {
          title: 'Extracteur Audio',
          subtitle: "Extracteur audio en ligne pour extraire l'audio de votre vidéo téléchargée"
        }
      ],
      'es': [
        {
          title: 'Extractor de Audio',
          subtitle: 'Extractor de audio en línea para extraer audio de tu video subido'
        }
      ]
    }
  }
