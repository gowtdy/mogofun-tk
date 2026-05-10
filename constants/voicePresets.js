// 角色描述对象
const characterDescs = {

};

// 多语言标签映射
const LABELS = {
  zh: {
    greetings: "问候",
    emotions: "情感",
    actions: "行动号召",
    stories: "故事",
  },
  en: {
    greetings: "Greetings",
    emotions: "Emotions",
    actions: "Actions",
    stories: "Stories",
  },
  ja: {
    greetings: "挨拶",
    emotions: "感情",
    actions: "行動",
    stories: "物語",
  },
  es: {
    greetings: "Saludos",
    emotions: "Emociones",
    actions: "Acciones",
    stories: "Historias",
  },
  fr: {
    greetings: "Salutations",
    emotions: "Émotions",
    actions: "Actions",
    stories: "Histoires",
  },
};

// 为指定字符和语言生成多语言条目
const buildLangEntries = (characterId, descObj) => {
  const result = {};

  Object.entries(LABELS).forEach(([lang, labels]) => {
    result[lang] = [
      { id: "greetings", label: labels.greetings, text: descObj.Greetings },
      { id: "emotions", label: labels.emotions, text: descObj.Emotions },
      { id: "actions", label: labels.actions, text: descObj.Actions },
      { id: "stories", label: labels.stories, text: descObj.Stories },
    ];
  });

  return result;
};

// 自动生成VOICE_PRESETS
export const VOICE_PRESETS = Object.keys(characterDescs).reduce(
  (acc, characterId) => {
    acc[characterId] = buildLangEntries(
      characterId,
      characterDescs[characterId]
    );
    return acc;
  },
  {}
);

export const getCharacterPresets = (character, locale = "en") => {
  // 如果找不到指定语言的预设，则返回英文预设，如果也没有英文预设，则返回空数组
  return (
    VOICE_PRESETS[character]?.[locale] || VOICE_PRESETS[character]?.["en"] || []
  );
};
/**
 * 获取所有可用的角色列表
 * @returns {Array} 角色标识符数组
 */
export const getAvailableCharacters = () => {
  return Object.keys(VOICE_PRESETS);
};

/**
 * 获取指定角色支持的语言列表
 * @param {string} character - 角色标识符
 * @returns {Array} 语言代码数组
 */
export const getCharacterLocales = (character) => {
  return VOICE_PRESETS[character] ? Object.keys(VOICE_PRESETS[character]) : [];
};
