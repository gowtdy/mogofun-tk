// 页面配置 - 移除 mainComponent 避免预加载组件定义
export interface PageConfig {
  pageKey: string
  defaultCategory: string
  defaultModel: string
  hrefPath?: string
}

const pageConfigs: Record<string, PageConfig> = {
  "first-page": {
    pageKey: "first-page",
    defaultCategory: 'english',
    defaultModel: 'voice-lady-female',
    hrefPath: '/'
  },
  "amans-voice": {
    pageKey: "amans-voice",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: '/amans-voice'
  },
  "audio-male": {
    pageKey: "audio-male",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: '/audio-male'
  },
  "british-accent-generator": {
    pageKey: "british-accent-generator",
    defaultCategory: 'english_gb',
    defaultModel: 'gb-female-beatrice',
    hrefPath: '/british-accent-generator'
  },
  "british-voice": {
    pageKey: "british-voice",
    defaultCategory: 'english_gb',
    defaultModel: 'gb-female-beatrice',
    hrefPath: '/british-voice'
  },
  "cantonese-text-to-speech": {
    pageKey: "cantonese-text-to-speech",
    defaultCategory: 'china_yueyu',
    defaultModel: 'huashinai-female',
    hrefPath: '/cantonese-text-to-speech'
  },
  "deep-voice": {
    pageKey: "deep-voice",
    defaultCategory: 'english',
    defaultModel: 'ghostface-male',
    hrefPath: '/deep-voice'
  },
  "guy-voice": {
    pageKey: "guy-voice",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: '/guy-voice'
  },
  "male-audio": {
    pageKey: "male-audio",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: '/male-audio'
  },
  "male-voice": {
    pageKey: "male-voice",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: '/male-voice'
  },
  "male-voices": {
    pageKey: "male-voices",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: '/male-voices'
  },
  "man-audio": {
    pageKey: "man-audio",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: '/man-audio'
  },
  "man-text-to-speech": {
    pageKey: "man-text-to-speech",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: '/man-text-to-speech'
  },
  "man-voice-over": {
    pageKey: "man-voice-over",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: '/man-voice-over'
  },
  "man-voice": {
    pageKey: "man-voice",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'man-voice'
  },
  "man-voices": {
    pageKey: "man-voices",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'man-voices'
  },
  "mans-voice": {
    pageKey: "mans-voice",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'mans-voice'
  },
  "men-voice": {
    pageKey: "men-voice",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'men-voice'
  },
  "the-mans-voice": {
    pageKey: "the-mans-voice",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'the-mans-voice'
  },
  "voice-deep": {
    pageKey: "voice-deep",
    defaultCategory: 'english',
    defaultModel: 'ghostface-male',
    hrefPath: '/voice-deep'
  },
  "voice-male": {
    pageKey: "voice-male",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'voice-male'
  },
  "voice-man": {
    pageKey: "voice-man",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'voice-man'
  },
  "voice-of-male": {
    pageKey: "voice-of-male",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'voice-of-male'
  },
  "voice-of-man": {
    pageKey: "voice-of-man",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'voice-of-man'
  },
  "adam-ai-voice": {
    pageKey: "adam-ai-voice",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'adam-ai-voice'
  },
  "adam-voice": {
    pageKey: "adam-voice",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'adam-voice'
  },
  "adam-voice-ai": {
    pageKey: "adam-voice-ai",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: 'adam-voice-ai'
  },
  "ghostface": {
    pageKey: "ghostface",
    defaultCategory: 'english',
    defaultModel: 'ghostface-male',
    hrefPath: 'ghostface'
  },
  "hey-siri-voice": {
    pageKey: "hey-siri-voice",
    defaultCategory: 'english',
    defaultModel: 'siri-female',
    hrefPath: 'hey-siri-voice'
  },
  "jessie": {
    pageKey: "jessie",
    defaultCategory: 'english',
    defaultModel: 'jessie-female',
    hrefPath: 'jessie'
  },
  "santa-ai": {
    pageKey: "santa-ai",
    defaultCategory: 'english',
    defaultModel: 'us-male-santa-christmas',
    hrefPath: 'santa-ai'
  },
  "santa-ai-voice": {
    pageKey: "santa-ai-voice",
    defaultCategory: 'english',
    defaultModel: 'us-male-santa-christmas',
    hrefPath: 'santa-ai-voice'
  },
  "santa-audio": {
    pageKey: "santa-audio",
    defaultCategory: 'english',
    defaultModel: 'us-male-santa-christmas',
    hrefPath: 'santa-audio'
  },
  "santa-claus": {
    pageKey: "santa-claus",
    defaultCategory: 'english',
    defaultModel: 'us-male-santa-christmas',
    hrefPath: 'santa-claus'
  },
  "santa-claus-ai": {
    pageKey: "santa-claus-ai",
    defaultCategory: 'english',
    defaultModel: 'us-male-santa-christmas',
    hrefPath: 'santa-claus-ai'
  },
  "santa-text-to-speech": {
    pageKey: "santa-text-to-speech",
    defaultCategory: 'english',
    defaultModel: 'us-male-santa-christmas',
    hrefPath: 'santa-text-to-speech'
  },
  "santa-voice": {
    pageKey: "santa-voice",
    defaultCategory: 'english',
    defaultModel: 'us-male-santa-christmas',
    hrefPath: 'santa-voice'
  },
  "santa-voicemail": {
    pageKey: "santa-voicemail",
    defaultCategory: 'english',
    defaultModel: 'us-male-santa-christmas',
    hrefPath: 'santa-voicemail'
  },
  "siri": {
    pageKey: "siri",
    defaultCategory: 'english',
    defaultModel: 'siri-female',
    hrefPath: 'siri'
  },
  "siri-text-to-speech": {
    pageKey: "siri-text-to-speech",
    defaultCategory: 'english',
    defaultModel: 'siri-female',
    hrefPath: 'siri-text-to-speech'
  },
  "siri-voice": {
    pageKey: "siri-voice",
    defaultCategory: 'english',
    defaultModel: 'siri-female',
    hrefPath: 'siri-voice'
  },
  "siri-voices": {
    pageKey: "siri-voices",
    defaultCategory: 'english',
    defaultModel: 'siri-female',
    hrefPath: 'siri-voices'
  },
  "stitch-say": {
    pageKey: "stitch-say",
    defaultCategory: 'english',
    defaultModel: 'stitch-male',
    hrefPath: 'stitch-say'
  },
  "stitch-voice": {
    pageKey: "stitch-voice",
    defaultCategory: 'english',
    defaultModel: 'stitch-male',
    hrefPath: 'stitch-voice'
  },
  "text-to-speech-siri": {
    pageKey: "text-to-speech-siri",
    defaultCategory: 'english',
    defaultModel: 'siri-female',
    hrefPath: 'text-to-speech-siri'
  },
  "voice-of-siri": {
    pageKey: "voice-of-siri",
    defaultCategory: 'english',
    defaultModel: 'siri-female',
    hrefPath: 'voice-of-siri'
  },
  "read-stories": {
    pageKey: "read-stories",
    defaultCategory: 'english',
    defaultModel: 'story-teller-male',
    hrefPath: 'read-stories'
  },
  "story-reader": {
    pageKey: "story-reader",
    defaultCategory: 'english',
    defaultModel: 'story-teller-male',
    hrefPath: 'story-reader'
  },
  "story-reading": {
    pageKey: "story-reading",
    defaultCategory: 'english',
    defaultModel: 'story-teller-male',
    hrefPath: 'story-reading'
  }
}

export function getPageConfig(slug: string): PageConfig {
  const config = pageConfigs[slug]
  if (config) return config

  return {
    pageKey: slug,
    defaultCategory: 'english',
    defaultModel: 'voice-lady-female',
    hrefPath: `/${slug}`,
  }
}

export function getAllPageConfigs(): PageConfig[] {
  return Object.values(pageConfigs)
}