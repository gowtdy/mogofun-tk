import { toNuxtLocaleConfig, validLanguages } from './locales'

export { validLanguages } from './locales'

// 定义翻译文件配置，包含文件名和对应的分组
// 每个文件都有明确的分组配置，确保配置完整且便于维护
// 导出类型，供其他模块使用，统一管理组命名
export type TranslationFileGroup = 'tools' | 'tts' | 'sound' | 'vocal'

interface TranslationFileConfig {
  file: string; // 文件名（包含 .json 扩展名）
  group: TranslationFileGroup; // 所属分组
  /** 对外 URL 的 normalized path（无语言前缀）。省略时默认 = file 去掉 .json */
  route?: string;
}

function getConfigRoute(config: TranslationFileConfig): string {
  return config.route ?? config.file.replace(/\.json$/, '');
}

// 翻译文件配置列表：每个文件都明确指定了所属分组
export const translationFilesConfig: TranslationFileConfig[] = [
  // 工具页面组（tools）：基础页面
  { file: 'index.json', group: 'tools' },
  { file: 'first-page.json', group: 'tools' },
  { file: 'text-to-speech.json', group: 'tools' },
  { file: 'sounds-effect.json', group: 'tools' },
  { file: 'vocal-isolator.json', group: 'tools' },
  { file: 'audio-extractor.json', group: 'tools' },
  { file: 'vocal-remover.json', group: 'tools' },
  { file: 'pricing.json', group: 'tools' },
  { file: 'settings.json', group: 'tools' },
  { file: 'about.json', group: 'tools' },
  { file: 'soundeffect_common.json', group: 'tools' },
  // 语音生成页面组（tts）：语音生成工具页面
  { file: 'tts/ai-character-voice-generator.json', group: 'tts', route: 'ai-character-voice-generator' },
  { file: 'tts/ai-girl-voice.json', group: 'tts', route: 'ai-girl-voice' },
  { file: 'tts/ai-voice-girl.json', group: 'tts', route: 'ai-voice-girl' },
  { file: 'tts/amans-voice.json', group: 'tts', route: 'amans-voice' },
  { file: 'tts/audio-male.json', group: 'tts', route: 'audio-male' },
  { file: 'tts/british-accent-generator.json', group: 'tts', route: 'british-accent-generator' },
  { file: 'tts/british-voice.json', group: 'tts', route: 'british-voice' },
  { file: 'tts/cantonese-text-to-speech.json', group: 'tts', route: 'cantonese-text-to-speech' },
  { file: 'tts/deep-voice.json', group: 'tts', route: 'deep-voice' },
  { file: 'tts/fake-voice.json', group: 'tts', route: 'fake-voice' },
  { file: 'tts/female-ai-voice.json', group: 'tts', route: 'female-ai-voice' },
  { file: 'tts/female-voice-generator.json', group: 'tts', route: 'female-voice-generator' },
  { file: 'tts/female-voice-over.json', group: 'tts', route: 'female-voice-over' },
  { file: 'tts/female-voice.json', group: 'tts', route: 'female-voice' },
  { file: 'tts/free-text-to-speech-ai.json', group: 'tts', route: 'free-text-to-speech-ai' },
  { file: 'tts/funny-tts-messages.json', group: 'tts', route: 'funny-tts-messages' },
  { file: 'tts/funny-tts.json', group: 'tts', route: 'funny-tts' },
  { file: 'tts/girl-ai-voice.json', group: 'tts', route: 'girl-ai-voice' },
  { file: 'tts/girl-voice.json', group: 'tts', route: 'girl-voice' },
  { file: 'tts/gossip-girl-voice.json', group: 'tts', route: 'gossip-girl-voice' },
  { file: 'tts/guy-voice.json', group: 'tts', route: 'guy-voice' },
  { file: 'tts/hot-girl-voice-generator.json', group: 'tts', route: 'hot-girl-voice-generator' },
  { file: 'tts/kokoro-tts.json', group: 'tts', route: 'kokoro-tts' },
  { file: 'tts/ladies-voice-converter.json', group: 'tts', route: 'ladies-voice-converter' },
  { file: 'tts/male-audio.json', group: 'tts', route: 'male-audio' },
  { file: 'tts/male-voice.json', group: 'tts', route: 'male-voice' },
  { file: 'tts/male-voices.json', group: 'tts', route: 'male-voices' },
  { file: 'tts/man-audio.json', group: 'tts', route: 'man-audio' },
  { file: 'tts/man-text-to-speech.json', group: 'tts', route: 'man-text-to-speech' },
  { file: 'tts/man-voice-over.json', group: 'tts', route: 'man-voice-over' },
  { file: 'tts/man-voice.json', group: 'tts', route: 'man-voice' },
  { file: 'tts/man-voices.json', group: 'tts', route: 'man-voices' },
  { file: 'tts/mans-voice.json', group: 'tts', route: 'mans-voice' },
  { file: 'tts/a-mans-voice.json', group: 'tts', route: 'a-mans-voice' },
  { file: 'tts/men-voice.json', group: 'tts', route: 'men-voice' },
  { file: 'tts/natural-reader-tts.json', group: 'tts', route: 'natural-reader-tts' },
  { file: 'tts/natural-reader-text-to-speech.json', group: 'tts', route: 'natural-reader-text-to-speech' },
  { file: 'tts/natural-reader.json', group: 'tts', route: 'natural-reader' },
  { file: 'tts/natural-readers.json', group: 'tts', route: 'natural-readers' },
  { file: 'tts/naturalreader.json', group: 'tts', route: 'naturalreader' },
  { file: 'tts/naturalreaders.json', group: 'tts', route: 'naturalreaders' },
  { file: 'tts/read-text.json', group: 'tts', route: 'read-text' },
  { file: 'tts/text-reader.json', group: 'tts', route: 'text-reader' },
  { file: 'tts/text-to-speech-reader.json', group: 'tts', route: 'text-to-speech-reader' },
  { file: 'tts/text-to-voice-female.json', group: 'tts', route: 'text-to-voice-female' },
  { file: 'tts/the-mans-voice.json', group: 'tts', route: 'the-mans-voice' },
  { file: 'tts/tts-mean.json', group: 'tts', route: 'tts-mean' },
  { file: 'tts/tts-meaning.json', group: 'tts', route: 'tts-meaning' },
  { file: 'tts/tts-reader.json', group: 'tts', route: 'tts-reader' },
  { file: 'tts/ttsreader.json', group: 'tts', route: 'ttsreader' },
  { file: 'tts/voice-deep.json', group: 'tts', route: 'voice-deep' },
  { file: 'tts/voice-male.json', group: 'tts', route: 'voice-male' },
  { file: 'tts/voice-man.json', group: 'tts', route: 'voice-man' },
  { file: 'tts/voice-of-male.json', group: 'tts', route: 'voice-of-male' },
  { file: 'tts/voice-of-man.json', group: 'tts', route: 'voice-of-man' },
  { file: 'tts/voiceover-voice-over.json', group: 'tts', route: 'voiceover-voice-over' },
  { file: 'tts/chinese-text-to-speech.json', group: 'tts', route: 'chinese-text-to-speech' },
  { file: 'tts/mandarin-text-to-speech.json', group: 'tts', route: 'mandarin-text-to-speech' },
  { file: 'tts/french-text-to-speech.json', group: 'tts', route: 'french-text-to-speech' },
  { file: 'tts/japanese-text-to-speech.json', group: 'tts', route: 'japanese-text-to-speech' },
  { file: 'tts/japanese-text-to-voice.json', group: 'tts', route: 'japanese-text-to-voice' },
  { file: 'tts/japanese-tts.json', group: 'tts', route: 'japanese-tts' },
  { file: 'tts/spanish-text-to-speech.json', group: 'tts', route: 'spanish-text-to-speech' },
  { file: 'tts/spanish-tts.json', group: 'tts', route: 'spanish-tts' },
  // 人工智能语音页面组（aivoice）：人工智能语音工具页面
  { file: 'aivoice/ai-vocal.json', group: 'tts', route: 'ai-vocal' },
  { file: 'aivoice/ai-vocals.json', group: 'tts', route: 'ai-vocals' },
  { file: 'aivoice/computer-voice.json', group: 'tts', route: 'computer-voice' },
  { file: 'aivoice/text-to-speech-generator.json', group: 'tts', route: 'text-to-speech-generator' },
  // 替代方案页面组（alternative）：替代方案工具页面
  { file: 'alternative/capcut-text-to-speech.json', group: 'tts', route: 'capcut-text-to-speech' },
  { file: 'alternative/capcut-voice-over-alternative.json', group: 'tts', route: 'capcut-voice-over-alternative' },
  { file: 'alternative/capcut-voice-over.json', group: 'tts', route: 'capcut-voice-over' },
  { file: 'alternative/hailuo-ai-voice.json', group: 'tts', route: 'hailuo-ai-voice' },
  { file: 'alternative/speechma-ai-voice.json', group: 'tts', route: 'speechma-ai-voice' },
  { file: 'alternative/speechma.json', group: 'tts', route: 'speechma' },
  { file: 'alternative/twitch-tts.json', group: 'tts', route: 'twitch-tts' },
  { file: 'alternative/ttsmaker.json', group: 'tts', route: 'ttsmaker' },
  // 角色页面组（role）：角色工具页面
  { file: 'role/adam-ai-voice.json', group: 'tts', route: 'adam-ai-voice' },
  { file: 'role/adam-voice.json', group: 'tts', route: 'adam-voice' },
  { file: 'role/adam-voice-ai.json', group: 'tts', route: 'adam-voice-ai' },
  { file: 'role/ghostface.json', group: 'tts', route: 'ghostface' },
  { file: 'role/hey-siri-voice.json', group: 'tts', route: 'hey-siri-voice' },
  { file: 'role/jessie.json', group: 'tts', route: 'jessie' },
  { file: 'role/santa-ai.json', group: 'tts', route: 'santa-ai' },
  { file: 'role/santa-ai-voice.json', group: 'tts', route: 'santa-ai-voice' },
  { file: 'role/santa-audio.json', group: 'tts', route: 'santa-audio' },
  { file: 'role/santa-claus.json', group: 'tts', route: 'santa-claus' },
  { file: 'role/santa-claus-ai.json', group: 'tts', route: 'santa-claus-ai' },
  { file: 'role/santa-text-to-speech.json', group: 'tts', route: 'santa-text-to-speech' },
  { file: 'role/santa-voice.json', group: 'tts', route: 'santa-voice' },
  { file: 'role/santa-voicemail.json', group: 'tts', route: 'santa-voicemail' },
  { file: 'role/siri.json', group: 'tts', route: 'siri' },
  { file: 'role/siri-text-to-speech.json', group: 'tts', route: 'siri-text-to-speech' },
  { file: 'role/siri-voice.json', group: 'tts', route: 'siri-voice' },
  { file: 'role/siri-voices.json', group: 'tts', route: 'siri-voices' },
  { file: 'role/stitch-say.json', group: 'tts', route: 'stitch-say' },
  { file: 'role/stitch-voice.json', group: 'tts', route: 'stitch-voice' },
  { file: 'role/text-to-speech-siri.json', group: 'tts', route: 'text-to-speech-siri' },
  { file: 'role/voice-of-siri.json', group: 'tts', route: 'voice-of-siri' },
  // 故事页面组（story）：故事工具页面
  { file: 'story/read-stories.json', group: 'tts', route: 'read-stories' },
  { file: 'story/story-reader.json', group: 'tts', route: 'story-reader' },
  { file: 'story/story-reading.json', group: 'tts', route: 'story-reading' },
  // 抖音页面组（tiktok）：抖音工具页面
  { file: 'tiktok/tiktok-ai-voice.json', group: 'tts', route: 'tiktok-ai-voice' },
  { file: 'tiktok/tiktok-text-to-speech.json', group: 'tts', route: 'tiktok-text-to-speech' },
  { file: 'tiktok/tiktok-voice-generator.json', group: 'tts', route: 'tiktok-voice-generator' },
  { file: 'tiktok/tiktok-voice-over.json', group: 'tts', route: 'tiktok-voice-over' },
  { file: 'tiktok/tiktok-voice-over-alternative.json', group: 'tts', route: 'tiktok-voice-over-alternative' },
  { file: 'tiktok/tiktok-voiceover.json', group: 'tts', route: 'tiktok-voiceover' },
  // 语音信箱页面组（voicemail）：语音信箱工具页面
  { file: 'voicemail/business-voicemail-greeting.json', group: 'tts', route: 'business-voicemail-greeting' },
  { file: 'voicemail/funny-voicemail-greetings.json', group: 'tts', route: 'funny-voicemail-greetings' },
  { file: 'voicemail/voicemail-greeting.json', group: 'tts', route: 'voicemail-greeting' },
  { file: 'voicemail/professional-voicemail-greeting.json', group: 'tts', route: 'professional-voicemail-greeting' },
  { file: 'voicemail/short-funny-voicemail-greetings.json', group: 'tts', route: 'short-funny-voicemail-greetings' },
  // 声音页面组（sound）：声音工具页面
  { file: 'sound/ai-audio-generator.json', group: 'sound', route: 'ai-audio-generator' },
  { file: 'sound/ai-sfx-generator.json', group: 'sound', route: 'ai-sfx-generator' },
  { file: 'sound/ai-sound-effect.json', group: 'sound', route: 'ai-sound-effect' },
  { file: 'sound/ai-sound-effects.json', group: 'sound', route: 'ai-sound-effects' },
  { file: 'sound/ai-sound-generator.json', group: 'sound', route: 'ai-sound-generator' },
  { file: 'sound/ai-sounds.json', group: 'sound', route: 'ai-sounds' },
  { file: 'sound/air-effect.json', group: 'sound', route: 'air-effect' },
  { file: 'sound/air-horn-noise.json', group: 'sound', route: 'air-horn-noise' },
  { file: 'sound/air-horn-sound-effect.json', group: 'sound', route: 'air-horn-sound-effect' },
  { file: 'sound/air-horn.json', group: 'sound', route: 'air-horn' },
  { file: 'sound/air-noise.json', group: 'sound', route: 'air-noise' },
  { file: 'sound/air-sound-effect.json', group: 'sound', route: 'air-sound-effect' },
  { file: 'sound/air-sound.json', group: 'sound', route: 'air-sound' },
  { file: 'sound/air-sounds.json', group: 'sound', route: 'air-sounds' },
  { file: 'sound/airhorn-sound.json', group: 'sound', route: 'airhorn-sound' },
  { file: 'sound/airhorn.json', group: 'sound', route: 'airhorn' },
  { file: 'sound/alarm-sound-effect.json', group: 'sound', route: 'alarm-sound-effect' },
  { file: 'sound/angry-screaming.json', group: 'sound', route: 'angry-screaming' },
  { file: 'sound/audio-ai.json', group: 'sound', route: 'audio-ai' },
  { file: 'sound/audio-generation.json', group: 'sound', route: 'audio-generation' },
  { file: 'sound/audio-generator.json', group: 'sound', route: 'audio-generator' },
  { file: 'sound/audio-maker.json', group: 'sound', route: 'audio-maker' },
  { file: 'sound/audio-porn.json', group: 'sound', route: 'audio-porn' },
  { file: 'sound/baby-crying-sound-effect.json', group: 'sound', route: 'baby-crying-sound-effect' },
  { file: 'sound/beat-sound.json', group: 'sound', route: 'beat-sound' },
  { file: 'sound/beat-sounds.json', group: 'sound', route: 'beat-sounds' },
  { file: 'sound/bell-audio.json', group: 'sound', route: 'bell-audio' },
  { file: 'sound/bell-cartoon.json', group: 'sound', route: 'bell-cartoon' },
  { file: 'sound/bell-hop.json', group: 'sound', route: 'bell-hop' },
  { file: 'sound/bell-notification.json', group: 'sound', route: 'bell-notification' },
  { file: 'sound/bell-ring-sound.json', group: 'sound', route: 'bell-ring-sound' },
  { file: 'sound/bell-ring.json', group: 'sound', route: 'bell-ring' },
  { file: 'sound/bell-ringing-sound.json', group: 'sound', route: 'bell-ringing-sound' },
  { file: 'sound/bell-rings.json', group: 'sound', route: 'bell-rings' },
  { file: 'sound/bell-sfx.json', group: 'sound', route: 'bell-sfx' },
  { file: 'sound/bell-sound-effect.json', group: 'sound', route: 'bell-sound-effect' },
  { file: 'sound/bell-sound.json', group: 'sound', route: 'bell-sound' },
  { file: 'sound/bells-ringing.json', group: 'sound', route: 'bells-ringing' },
  { file: 'sound/bells-sound.json', group: 'sound', route: 'bells-sound' },
  { file: 'sound/bicycle-sounds.json', group: 'sound', route: 'bicycle-sounds' },
  { file: 'sound/bike-horn-sound.json', group: 'sound', route: 'bike-horn-sound' },
  { file: 'sound/button-sound-effects.json', group: 'sound', route: 'button-sound-effects' },
  { file: 'sound/button-soundboard.json', group: 'sound', route: 'button-soundboard' },
  { file: 'sound/camera-sound-effect.json', group: 'sound', route: 'camera-sound-effect' },
  { file: 'sound/car-crash-sound-effect.json', group: 'sound', route: 'car-crash-sound-effect' },
  { file: 'sound/car-effect.json', group: 'sound', route: 'car-effect' },
  { file: 'sound/car-fx.json', group: 'sound', route: 'car-fx' },
  { file: 'sound/car-noises.json', group: 'sound', route: 'car-noises' },
  { file: 'sound/car-sound-effect.json', group: 'sound', route: 'car-sound-effect' },
  { file: 'sound/car-sound-effects.json', group: 'sound', route: 'car-sound-effects' },
  { file: 'sound/car-sound.json', group: 'sound', route: 'car-sound' },
  { file: 'sound/car-sounds.json', group: 'sound', route: 'car-sounds' },
  { file: 'sound/car-voice.json', group: 'sound', route: 'car-voice' },
  { file: 'sound/cars-sounds.json', group: 'sound', route: 'cars-sounds' },
  { file: 'sound/carsound.json', group: 'sound', route: 'carsound' },
  { file: 'sound/celebration-sound-effect.json', group: 'sound', route: 'celebration-sound-effect' },
  { file: 'sound/countdown-sound-effect.json', group: 'sound', route: 'countdown-sound-effect' },
  { file: 'sound/counter-sound-effect.json', group: 'sound', route: 'counter-sound-effect' },
  { file: 'sound/cry-sounds.json', group: 'sound', route: 'cry-sounds' },
  { file: 'sound/cut-sound-effect.json', group: 'sound', route: 'cut-sound-effect' },
  { file: 'sound/death-sound-effect.json', group: 'sound', route: 'death-sound-effect' },
  { file: 'sound/death-sound.json', group: 'sound', route: 'death-sound' },
  { file: 'sound/die-sound.json', group: 'sound', route: 'die-sound' },
  { file: 'sound/door-bell-sound-effect.json', group: 'sound', route: 'door-bell-sound-effect' },
  { file: 'sound/door-open-sound-effect.json', group: 'sound', route: 'door-open-sound-effect' },
  { file: 'sound/doorbell-sound-effect.json', group: 'sound', route: 'doorbell-sound-effect' },
  { file: 'sound/effect-sound-effect.json', group: 'sound', route: 'effect-sound-effect' },
  { file: 'sound/engine-sound-effect.json', group: 'sound', route: 'engine-sound-effect' },
  { file: 'sound/engine-sound-simulator.json', group: 'sound', route: 'engine-sound-simulator' },
  { file: 'sound/erotic-sounds.json', group: 'sound', route: 'erotic-sounds' },
  { file: 'sound/error-sound-effect.json', group: 'sound', route: 'error-sound-effect' },
  { file: 'sound/explosion-sound-effect.json', group: 'sound', route: 'explosion-sound-effect' },
  { file: 'sound/festival-sound.json', group: 'sound', route: 'festival-sound' },
  { file: 'sound/fire-sound-effect.json', group: 'sound', route: 'fire-sound-effect' },
  { file: 'sound/firework-sounds.json', group: 'sound', route: 'firework-sounds' },
  { file: 'sound/fireworks-sound.json', group: 'sound', route: 'fireworks-sound' },
  { file: 'sound/fireworks-sounds.json', group: 'sound', route: 'fireworks-sounds' },
  { file: 'sound/fuck-sound-effect.json', group: 'sound', route: 'fuck-sound-effect' },
  { file: 'sound/fun-sound.json', group: 'sound', route: 'fun-sound' },
  { file: 'sound/fun-sounds.json', group: 'sound', route: 'fun-sounds' },
  { file: 'sound/funny-audio.json', group: 'sound', route: 'funny-audio' },
  { file: 'sound/funny-audios.json', group: 'sound', route: 'funny-audios' },
  { file: 'sound/funny-meme-sound.json', group: 'sound', route: 'funny-meme-sound' },
  { file: 'sound/funny-meme-sounds.json', group: 'sound', route: 'funny-meme-sounds' },
  { file: 'sound/funny-noises.json', group: 'sound', route: 'funny-noises' },
  { file: 'sound/funny-notification.json', group: 'sound', route: 'funny-notification' },
  { file: 'sound/funny-scream.json', group: 'sound', route: 'funny-scream' },
  { file: 'sound/funny-sound-effect.json', group: 'sound', route: 'funny-sound-effect' },
  { file: 'sound/funny-sound-effects.json', group: 'sound', route: 'funny-sound-effects' },
  { file: 'sound/funny-sound.json', group: 'sound', route: 'funny-sound' },
  { file: 'sound/funny-sounds-effects.json', group: 'sound', route: 'funny-sounds-effects' },
  { file: 'sound/funny-sounqds-effects.json', group: 'sound', route: 'funny-sounqds-effects' },
  { file: 'sound/funny-sounds.json', group: 'sound', route: 'funny-sounds' },
  { file: 'sound/girl-moan.json', group: 'sound', route: 'girl-moan' },
  { file: 'sound/girls-moan.json', group: 'sound', route: 'girls-moan' },
  { file: 'sound/groan-sound.json', group: 'sound', route: 'groan-sound' },
  { file: 'sound/grunt-sound-effect.json', group: 'sound', route: 'grunt-sound-effect' },
  { file: 'sound/gun-sound-effect.json', group: 'sound', route: 'gun-sound-effect' },
  { file: 'sound/gun-sound-effects.json', group: 'sound', route: 'gun-sound-effects' },
  { file: 'sound/gunshot-sfx.json', group: 'sound', route: 'gunshot-sfx' },
  { file: 'sound/gunshot-sound-effect.json', group: 'sound', route: 'gunshot-sound-effect' },
  { file: 'sound/guy-moaning.json', group: 'sound', route: 'guy-moaning' },
  { file: 'sound/guy-screaming.json', group: 'sound', route: 'guy-screaming' },
  { file: 'sound/happy-celebration.json', group: 'sound', route: 'happy-celebration' },
  { file: 'sound/happy-scream.json', group: 'sound', route: 'happy-scream' },
  { file: 'sound/haptic-sound.json', group: 'sound', route: 'haptic-sound' },
  { file: 'sound/horn-noise.json', group: 'sound', route: 'horn-noise' },
  { file: 'sound/horn-sound-effect.json', group: 'sound', route: 'horn-sound-effect' },
  { file: 'sound/horn-sound.json', group: 'sound', route: 'horn-sound' },
  { file: 'sound/horn-sounds.json', group: 'sound', route: 'horn-sounds' },
  { file: 'sound/jumper-sound-effect.json', group: 'sound', route: 'jumper-sound-effect' },
  { file: 'sound/jumpscare-sound-effect.json', group: 'sound', route: 'jumpscare-sound-effect' },
  { file: 'sound/jumpscare-sounds.json', group: 'sound', route: 'jumpscare-sounds' },
  { file: 'sound/laugh-sound-effect.json', group: 'sound', route: 'laugh-sound-effect' },
  { file: 'sound/laughing-sound.json', group: 'sound', route: 'laughing-sound' },
  { file: 'sound/loud-moaning-porn.json', group: 'sound', route: 'loud-moaning-porn' },
  { file: 'sound/loud-porn.json', group: 'sound', route: 'loud-porn' },
  { file: 'sound/loud-scream.json', group: 'sound', route: 'loud-scream' },
  { file: 'sound/loud-screaming.json', group: 'sound', route: 'loud-screaming' },
  { file: 'sound/loud-yelling.json', group: 'sound', route: 'loud-yelling' },
  { file: 'sound/machine-gun-sound.json', group: 'sound', route: 'machine-gun-sound' },
  { file: 'sound/machine-sound-effects.json', group: 'sound', route: 'machine-sound-effects' },
  { file: 'sound/magic-sound-effect.json', group: 'sound', route: 'magic-sound-effect' },
  { file: 'sound/male-moan.json', group: 'sound', route: 'male-moan' },
  { file: 'sound/male-moaning.json', group: 'sound', route: 'male-moaning' },
  { file: 'sound/male-moans.json', group: 'sound', route: 'male-moans' },
  { file: 'sound/meme-scream.json', group: 'sound', route: 'meme-scream' },
  { file: 'sound/meme-sound-effect.json', group: 'sound', route: 'meme-sound-effect' },
  { file: 'sound/meme-sound-effects.json', group: 'sound', route: 'meme-sound-effects' },
  { file: 'sound/meme-sounds-effects.json', group: 'sound', route: 'meme-sounds-effects' },
  { file: 'sound/men-moan.json', group: 'sound', route: 'men-moan' },
  { file: 'sound/men-moaning-porn.json', group: 'sound', route: 'men-moaning-porn' },
  { file: 'sound/men-moaning.json', group: 'sound', route: 'men-moaning' },
  { file: 'sound/men-moans.json', group: 'sound', route: 'men-moans' },
  { file: 'sound/moan-sound-effect.json', group: 'sound', route: 'moan-sound-effect' },
  { file: 'sound/moan-sound.json', group: 'sound', route: 'moan-sound' },
  { file: 'sound/moan-sounds.json', group: 'sound', route: 'moan-sounds' },
  { file: 'sound/moaning-audio.json', group: 'sound', route: 'moaning-audio' },
  { file: 'sound/moaning-noises.json', group: 'sound', route: 'moaning-noises' },
  { file: 'sound/moaning-porn.json', group: 'sound', route: 'moaning-porn' },
  { file: 'sound/moaning-sound-effect.json', group: 'sound', route: 'moaning-sound-effect' },
  { file: 'sound/moaning-sound.json', group: 'sound', route: 'moaning-sound' },
  { file: 'sound/moaning-sounds.json', group: 'sound', route: 'moaning-sounds' },
  { file: 'sound/moans-sounds.json', group: 'sound', route: 'moans-sounds' },
  { file: 'sound/noise-buttons.json', group: 'sound', route: 'noise-buttons' },
  { file: 'sound/noises-funny.json', group: 'sound', route: 'noises-funny' },
  { file: 'sound/pixel-sounds.json', group: 'sound', route: 'pixel-sounds' },
  { file: 'sound/poop-sound.json', group: 'sound', route: 'poop-sound' },
  { file: 'sound/poop-sounds.json', group: 'sound', route: 'poop-sounds' },
  { file: 'sound/porn-audio.json', group: 'sound', route: 'porn-audio' },
  { file: 'sound/porn-moan.json', group: 'sound', route: 'porn-moan' },
  { file: 'sound/porn-moaning.json', group: 'sound', route: 'porn-moaning' },
  { file: 'sound/porn-noises.json', group: 'sound', route: 'porn-noises' },
  { file: 'sound/porn-sound.json', group: 'sound', route: 'porn-sound' },
  { file: 'sound/porn-sounds.json', group: 'sound', route: 'porn-sounds' },
  { file: 'sound/real-sex-sounds.json', group: 'sound', route: 'real-sex-sounds' },
  { file: 'sound/ring-the-bell.json', group: 'sound', route: 'ring-the-bell' },
  { file: 'sound/ringing-bell.json', group: 'sound', route: 'ringing-bell' },
  { file: 'sound/riser-sound-effect.json', group: 'sound', route: 'riser-sound-effect' },
  { file: 'sound/robot-sounds.json', group: 'sound', route: 'robot-sounds' },
  { file: 'sound/rooster-sounds.json', group: 'sound', route: 'rooster-sounds' },
  { file: 'sound/school-bell-sound.json', group: 'sound', route: 'school-bell-sound' },
  { file: 'sound/scream-and-shout.json', group: 'sound', route: 'scream-and-shout' },
  { file: 'sound/scream-audio.json', group: 'sound', route: 'scream-audio' },
  { file: 'sound/scream-loud.json', group: 'sound', route: 'scream-loud' },
  { file: 'sound/scream-louder.json', group: 'sound', route: 'scream-louder' },
  { file: 'sound/scream-noise.json', group: 'sound', route: 'scream-noise' },
  { file: 'sound/scream-sfx.json', group: 'sound', route: 'scream-sfx' },
  { file: 'sound/scream-sound-effect.json', group: 'sound', route: 'scream-sound-effect' },
  { file: 'sound/scream-sound.json', group: 'sound', route: 'scream-sound' },
  { file: 'sound/scream-soundboard.json', group: 'sound', route: 'scream-soundboard' },
  { file: 'sound/scream-voice.json', group: 'sound', route: 'scream-voice' },
  { file: 'sound/screaming-audio.json', group: 'sound', route: 'screaming-audio' },
  { file: 'sound/screaming-noise.json', group: 'sound', route: 'screaming-noise' },
  { file: 'sound/screaming-sound-effect.json', group: 'sound', route: 'screaming-sound-effect' },
  { file: 'sound/screaming-sound.json', group: 'sound', route: 'screaming-sound' },
  { file: 'sound/sex-audio.json', group: 'sound', route: 'sex-audio' },
  { file: 'sound/sex-moans.json', group: 'sound', route: 'sex-moans' },
  { file: 'sound/sex-noise.json', group: 'sound', route: 'sex-noise' },
  { file: 'sound/sex-noises.json', group: 'sound', route: 'sex-noises' },
  { file: 'sound/sex-sound-effects.json', group: 'sound', route: 'sex-sound-effects' },
  { file: 'sound/sex-sound.json', group: 'sound', route: 'sex-sound' },
  { file: 'sound/sex-sounds-porn.json', group: 'sound', route: 'sex-sounds-porn' },
  { file: 'sound/sex-sounds.json', group: 'sound', route: 'sex-sounds' },
  { file: 'sound/sexy-moaning.json', group: 'sound', route: 'sexy-moaning' },
  { file: 'sound/sexy-moans.json', group: 'sound', route: 'sexy-moans' },
  { file: 'sound/sfx-engine.json', group: 'sound', route: 'sfx-engine' },
  { file: 'sound/sfx-sound.json', group: 'sound', route: 'sfx-sound' },
  { file: 'sound/sfx.json', group: 'sound', route: 'sfx' },
  { file: 'sound/shock-sound-effect.json', group: 'sound', route: 'shock-sound-effect' },
  { file: 'sound/shouting-sound-effect.json', group: 'sound', route: 'shouting-sound-effect' },
  { file: 'sound/silent-scream.json', group: 'sound', route: 'silent-scream' },
  { file: 'sound/silly-sound.json', group: 'sound', route: 'silly-sound' },
  { file: 'sound/someone-scream.json', group: 'sound', route: 'someone-scream' },
  { file: 'sound/sound-ai.json', group: 'sound', route: 'sound-ai' },
  { file: 'sound/sound-bell.json', group: 'sound', route: 'sound-bell' },
  { file: 'sound/sound-bottons.json', group: 'sound', route: 'sound-bottons' },
  { file: 'sound/sound-button.json', group: 'sound', route: 'sound-button' },
  { file: 'sound/sound-effect-board.json', group: 'sound', route: 'sound-effect-board' },
  { file: 'sound/sound-effect-button.json', group: 'sound', route: 'sound-effect-button' },
  { file: 'sound/sound-effect-buttons.json', group: 'sound', route: 'sound-effect-buttons' },
  { file: 'sound/sound-effect-creator.json', group: 'sound', route: 'sound-effect-creator' },
  { file: 'sound/sound-effect-maker.json', group: 'sound', route: 'sound-effect-maker' },
  { file: 'sound/sound-effect-soundboard.json', group: 'sound', route: 'sound-effect-soundboard' },
  { file: 'sound/sound-effect.json', group: 'sound', route: 'sound-effect' },
  { file: 'sound/sound-effects-ai.json', group: 'sound', route: 'sound-effects-ai' },
  { file: 'sound/sound-effects-buttons.json', group: 'sound', route: 'sound-effects-buttons' },
  { file: 'sound/sound-effects.json', group: 'sound', route: 'sound-effects' },
  { file: 'sound/sound-generation.json', group: 'sound', route: 'sound-generation' },
  { file: 'sound/sound-generator.json', group: 'sound', route: 'sound-generator' },
  { file: 'sound/sound-generators.json', group: 'sound', route: 'sound-generators' },
  { file: 'sound/sound-horn.json', group: 'sound', route: 'sound-horn' },
  { file: 'sound/sound-make.json', group: 'sound', route: 'sound-make' },
  { file: 'sound/sound-maker.json', group: 'sound', route: 'sound-maker' },
  { file: 'sound/sound-simulator.json', group: 'sound', route: 'sound-simulator' },
  { file: 'sound/soundboard-funny.json', group: 'sound', route: 'soundboard-funny' },
  { file: 'sound/soundboard-guy.json', group: 'sound', route: 'soundboard-guy' },
  { file: 'sound/soundfx.json', group: 'sound', route: 'soundfx' },
  { file: 'sound/sounding-sex.json', group: 'sound', route: 'sounding-sex' },
  { file: 'sound/soundmaker.json', group: 'sound', route: 'soundmaker' },
  { file: 'sound/sounds-ai.json', group: 'sound', route: 'sounds-ai' },
  { file: 'sound/sounds-buttons.json', group: 'sound', route: 'sounds-buttons' },
  { file: 'sound/sounds-fx.json', group: 'sound', route: 'sounds-fx' },
  { file: 'sound/sounds-of-sex.json', group: 'sound', route: 'sounds-of-sex' },
  { file: 'sound/sparkle-sound-effect.json', group: 'sound', route: 'sparkle-sound-effect' },
  { file: 'sound/spatial-audio.json', group: 'sound', route: 'spatial-audio' },
  { file: 'sound/spatial-sound.json', group: 'sound', route: 'spatial-sound' },
  { file: 'sound/swish-sound.json', group: 'sound', route: 'swish-sound' },
  { file: 'sound/taco-bell-sound-effect.json', group: 'sound', route: 'taco-bell-sound-effect' },
  { file: 'sound/text-to-sound-effect.json', group: 'sound', route: 'text-to-sound-effect' },
  { file: 'sound/thunder-sound-effect.json', group: 'sound', route: 'thunder-sound-effect' },
  { file: 'sound/timer-sound.json', group: 'sound', route: 'timer-sound' },
  { file: 'sound/train-horn.json', group: 'sound', route: 'train-horn' },
  { file: 'sound/train-noise.json', group: 'sound', route: 'train-noise' },
  { file: 'sound/train-noises.json', group: 'sound', route: 'train-noises' },
  { file: 'sound/train-sound-effect.json', group: 'sound', route: 'train-sound-effect' },
  { file: 'sound/train-sound-effects.json', group: 'sound', route: 'train-sound-effects' },
  { file: 'sound/train-sound.json', group: 'sound', route: 'train-sound' },
  { file: 'sound/train-sounds.json', group: 'sound', route: 'train-sounds' },
  { file: 'sound/train-voice.json', group: 'sound', route: 'train-voice' },
  { file: 'sound/transition-sfx.json', group: 'sound', route: 'transition-sfx' },
  { file: 'sound/transition-sound-effect.json', group: 'sound', route: 'transition-sound-effect' },
  { file: 'sound/transition-sound-effects.json', group: 'sound', route: 'transition-sound-effects' },
  { file: 'sound/transition-sound.json', group: 'sound', route: 'transition-sound' },
  { file: 'sound/transition-sounds.json', group: 'sound', route: 'transition-sounds' },
  { file: 'sound/truck-audio.json', group: 'sound', route: 'truck-audio' },
  { file: 'sound/truck-honking.json', group: 'sound', route: 'truck-honking' },
  { file: 'sound/truck-horn.json', group: 'sound', route: 'truck-horn' },
  { file: 'sound/truck-sound.json', group: 'sound', route: 'truck-sound' },
  { file: 'sound/truck-sounds.json', group: 'sound', route: 'truck-sounds' },
  { file: 'sound/typewriter-sound-effect.json', group: 'sound', route: 'typewriter-sound-effect' },
  { file: 'sound/typing-sound-effect.json', group: 'sound', route: 'typing-sound-effect' },
  { file: 'sound/vibrator-sound.json', group: 'sound', route: 'vibrator-sound' },
  { file: 'sound/video-sound-effects.json', group: 'sound', route: 'video-sound-effects' },
  { file: 'sound/whisper-sound.json', group: 'sound', route: 'whisper-sound' },
  { file: 'sound/whoosh-effect.json', group: 'sound', route: 'whoosh-effect' },
  { file: 'sound/whoosh-sound-effect.json', group: 'sound', route: 'whoosh-sound-effect' },
  { file: 'sound/whoosh-sound.json', group: 'sound', route: 'whoosh-sound' },
  { file: 'sound/women-moaning.json', group: 'sound', route: 'women-moaning' },
  { file: 'sound/woosh-sfx.json', group: 'sound', route: 'woosh-sfx' },
  { file: 'sound/woosh-sound-effect.json', group: 'sound', route: 'woosh-sound-effect' },
  { file: 'sound/woosh-sound.json', group: 'sound', route: 'woosh-sound' },
  { file: 'sound/yell-sound.json', group: 'sound', route: 'yell-sound' },
  { file: 'sound/yelling-sound.json', group: 'sound', route: 'yelling-sound' },

  // 语音页面组（vocal）：语音分离工具页面
  { file: 'vocal/ai-splitter.json', group: 'vocal', route: 'ai-splitter' },
  { file: 'vocal/ai-stem-splitter.json', group: 'vocal', route: 'ai-stem-splitter' },
  { file: 'vocal/instrumental-remover.json', group: 'vocal', route: 'instrumental-remover' },
  { file: 'vocal/isolate-vocals.json', group: 'vocal', route: 'isolate-vocals' },
  { file: 'vocal/music-remover.json', group: 'vocal', route: 'music-remover' },
  { file: 'vocal/remove-instrument.json', group: 'vocal', route: 'remove-instrument' },
  { file: 'vocal/separate-vocals.json', group: 'vocal', route: 'separate-vocals' },
  { file: 'vocal/splitter-ai.json', group: 'vocal', route: 'splitter-ai' },
  { file: 'vocal/vocal-extractor.json', group: 'vocal', route: 'vocal-extractor' },
  { file: 'vocal/vocal-separator.json', group: 'vocal', route: 'vocal-separator' },
  { file: 'vocal/vocal-splitter.json', group: 'vocal', route: 'vocal-splitter' },
  { file: 'vocal/voice-isolation.json', group: 'vocal', route: 'voice-isolation' },
  { file: 'vocal/voice-isolator.json', group: 'vocal', route: 'voice-isolator' },
];

/** 由 translationFilesConfig 自动生成：normalized route → locale file */
export const routeToTranslationFile: Record<string, string> = Object.fromEntries(
  translationFilesConfig.map((config) => [getConfigRoute(config), config.file])
);

// 导出翻译文件列表（用于 i18n 配置）
export const translationFiles = translationFilesConfig.map(config => config.file);

// 导出文件分组映射表（用于快速查找文件所属分组）
// 同时支持完整路径（如 'role/peter-griffin-voice'）和文件名（如 'peter-griffin-voice'）
export const translationFileGroupMap: Record<string, TranslationFileGroup> = 
  Object.fromEntries([
    ...translationFilesConfig.map(config => [
      config.file.replace(/\.json$/, ''), // 完整路径作为 key（如 'role/peter-griffin-voice'）
      config.group
    ]),
    ...translationFilesConfig.map(config => {
      const fileName = config.file.split('/').pop()?.replace(/\.json$/, '') || '';
      return fileName ? [fileName, config.group] : null; // 文件名作为 key（如 'peter-griffin-voice'）
    }).filter((entry): entry is [string, TranslationFileGroup] => entry !== null)
  ]) as Record<string, TranslationFileGroup>;

// 导出文件分组函数，用于在构建时确定文件所属的分组
export function getTranslationFileGroup(filePath: string): TranslationFileGroup {
  // 移除 .json 扩展名，统一处理
  const normalizedPath = filePath.replace(/\.json$/, '').toLowerCase();
  
  // 先尝试精确匹配（完整文件名）
  if (translationFileGroupMap[normalizedPath]) {
    return translationFileGroupMap[normalizedPath];
  }
  
  // 尝试匹配路径中的文件名部分（处理 role/xxx.json 这种情况）
  const fileName = normalizedPath.split('/').pop() || normalizedPath;
  if (translationFileGroupMap[fileName]) {
    return translationFileGroupMap[fileName];
  }
  
  // 如果没有找到精确匹配，尝试前缀匹配
  // 对于嵌套路径（如 role/peter-griffin-voice），提取最后一部分
  const pathParts = normalizedPath.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  
  // 查找匹配的文件名
  for (const [fileKey, group] of Object.entries(translationFileGroupMap)) {
    const configFileName = fileKey.split('/').pop() || fileKey;
    if (lastPart === configFileName || lastPart.startsWith(configFileName + '-')) {
      return group;
    }
  }
  
  // 默认返回工具组（向后兼容）
  return 'tools';
}

// 从 translationFilesConfig 自动生成路由到翻译文件组的映射表
// 这样可以避免重复配置，统一管理
const routeToGroupMap: Record<string, TranslationFileGroup> = Object.fromEntries(
  translationFilesConfig.flatMap((config) => {
    const routePath = getConfigRoute(config);
    const filePath = config.file.replace(/\.json$/, '');
    return routePath === filePath
      ? [[routePath, config.group]]
      : [
          [routePath, config.group],
          [filePath, config.group]
        ];
  })
);

// 添加特殊路由映射（这些路由没有对应的翻译文件，但需要映射到某个组）
const specialRoutes: Record<string, TranslationFileGroup> = {
  // 首页和基础路由
  '': 'tools',
  '/': 'tools',
  'index': 'tools',
};

// 合并特殊路由映射
Object.assign(routeToGroupMap, specialRoutes);

/**
 * 规范化路由路径（移除语言前缀和斜杠）
 */
function normalizeRoutePath(routePath: string): string {
  // 移除开头的斜杠和语言前缀
  let normalizedPath = routePath.replace(/^\/+/, ''); // 移除开头的斜杠
  
  // 移除语言前缀，使用 validLanguages 配置
  // 注意：需要先检查较长的语言代码（如 'zh-tw'），再检查较短的（如 'zh'），避免误匹配
  const langPrefixes = [...validLanguages].sort((a, b) => b.length - a.length);
  for (const lang of langPrefixes) {
    if (normalizedPath.startsWith(`${lang}/`)) {
      normalizedPath = normalizedPath.substring(lang.length + 1);
      break;
    }
  }
  
  // 移除末尾的斜杠
  normalizedPath = normalizedPath.replace(/\/+$/, '');
  
  return normalizedPath;
}

/**
 * 基础语言文件：对所有请求都必须加载
 * 这些文件在服务器端和客户端都需要显式加载
 */
export const BASE_TRANSLATION_FILES: string[] = ['index.json', 'first-page.json', 'about.json', 'sounds-effect.json', 'vocal-isolator.json', 'audio-extractor.json', 'vocal-remover.json', 'soundeffect_common.json'];

/**
 * 根据路由路径确定需要加载的具体翻译文件列表（不包含基础文件）
 * @param routePath 路由路径，可能包含语言前缀（如 '/ja/role/ariana-grande-voice' 或 '/role/ariana-grande-voice'）
 * @returns 需要加载的翻译文件列表（只包含当前路由对应的文件，不包含基础文件）
 */
export function getRequiredTranslationFiles(routePath: string): string[] {
  const normalizedPath = normalizeRoutePath(routePath);

  if (!normalizedPath) {
    return [];
  }

  const file = routeToTranslationFile[normalizedPath];
  return file ? [file] : [];
}

/**
 * 根据路由路径确定需要加载的翻译文件组
 * @param routePath 路由路径，可能包含语言前缀（如 '/ja/role/ariana-grande-voice' 或 '/role/ariana-grande-voice'）
 * @returns 需要加载的翻译文件组数组
 */
export function getRequiredTranslationGroups(routePath: string): TranslationFileGroup[] {
  const normalizedPath = normalizeRoutePath(routePath);
  
  // 如果路径为空，返回 tools 组（首页）
  if (!normalizedPath || normalizedPath === '') {
    return ['tools'];
  }
  
  // 查找精确匹配
  if (routeToGroupMap[normalizedPath]) {
    const group = routeToGroupMap[normalizedPath];
    // 通用组件可能需要 tools 组的基础翻译，但角色和名人页面通常不需要
    return group === 'tools' ? ['tools'] : ['tools', group];
  }
  
  // 尝试匹配路径的最后一部分（处理嵌套路径）
  const pathParts = normalizedPath.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  
  if (routeToGroupMap[lastPart]) {
    const group = routeToGroupMap[lastPart];
    return group === 'tools' ? ['tools'] : ['tools', group];
  }
  
  // 尝试匹配完整路径（包括 role/ 前缀）
  const fullPath = pathParts.join('/');
  if (routeToGroupMap[fullPath]) {
    const group = routeToGroupMap[fullPath];
    return group === 'tools' ? ['tools'] : ['tools', group];
  }
  
  // 默认返回 tools 组（向后兼容）
  return ['tools'];
}

export const i18nConfig = {
  lazy: true,
  locales: toNuxtLocaleConfig(),
  strategy: 'prefix_and_default' as const,
  defaultLocale: 'en' as const,
  skipSettingLocaleOnNavigate: true,
  detectBrowserLanguage: false as const,
  bundle: {
    optimizeTranslationDirective: true,
    // 启用代码分割，按语言分割
    splitChunks: {
      locales: true,
      // 不按页面分割，将所有翻译文件打包到一个文件中
      // 这样每个语言只生成一个 JS 文件，访问页面时只需加载一个语言的翻译包
      pages: false,
      // 启用压缩（针对翻译内容的额外压缩优化）
      compress: true,
    },
    // 启用运行时优化，移除未使用的翻译键
    runtimeOnly: false,
  },
  // 启用动态导入
  dynamicRouteParams: true,
  // 优化加载策略
  precompile: {
    strictMessage: false,
    escapeHtml: false
  },
  // SSR 兼容配置
  ssr: true,
  // 启用服务端渲染支持
  serverSideTranslation: true
}; 
