/**
 * Sound effect prompt configuration (Nuxt 3 / TypeScript)
 * Maps page keys to categories, categories to prompt examples, and default fallbacks.
 */

export interface SoundEffectPromptExample {
  key: string
  /** vue-i18n message key */
  display: string
}

export type KeywordToCategoryMap = Record<string, string>
export type CategoryToPromptsMap = Record<string, SoundEffectPromptExample[]>
export type KeywordMappingsMap = Record<string, string>

/** Minimum prompt chips shown when padding from defaults */
export const PROMPT_EXAMPLE_TARGET_COUNT = 3

// 关键词到类别的映射（多个关键词可以映射到同一个类别）
export const keywordToCategoryMap: KeywordToCategoryMap = {
    // 武器/枪声相关关键词 → weapon 类别
    'gunshot-sfx': 'weapon',
    'gun-sound-effects': 'weapon',
    'machine-gun-sound': 'weapon',
    'gunshot-sound-effect': 'weapon',
    'gun-sound-effect': 'weapon',
    
    // 汽车声音相关关键词 → car 类别
    'car-sound-effect': 'car',
    'car-sound-effects': 'car',
    'car-crash-sound-effect': 'car',

    // car sound 页面相关关键词 → car-sound 类别
    'car-sound': 'car-sound',

    // car sounds 页面相关关键词 → car-sounds 类别
    'car-sounds': 'car-sounds',

    // car noises 页面相关关键词 → car-noises 类别
    'car-noises': 'car-noises',

    // cars sounds 页面相关关键词 → cars-sounds 类别
    'cars-sounds': 'cars-sounds',

    // carsound 页面相关关键词 → carsound 类别
    'carsound': 'carsound',

    // car effect 页面相关关键词 → car-effect 类别
    'car-effect': 'car-effect',

    // car voice 页面相关关键词 → car-voice 类别
    'car-voice': 'car-voice',

    // car fx 页面相关关键词 → car-fx 类别
    'car-fx': 'car-fx',

    // air sounds 页面相关关键词 → air-sounds 类别
    'air-sounds': 'air-sounds',

    // air sound effect 页面相关关键词 → air-sound-effect 类别
    'air-sound-effect': 'air-sound-effect',

    // airhorn 页面相关关键词 → airhorn 类别
    'airhorn': 'airhorn',

    // air horn 页面相关关键词 → air-horn 类别
    'air-horn': 'air-horn',

    // airhorn sound 页面相关关键词 → airhorn-sound 类别
    'airhorn-sound': 'airhorn-sound',

    // air horn noise 页面相关关键词 → air-horn-noise 类别
    'air-horn-noise': 'air-horn-noise',

    // sound horn 页面相关关键词 → sound-horn 类别
    'sound-horn': 'sound-horn',

    // horn sound 页面相关关键词 → horn-sound 类别
    'horn-sound': 'horn-sound',

    // horn sounds 页面相关关键词 → horn-sounds 类别
    'horn-sounds': 'horn-sounds',

    // horn noise 页面相关关键词 → horn-noise 类别
    'horn-noise': 'horn-noise',

    // truck sounds 页面相关关键词 → truck-sounds 类别
    'truck-sounds': 'truck-sounds',

    // truck sound 页面相关关键词 → truck-sound 类别
    'truck-sound': 'truck-sound',

    // truck audio 页面相关关键词 → truck-audio 类别
    'truck-audio': 'truck-audio',

    // truck horn 页面相关关键词 → truck-horn 类别
    'truck-horn': 'truck-horn',

    // truck honking 页面相关关键词 → truck-honking 类别
    'truck-honking': 'truck-honking',

    // celebration sound effect 页面相关关键词 → celebration-sound-effect 类别
    'celebration-sound-effect': 'celebration-sound-effect',

    // festival sound 页面相关关键词 → festival-sound 类别
    'festival-sound': 'festival-sound',

    // fireworks sounds 页面相关关键词 → fireworks-sounds 类别
    'fireworks-sounds': 'fireworks-sounds',

    // fireworks sound 页面相关关键词 → fireworks-sound 类别
    'fireworks-sound': 'fireworks-sound',

    // firework sounds 页面相关关键词 → firework-sounds 类别
    'firework-sounds': 'firework-sounds',

    // happy celebration 页面相关关键词 → happy-celebration 类别
    'happy-celebration': 'happy-celebration',

    // porn sounds 页面相关关键词 → porn-sounds 类别
    'porn-sounds': 'porn-sounds',

    // porn sound 页面相关关键词 → porn-sound 类别
    'porn-sound': 'porn-sound',

    // porn noises 页面相关关键词 → porn-noises 类别
    'porn-noises': 'porn-noises',

    // audio porn 页面相关关键词 → audio-porn 类别
    'audio-porn': 'audio-porn',

    // porn audio 页面相关关键词 → porn-audio 类别
    'porn-audio': 'porn-audio',

    // loud porn 页面相关关键词 → loud-porn 类别
    'loud-porn': 'loud-porn',

    // porn moaning 页面相关关键词 → porn-moaning 类别
    'porn-moaning': 'porn-moaning',

    // porn moan 页面相关关键词 → porn-moan 类别
    'porn-moan': 'porn-moan',

    // loud moaning porn 页面相关关键词 → loud-moaning-porn 类别
    'loud-moaning-porn': 'loud-moaning-porn',

    // women moaning 页面相关关键词 → women-moaning 类别
    'women-moaning': 'women-moaning',

    // male moans 页面相关关键词 → male-moans 类别
    'male-moans': 'male-moans',

    // men moaning porn 页面相关关键词 → men-moaning-porn 类别
    'men-moaning-porn': 'men-moaning-porn',

    // girls moan 页面相关关键词 → girls-moan 类别
    'girls-moan': 'girls-moan',

    // girl moan 页面相关关键词 → girl-moan 类别
    'girl-moan': 'girl-moan',

    // moaning porn 页面相关关键词 → moaning-porn 类别
    'moaning-porn': 'moaning-porn',

    // moaning sounds 页面相关关键词 → moaning-sounds 类别
    'moaning-sounds': 'moaning-sounds',

    // moaning sound 页面相关关键词 → moaning-sound 类别
    'moaning-sound': 'moaning-sound',

    // moans sounds 页面相关关键词 → moans-sounds 类别
    'moans-sounds': 'moans-sounds',

    // moan sound 页面相关关键词 → moan-sound 类别
    'moan-sound': 'moan-sound',

    // moan sounds 页面相关关键词 → moan-sounds 类别
    'moan-sounds': 'moan-sounds',

    // moaning noises 页面相关关键词 → moaning-noises 类别
    'moaning-noises': 'moaning-noises',

    // sex sounds 页面相关关键词 → sex-sounds 类别
    'sex-sounds': 'sex-sounds',

    // sex audio 页面相关关键词 → sex-audio 类别
    'sex-audio': 'sex-audio',

    // sexy moaning 页面相关关键词 → sex-sound-effects 类别
    'sexy-moaning': 'sex-sound-effects',

    // sexy moans 页面相关关键词 → sexy 类别
    'sexy-moans': 'sexy',

    // sex sound 页面相关关键词 → sex-sound 类别
    'sex-sound': 'sex-sound',

    // sex moans 页面相关关键词 → sex-moans 类别
    'sex-moans': 'sex-moans',

    // sex noises 页面相关关键词 → sex-noises 类别
    'sex-noises': 'sex-noises',

    // sex noise 页面相关关键词 → sex-noise 类别
    'sex-noise': 'sex-noise',

    // sounds of sex 页面相关关键词 → sounds-of-sex 类别
    'sounds-of-sex': 'sounds-of-sex',

    // sex sound effects 页面相关关键词 → sex-sound-effects 类别
    'sex-sound-effects': 'sex-sound-effects',

    // erotic sounds 页面相关关键词 → erotic-sounds 类别
    'erotic-sounds': 'erotic-sounds',

    // real sex sounds 页面相关关键词 → real-sex-sounds 类别
    'real-sex-sounds': 'real-sex-sounds',

    // sounding sex 页面相关关键词 → sounding-sex 类别
    'sounding-sex': 'sounding-sex',

    // sex sounds porn 页面相关关键词 → sex-sounds-porn 类别
    'sex-sounds-porn': 'sex-sounds-porn',

    // vibrator sound 页面相关关键词 → vibrator-sound 类别
    'vibrator-sound': 'vibrator-sound',

    // fuck sound effect 页面相关关键词 → fuck-sound-effect 类别
    'fuck-sound-effect': 'fuck-sound-effect',

    // happy scream 页面相关关键词 → happy-scream 类别
    'happy-scream': 'happy-scream',

    // 死亡声音相关关键词 → death 类别
    'death-sound-effect': 'death',
    'death-sound': 'death',
    'die-sound': 'death',

    // 跳跃式惊吓声音相关关键词 → jumpscare 类别
    'jumper-sound-effect': 'jumpscare',
    'jumpscare-sound-effect': 'jumpscare',
    'jumpscare-sounds': 'jumpscare',

    // 快速掠过声音相关关键词 → woosh 类别
    'woosh-sound-effect': 'woosh',
    'whoosh-sound-effect': 'woosh',

    // woosh sound 页面相关关键词 → woosh-sound 类别
    'woosh-sound': 'woosh-sound',

    // woosh sfx 页面相关关键词 → woosh-sfx 类别
    'woosh-sfx': 'woosh-sfx',

    // whoosh sound 页面相关关键词 → whoosh-sound 类别
    'whoosh-sound': 'whoosh-sound',

    // whoosh effect 页面相关关键词 → whoosh-effect 类别
    'whoosh-effect': 'whoosh-effect',

    // bicycle sounds 页面相关关键词 → bicycle-sounds 类别
    'bicycle-sounds': 'bicycle-sounds',

    // bike horn sound 页面相关关键词 → bike-horn-sound 类别
    'bike-horn-sound': 'bike-horn-sound',

    // train sounds 页面相关关键词 → train-sounds 类别
    'train-sounds': 'train-sounds',

    // train sound 页面相关关键词 → train-sound 类别
    'train-sound': 'train-sound',

    // train sound effect 页面相关关键词 → train-sound-effect 类别
    'train-sound-effect': 'train-sound-effect',

    // train sound effects 页面相关关键词 → train-sound-effects 类别
    'train-sound-effects': 'train-sound-effects',

    // train horn 页面相关关键词 → train-horn 类别
    'train-horn': 'train-horn',

    // train voice 页面相关关键词 → train-voice 类别
    'train-voice': 'train-voice',

    // train noises 页面相关关键词 → train-noises 类别
    'train-noises': 'train-noises',

    // train noise 页面相关关键词 → train-noise 类别
    'train-noise': 'train-noise',

    // swish sound 页面相关关键词 → swish-sound 类别
    'swish-sound': 'swish-sound',

    // transition sound effect 页面相关关键词 → transition-sound-effect 类别
    'transition-sound-effect': 'transition-sound-effect',

    // transition sound effects 页面相关关键词 → transition-sound-effects 类别
    'transition-sound-effects': 'transition-sound-effects',

    // transition sound 页面相关关键词 → transition-sound 类别
    'transition-sound': 'transition-sound',

    // transition sounds 页面相关关键词 → transition-sounds 类别
    'transition-sounds': 'transition-sounds',

    // transition sfx 页面相关关键词 → transition-sfx 类别
    'transition-sfx': 'transition-sfx',

    // 突然的震惊声音相关关键词 → shock 类别
    'shock-sound-effect': 'shock',

    // 尖叫声音相关关键词 → scream 类别
    'scream-sound-effect': 'scream',
    'scream-sfx': 'scream',
    'scream-sound': 'scream',
    'scream-voice': 'scream',

    // 某人尖叫相关关键词 → someone-scream 类别
    'someone-scream': 'someone-scream',

    // 男人尖叫相关关键词 → guy-screaming 类别
    'guy-screaming': 'guy-screaming',

    // 尖叫音效板相关关键词 → scream-soundboard 类别
    'scream-soundboard': 'scream-soundboard',

    // 尖叫声音相关关键词 → screaming 类别
    'screaming-sound-effect': 'screaming',
    'screaming-noise': 'screaming',
    'screaming-sound': 'screaming',

    // 尖叫噪音相关关键词 → scream-noise 类别
    'scream-noise': 'scream-noise',
    
    // 尖叫声音音频相关关键词 
    'screaming-audio': 'scream-audio',
    'scream-audio': 'scream-audio',

    // 大声尖叫声音相关关键词 → loud 类别
    'loud-scream': 'loud',
    'loud-screaming': 'loud',
    'scream-loud': 'loud',

    // 计时器声音相关关键词 → timer 类别
    'timer-sound': 'timer',

    // 雷声相关关键词 → thunder 类别
    'thunder-sound-effect': 'thunder',

    // 排便放屁相关关键词 → poop 类别
    'poop-sounds': 'poop',
    'poop-sound': 'poop',

    // 按键声音相关关键词 → button 类别
    'sound-effects-buttons': 'button',
    'button-sound-effects': 'button',
    'sound-effect-buttons': 'button',
    'sound-effect-button': 'button',

    // 空气声音相关关键词 → air 类别
    'air-horn-sound-effect': 'air',
    'air-sound': 'air',
    'air-noise': 'air',
    'air-effect': 'air',

    // 引擎声音相关关键词 → engine 类别
    'engine-sound-effect': 'engine',
    'engine-sound-simulator': 'engine',

    // 切、剪声音相关关键词 → cut 类别
    'cut-sound-effect': 'cut',

    // 打字声音相关关键词 → typing 类别
    'typing-sound-effect': 'typing',
    'typewriter-sound-effect': 'typing',

    // 机器声音相关关键词 → machine 类别
    'machine-sound-effects': 'machine',

    // 空间声音相关关键词 → spatial 类别
    'spatial-sound': 'spatial',
    'spatial-audio': 'spatial',

    // 婴儿哭声相关关键词 → baby 类别
    'baby-crying-sound-effect': 'baby-crying',

    // 笑声相关关键词 → laughing 类别
    'laughing-sound': 'laughing',
    'laugh-sound-effect': 'laughing',

    // 号角声音相关关键词 → horn 类别
    'horn-sound-effect': 'horn',

    // 计数器相关关键词 → counter 类别
    'counter-sound-effect': 'counter',

    // 倒计时相关关键词 → countdown 类别
    'countdown-sound-effect': 'countdown',

    // 机器人声音相关关键词 → robot 类别
    'robot-sounds': 'robot',

    // 节拍声音/节拍音效相关关键词 → beat 类别
    'beat-sound': 'beat',
    'beat-sounds': 'beat',

    // 呻吟音效相关关键词 → moan 类别
    'moan-sound-effect': 'moan',
    'moaning-sound-effect': 'moan',

    // 男性呻吟相关关键词 → male-moaning 类别
    'male-moaning': 'male-moaning',

    // 男人们呻吟相关关键词 → men-moaning 类别
    'men-moaning': 'men-moaning',

    // 呻吟音频相关关键词 → moaning-audio 类别
    'moaning-audio': 'moaning-audio',

    // 男人呻吟相关关键词 → guy-moaning 类别
    'guy-moaning': 'guy-moaning',

    // 男性呻吟（male moan）相关关键词 → male-moan 类别
    'male-moan': 'male-moan',

    // 男人们呻吟（men moan）相关关键词 → men-moan 类别
    'men-moan': 'men-moan',

    // 男人们呻吟复数（men moans）相关关键词 → men-moans 类别
    'men-moans': 'men-moans',

    // 呻吟声（groan sound）相关关键词 → groan-sound 类别
    'groan-sound': 'groan-sound',

    // 咕哝音效（grunt sound effect）相关关键词 → grunt-sound-effect 类别
    'grunt-sound-effect': 'grunt-sound-effect',

    // 爆炸音效相关关键词 → explosion 类别
    'explosion-sound-effect': 'explosion',

    // 闪光音效相关关键词 → sparkle 类别
    'sparkle-sound-effect': 'sparkle',

    // 鸡鸣音效相关关键词 → rooster 类别
    'rooster-sounds': 'rooster',

    // 相机快门音效相关关键词 → camera 类别
    'camera-sound-effect': 'camera',

    // 耳语/低语音效相关关键词 → whisper 类别
    'whisper-sound': 'whisper',

    // 上升/铺垫音效相关关键词 → riser 类别
    'riser-sound-effect': 'riser',

    // 门铃/钟声/铃声音效相关关键词 → doorbell 类别
    'doorbell-sound-effect': 'doorbell',

    // 开门音效相关关键词 → dooropen 类别
    'door-open-sound-effect': 'dooropen',

    // 学校钟声/钟声/铃声音效相关关键词 → schoolbell 类别
    'school-bell-sound': 'schoolbell',

    // 钟声/铃声音效相关关键词 → bell 类别
    'bell-sound-effect': 'bell',
    'bell-sfx': 'bell',
    'sound-bell': 'bell',
    'bell-sound': 'bell',
    
   // 钟声/铃声音效相关关键词 → hop 类别
    'bell-hop': 'hop',

    // 卡通钟声/铃声音效相关关键词 → cartoon 类别
    'bell-cartoon': 'cartoon',

    // 通知铃声音效相关关键词 → notification 类别
    'bell-notification': 'notification',

    // 铃声/铃声音效相关关键词 → ringing 类别
    'bell-ringing-sound': 'ringing',
    'bell-ring-sound': 'ringing',
    'bells-ringing': 'ringing',
    'ringing-bell': 'ringing',

    // 钟声/铃声音效相关关键词 → ring 类别
    'bell-ring': 'ring',
    'bell-rings': 'ring',
    'ring-the-bell': 'ring',

    // 钟声/铃声音效音频相关关键词 
    'bell-audio': 'bell-audio',

    // 钟声/铃声音效铃声相关关键词 → bells 类别
   'bells-sound': 'bells',

    // 像素音效相关关键词 → pixel 类别
    'pixel-sounds': 'pixel',

    // 触觉/震动音效相关关键词 → haptic 类别
    'haptic-sound': 'haptic',

    // 错误提示音效相关关键词 → error 类别
    'error-sound-effect': 'error',

    // 火焰/火烧音效相关关键词 → fire 类别
    'fire-sound-effect': 'fire',

    // 闹钟/警报音效相关关键词 → alarm 类别
    'alarm-sound-effect': 'alarm',

    // 哭声相关关键词 → cry 类别
    'cry-sounds': 'cry',

    // 叫喊声相关关键词 → yelling 类别
    'yelling-sound': 'yelling',
    'yell-sound': 'yelling',
    'loud-yelling': 'yelling',

    // funny sound 页面相关关键词 → funny-sound 类别
    'funny-sound': 'funny-sound',

    // funny sound effect 页面相关关键词 → funny-sound-effect 类别
    'funny-sound-effect': 'funny-sound-effect',

    // funny sounds 页面相关关键词 → funny-sounds 类别
    'funny-sounds': 'funny-sounds',

    // fun sounds 页面相关关键词 → fun-sounds 类别
    'fun-sounds': 'fun-sounds',

    // fun sound 页面相关关键词 → fun-sound 类别
    'fun-sound': 'fun-sound',

    // funny notification 页面相关关键词 → funny-notification 类别
    'funny-notification': 'funny-notification',

    // funny noises 页面相关关键词 → funny-noises 类别
    'funny-noises': 'funny-noises',

    // funny audio 页面相关关键词 → funny-audio 类别
    'funny-audio': 'funny-audio',

    // funny meme sounds 页面相关关键词 → funny-meme-sounds 类别
    'funny-meme-sounds': 'funny-meme-sounds',

    // funny meme sound 页面相关关键词 → funny-meme-sound 类别
    'funny-meme-sound': 'funny-meme-sound',

    // noises funny 页面相关关键词 → noises-funny 类别
    'noises-funny': 'noises-funny',

    // soundboard funny 页面相关关键词 → soundboard-funny 类别
    'soundboard-funny': 'soundboard-funny',

    // silly sound 页面相关关键词 → silly-sound 类别
    'silly-sound': 'silly-sound',

    // funny audios 页面相关关键词 → funny-audios 类别
    'funny-audios': 'funny-audios',

    // funny scream 页面相关关键词 → funny-scream 类别
    'funny-scream': 'funny-scream',

    // meme scream 页面相关关键词 → meme-scream 类别
    'meme-scream': 'meme-scream',

    // soundboard guy 页面相关关键词 → soundboard-guy 类别
    'soundboard-guy': 'soundboard-guy',

    // silent scream 页面相关关键词 → silent-scream 类别
    'silent-scream': 'silent-scream',

    // scream and shout 页面相关关键词 → scream-and-shout 类别
    'scream-and-shout': 'scream-and-shout',

    // shouting sound effect 页面相关关键词 → shouting-sound-effect 类别
    'shouting-sound-effect': 'shouting-sound-effect',

    // scream louder 页面相关关键词 → scream-louder 类别
    'scream-louder': 'scream-louder',

    // angry screaming 页面相关关键词 → angry-screaming 类别
    'angry-screaming': 'angry-screaming',

    // door bell sound effect 页面相关关键词 → door-bell-sound-effect 类别
    'door-bell-sound-effect': 'door-bell-sound-effect',

    // taco bell sound effect 页面相关关键词 → taco-bell-sound-effect 类别
    'taco-bell-sound-effect': 'taco-bell-sound-effect',

    // sound button 页面相关关键词 → sound-button 类别
    'sound-button': 'sound-button',
    // sound bottons 页面相关关键词 → sound-bottons 类别
    'sound-bottons': 'sound-bottons',
    // sounds buttons 页面相关关键词 → sounds-buttons 类别
    'sounds-buttons': 'sounds-buttons',
    // button soundboard 页面相关关键词 → button-soundboard 类别
    'button-soundboard': 'button-soundboard',
    // noise buttons 页面相关关键词 → noise-buttons 类别
    'noise-buttons': 'noise-buttons',

}
// 类别到提示词的映射（每个类别对应一组提示词）
export const categoryToPrompts: CategoryToPromptsMap = {
    // 武器类别提示词
    'weapon': [
        { key: 'gunshot', display: 'soundeffect_common.prompt_combat.gunshot' },
        { key: 'pistol shot', display: 'soundeffect_common.prompt_combat.pistol_shot' },
        { key: 'firearm shooting', display: 'soundeffect_common.prompt_combat.firearm_shooting' },
        { key: 'weapon fire', display: 'soundeffect_common.prompt_combat.weapon_fire' },
        { key: 'rifle shot', display: 'soundeffect_common.prompt_combat.rifle_shot' },
        { key: 'revolver shot', display: 'soundeffect_common.prompt_combat.revolver_shot' },
        { key: 'machine gun', display: 'soundeffect_common.prompt_combat.machine_gun' },
    ],
    // 汽车声音类别提示词
    'car': [
        { key: 'car horn', display: 'soundeffect_common.prompt_car.car_horn' },
        { key: 'car honk', display: 'soundeffect_common.prompt_car.car_honk' },
        { key: 'vehicle', display: 'soundeffect_common.prompt_car.vehicle' },
        { key: 'car door', display: 'soundeffect_common.prompt_car.car_door' },
        { key: 'automobile', display: 'soundeffect_common.prompt_car.automobile' },
        { key: 'road sound', display: 'soundeffect_common.prompt_car.road_sound' },
        { key: 'car engine', display: 'soundeffect_common.prompt_car.car_engine' },
        { key: 'car crash', display: 'soundeffect_common.prompt_car.car_crash' },
    ],
    // car sound 页面类别提示词
    'car-sound': [
        { key: 'car pass by', display: 'soundeffect_common.prompt_car_sound.car_pass_by' },
        { key: 'car engine', display: 'soundeffect_common.prompt_car_sound.car_engine' },
        { key: 'car crash sound effect', display: 'soundeffect_common.prompt_car_sound.car_crash_sound_effect' },
    ],
    // car sounds 页面类别提示词
    'car-sounds': [
        { key: 'car honk', display: 'soundeffect_common.prompt_car_sounds.car_honk' },
        { key: 'car engine roaring', display: 'soundeffect_common.prompt_car_sounds.car_engine_roaring' },
        { key: 'car door shut', display: 'soundeffect_common.prompt_car_sounds.car_door_shut' },
    ],
    // car noises 页面类别提示词
    'car-noises': [
        { key: 'car honk', display: 'soundeffect_common.prompt_car_noises.car_honk' },
        { key: 'car crash sound effect', display: 'soundeffect_common.prompt_car_noises.car_crash_sound_effect' },
        { key: 'car pass by', display: 'soundeffect_common.prompt_car_noises.car_pass_by' },
    ],
    // cars sounds 页面类别提示词
    'cars-sounds': [
        { key: 'car engine', display: 'soundeffect_common.prompt_cars_sounds.car_engine' },
        { key: 'space sound effect', display: 'soundeffect_common.prompt_cars_sounds.space_sound_effect' },
        { key: 'police siren', display: 'soundeffect_common.prompt_cars_sounds.police_siren' },
    ],
    // carsound 页面类别提示词
    'carsound': [
        { key: 'car door shut', display: 'soundeffect_common.prompt_carsound.car_door_shut' },
        { key: 'car crash', display: 'soundeffect_common.prompt_carsound.car_crash' },
        { key: 'car driving ambience', display: 'soundeffect_common.prompt_carsound.car_driving_ambience' },
    ],
    // car effect 页面类别提示词
    'car-effect': [
        { key: 'car chase sound effect', display: 'soundeffect_common.prompt_car_effect.car_chase_sound_effect' },
        { key: 'car whizzing by', display: 'soundeffect_common.prompt_car_effect.car_whizzing_by' },
        { key: 'car engine roaring', display: 'soundeffect_common.prompt_car_effect.car_engine_roaring' },
    ],
    // car voice 页面类别提示词
    'car-voice': [
        { key: 'allahabad traffic', display: 'soundeffect_common.prompt_car_voice.allahabad_traffic' },
        { key: 'carwash unsuccessful', display: 'soundeffect_common.prompt_car_voice.carwash_unsuccessful' },
        { key: 'city sounds', display: 'soundeffect_common.prompt_car_voice.city_sounds' },
    ],
    // car fx 页面类别提示词
    'car-fx': [
        { key: 'car passing city', display: 'soundeffect_common.prompt_car_fx.car_passing_city' },
        { key: 'heavy race car speeding reverb', display: 'soundeffect_common.prompt_car_fx.heavy_race_car_speeding_reverb' },
        { key: 'siren', display: 'soundeffect_common.prompt_car_fx.siren' },
    ],
    // air sounds 页面类别提示词
    'air-sounds': [
        { key: 'air whoosh', display: 'soundeffect_common.prompt_air_sounds.air_whoosh' },
        { key: 'air raid siren sound effect', display: 'soundeffect_common.prompt_air_sounds.air_raid_siren_sound_effect' },
        { key: 'simple whoosh', display: 'soundeffect_common.prompt_air_sounds.simple_whoosh' },
    ],
    // air sound effect 页面类别提示词
    'air-sound-effect': [
        { key: 'whoosh cinematic sound effect', display: 'soundeffect_common.prompt_air_sound_effect.whoosh_cinematic_sound_effect' },
        { key: 'whoosh effect', display: 'soundeffect_common.prompt_air_sound_effect.whoosh_effect' },
        { key: 'clean whoosh effect', display: 'soundeffect_common.prompt_air_sound_effect.clean_whoosh_effect' },
    ],
    // airhorn 页面类别提示词
    'airhorn': [
        { key: 'air horn sound effect', display: 'soundeffect_common.prompt_airhorn.air_horn_sound_effect' },
        { key: 'dj airhorn sound', display: 'soundeffect_common.prompt_airhorn.dj_airhorn_sound' },
        { key: 'dj airhorn', display: 'soundeffect_common.prompt_airhorn.dj_airhorn' },
    ],
    // air horn 页面类别提示词
    'air-horn': [
        { key: 'air horn', display: 'soundeffect_common.prompt_air_horn.air_horn' },
        { key: 'dj airhorn sound', display: 'soundeffect_common.prompt_air_horn.dj_airhorn_sound' },
        { key: 'truck signal', display: 'soundeffect_common.prompt_air_horn.truck_signal' },
    ],
    // airhorn sound 页面类别提示词
    'airhorn-sound': [
        { key: 'air horn sound effect', display: 'soundeffect_common.prompt_airhorn_sound.air_horn_sound_effect' },
        { key: 'dj airhorn sound', display: 'soundeffect_common.prompt_airhorn_sound.dj_airhorn_sound' },
        { key: 'airhorn fx', display: 'soundeffect_common.prompt_airhorn_sound.airhorn_fx' },
    ],
    // air horn noise 页面类别提示词
    'air-horn-noise': [
        { key: 'air horn', display: 'soundeffect_common.prompt_air_horn_noise.air_horn' },
        { key: 'air horn sound effect', display: 'soundeffect_common.prompt_air_horn_noise.air_horn_sound_effect' },
        { key: 'fire alarm', display: 'soundeffect_common.prompt_air_horn_noise.fire_alarm' },
    ],
    // sound horn 页面类别提示词
    'sound-horn': [
        { key: 'mega horn', display: 'soundeffect_common.prompt_sound_horn.mega_horn' },
        { key: 'boat horn', display: 'soundeffect_common.prompt_sound_horn.boat_horn' },
        { key: 'double car horn', display: 'soundeffect_common.prompt_sound_horn.double_car_horn' },
    ],
    // horn sound 页面类别提示词
    'horn-sound': [
        { key: 'automobile horn', display: 'soundeffect_common.prompt_horn_sound.automobile_horn' },
        { key: 'car honk', display: 'soundeffect_common.prompt_horn_sound.car_honk' },
        { key: 'car horn', display: 'soundeffect_common.prompt_horn_sound.car_horn' },
    ],
    // horn sounds 页面类别提示词
    'horn-sounds': [
        { key: 'ship horn', display: 'soundeffect_common.prompt_horn_sounds.ship_horn' },
        { key: 'war horn', display: 'soundeffect_common.prompt_horn_sounds.war_horn' },
        { key: 'low horn', display: 'soundeffect_common.prompt_horn_sounds.low_horn' },
    ],
    // horn noise 页面类别提示词
    'horn-noise': [
        { key: 'car horn honking', display: 'soundeffect_common.prompt_horn_noise.car_horn_honking' },
        { key: 'electric horn honking', display: 'soundeffect_common.prompt_horn_noise.electric_horn_honking' },
        { key: 'truck horn', display: 'soundeffect_common.prompt_horn_noise.truck_horn' },
    ],
    // truck sounds 页面类别提示词
    'truck-sounds': [
        { key: 'traffic truck ambience', display: 'soundeffect_common.prompt_truck_sounds.traffic_truck_ambience' },
        { key: 'truck chord', display: 'soundeffect_common.prompt_truck_sounds.truck_chord' },
        { key: 'loud machinery', display: 'soundeffect_common.prompt_truck_sounds.loud_machinery' },
    ],
    // truck sound 页面类别提示词
    'truck-sound': [
        { key: 'diesel truck passing', display: 'soundeffect_common.prompt_truck_sound.diesel_truck_passing' },
        { key: 'big truck engine', display: 'soundeffect_common.prompt_truck_sound.big_truck_engine' },
        { key: 'muscle truck', display: 'soundeffect_common.prompt_truck_sound.muscle_truck' },
    ],
    // truck audio 页面类别提示词
    'truck-audio': [
        { key: 'truck door open and close', display: 'soundeffect_common.prompt_truck_audio.truck_door_open_and_close' },
        { key: 'city street soundscape', display: 'soundeffect_common.prompt_truck_audio.city_street_soundscape' },
        { key: 'police siren emergency alarm', display: 'soundeffect_common.prompt_truck_audio.police_siren_emergency_alarm' },
    ],
    // truck horn 页面类别提示词
    'truck-horn': [
        { key: 'truck horn', display: 'soundeffect_common.prompt_truck_horn.truck_horn' },
        { key: 'parisian fire truck siren', display: 'soundeffect_common.prompt_truck_horn.parisian_fire_truck_siren' },
        { key: 'truck signal', display: 'soundeffect_common.prompt_truck_horn.truck_signal' },
    ],
    // truck honking 页面类别提示词
    'truck-honking': [
        { key: 'truck signal', display: 'soundeffect_common.prompt_truck_honking.truck_signal' },
        { key: 'vintage car horn', display: 'soundeffect_common.prompt_truck_honking.vintage_car_horn' },
        { key: 'old car horn', display: 'soundeffect_common.prompt_truck_honking.old_car_horn' },
    ],
    // celebration sound effect 页面类别提示词
    'celebration-sound-effect': [
        { key: 'wow', display: 'soundeffect_common.prompt_celebration_sound_effect.wow' },
        { key: 'applause sound', display: 'soundeffect_common.prompt_celebration_sound_effect.applause_sound' },
        { key: 'crowd cheering', display: 'soundeffect_common.prompt_celebration_sound_effect.crowd_cheering' },
    ],
    // festival sound 页面类别提示词
    'festival-sound': [
        { key: 'applause sound effect', display: 'soundeffect_common.prompt_festival_sound.applause_sound_effect' },
        { key: 'crowd noise at event', display: 'soundeffect_common.prompt_festival_sound.crowd_noise_at_event' },
        { key: 'crowd noise stadium', display: 'soundeffect_common.prompt_festival_sound.crowd_noise_stadium' },
    ],
    // fireworks sounds 页面类别提示词
    'fireworks-sounds': [
        { key: 'fireworks', display: 'soundeffect_common.prompt_fireworks_sounds.fireworks' },
        { key: 'firework whistle', display: 'soundeffect_common.prompt_fireworks_sounds.firework_whistle' },
        { key: 'slow explosion', display: 'soundeffect_common.prompt_fireworks_sounds.slow_explosion' },
    ],
    // fireworks sound 页面类别提示词
    'fireworks-sound': [
        { key: 'crackling fireworks', display: 'soundeffect_common.prompt_fireworks_sound.crackling_fireworks' },
        { key: 'fireworks sound', display: 'soundeffect_common.prompt_fireworks_sound.fireworks_sound' },
        { key: 'new year fireworks', display: 'soundeffect_common.prompt_fireworks_sound.new_year_fireworks' },
    ],
    // firework sounds 页面类别提示词
    'firework-sounds': [
        { key: 'cake firework and mortars', display: 'soundeffect_common.prompt_firework_sounds.cake_firework_and_mortars' },
        { key: 'firework whistle', display: 'soundeffect_common.prompt_firework_sounds.firework_whistle' },
        { key: 'funny firework sound', display: 'soundeffect_common.prompt_firework_sounds.funny_firework_sound' },
    ],
    // happy celebration 页面类别提示词
    'happy-celebration': [
        { key: 'happy loop', display: 'soundeffect_common.prompt_happy_celebration.happy_loop' },
        { key: 'happy birthday', display: 'soundeffect_common.prompt_happy_celebration.happy_birthday' },
        { key: 'kids happy background music', display: 'soundeffect_common.prompt_happy_celebration.kids_happy_background_music' },
    ],
    // porn sounds 页面类别提示词
    'porn-sounds': [
        { key: 'funny sounds', display: 'soundeffect_common.prompt_porn_sounds.funny_sounds' },
        { key: 'birds sounds', display: 'soundeffect_common.prompt_porn_sounds.birds_sounds' },
        { key: 'dire crackling sounds', display: 'soundeffect_common.prompt_porn_sounds.dire_crackling_sounds' },
    ],
    // porn sound 页面类别提示词
    'porn-sound': [
        { key: 'mid nights sound', display: 'soundeffect_common.prompt_porn_sound.mid_nights_sound' },
        { key: 'thud sound effect', display: 'soundeffect_common.prompt_porn_sound.thud_sound_effect' },
        { key: 'heartbeat sound', display: 'soundeffect_common.prompt_porn_sound.heartbeat_sound' },
    ],
    // porn noises 页面类别提示词
    'porn-noises': [
        { key: 'water noises', display: 'soundeffect_common.prompt_porn_noises.water_noises' },
        { key: 'soft brown noise', display: 'soundeffect_common.prompt_porn_noises.soft_brown_noise' },
        { key: 'rainy day in town with birds singing', display: 'soundeffect_common.prompt_porn_noises.rainy_day_in_town_with_birds_singing' },
    ],
    // audio porn 页面类别提示词
    'audio-porn': [
        { key: 'audio for video editing', display: 'soundeffect_common.prompt_audio_porn.audio_for_video_editing' },
        { key: 'birds singing audio tune', display: 'soundeffect_common.prompt_audio_porn.birds_singing_audio_tune' },
        { key: 'retro audio logo', display: 'soundeffect_common.prompt_audio_porn.retro_audio_logo' },
    ],
    // porn audio 页面类别提示词
    'porn-audio': [
        { key: 'audio for video editing', display: 'soundeffect_common.prompt_porn_audio.audio_for_video_editing' },
        { key: 'birds singing audio tune', display: 'soundeffect_common.prompt_porn_audio.birds_singing_audio_tune' },
        { key: 'relaxing guitar loop', display: 'soundeffect_common.prompt_porn_audio.relaxing_guitar_loop' },
    ],
    // loud porn 页面类别提示词
    'loud-porn': [
        { key: 'loud thunder', display: 'soundeffect_common.prompt_loud_porn.loud_thunder' },
        { key: 'baby crying loud', display: 'soundeffect_common.prompt_loud_porn.baby_crying_loud' },
        { key: 'scotland eas alarm', display: 'soundeffect_common.prompt_loud_porn.scotland_eas_alarm' },
    ],
    // porn moaning 页面类别提示词
    'porn-moaning': [
        { key: 'rumbling', display: 'soundeffect_common.prompt_porn_moaning.rumbling' },
        { key: 'free zombie moan sound', display: 'soundeffect_common.prompt_porn_moaning.free_zombie_moan_sound' },
        { key: 'demonic spirit voice', display: 'soundeffect_common.prompt_porn_moaning.demonic_spirit_voice' },
    ],
    // porn moan 页面类别提示词
    'porn-moan': [
        { key: 'creepy ghost moan sfx', display: 'soundeffect_common.prompt_porn_moan.creepy_ghost_moan_sfx' },
        { key: 'ghost moan', display: 'soundeffect_common.prompt_porn_moan.ghost_moan' },
        { key: 'creepy moan', display: 'soundeffect_common.prompt_porn_moan.creepy_moan' },
    ],
    // loud moaning porn 页面类别提示词
    'loud-moaning-porn': [
        { key: 'loud thunder', display: 'soundeffect_common.prompt_loud_moaning_porn.loud_thunder' },
        { key: 'baby crying loud', display: 'soundeffect_common.prompt_loud_moaning_porn.baby_crying_loud' },
        { key: 'moaning wraith', display: 'soundeffect_common.prompt_loud_moaning_porn.moaning_wraith' },
    ],
    // women moaning 页面类别提示词
    'women-moaning': [
        { key: 'demon moaning', display: 'soundeffect_common.prompt_women_moaning.demon_moaning' },
        { key: 'moaning wraith', display: 'soundeffect_common.prompt_women_moaning.moaning_wraith' },
        { key: 'rumbling', display: 'soundeffect_common.prompt_women_moaning.rumbling' },
    ],
    // male moans 页面类别提示词
    'male-moans': [
        { key: 'disapproving male grunt', display: 'soundeffect_common.prompt_male_moans.disapproving_male_grunt' },
        { key: 'male hurt sound', display: 'soundeffect_common.prompt_male_moans.male_hurt_sound' },
        { key: 'male groan of pain', display: 'soundeffect_common.prompt_male_moans.male_groan_of_pain' },
    ],
    // men moaning porn 页面类别提示词
    'men-moaning-porn': [
        { key: 'demonic moaning', display: 'soundeffect_common.prompt_men_moaning_porn.demonic_moaning' },
        { key: 'demon moaning', display: 'soundeffect_common.prompt_men_moaning_porn.demon_moaning' },
        { key: 'horror moaning and groaning', display: 'soundeffect_common.prompt_men_moaning_porn.horror_moaning_and_groaning' },
    ],
    // girls moan 页面类别提示词
    'girls-moan': [
        { key: 'ghost moan', display: 'soundeffect_common.prompt_girls_moan.ghost_moan' },
        { key: 'creepy moan', display: 'soundeffect_common.prompt_girls_moan.creepy_moan' },
        { key: 'big old men moan', display: 'soundeffect_common.prompt_girls_moan.big_old_men_moan' },
    ],
    // girl moan 页面类别提示词
    'girl-moan': [
        { key: 'womansadmoan', display: 'soundeffect_common.prompt_girl_moan.woman_sad_moan' },
        { key: 'woman giving birth', display: 'soundeffect_common.prompt_girl_moan.woman_giving_birth' },
        { key: 'creepy ghost moan sfx', display: 'soundeffect_common.prompt_girl_moan.creepy_ghost_moan_sfx' },
    ],
    // moaning porn 页面类别提示词
    'moaning-porn': [
        { key: 'horror moaning and groaning', display: 'soundeffect_common.prompt_moaning_porn.horror_moaning_and_groaning' },
        { key: 'demon moaning', display: 'soundeffect_common.prompt_moaning_porn.demon_moaning' },
        { key: 'demonic moaning', display: 'soundeffect_common.prompt_moaning_porn.demonic_moaning' },
    ],
    // moaning sounds 页面类别提示词
    'moaning-sounds': [
        { key: 'ghostly moaning', display: 'soundeffect_common.prompt_moaning_sounds.ghostly_moaning' },
        { key: 'zombie call', display: 'soundeffect_common.prompt_moaning_sounds.zombie_call' },
        { key: 'free zombie moan sounds', display: 'soundeffect_common.prompt_moaning_sounds.free_zombie_moan_sounds' },
    ],
    // moaning sound 页面类别提示词
    'moaning-sound': [
        { key: 'demon moaning', display: 'soundeffect_common.prompt_moaning_sound.demon_moaning' },
        { key: 'zombie sound', display: 'soundeffect_common.prompt_moaning_sound.zombie_sound' },
        { key: 'tummy song', display: 'soundeffect_common.prompt_moaning_sound.tummy_song' },
    ],
    // moans sounds 页面类别提示词
    'moans-sounds': [
        { key: 'zombie moan sfx', display: 'soundeffect_common.prompt_moans_sounds.zombie_moan_sfx' },
        { key: 'zombie sfx', display: 'soundeffect_common.prompt_moans_sounds.zombie_sfx' },
        { key: 'zombiesound', display: 'soundeffect_common.prompt_moans_sounds.zombiesound' },
    ],
    // moan sound 页面类别提示词
    'moan-sound': [
        { key: 'creepy ghost sound', display: 'soundeffect_common.prompt_moan_sound.creepy_ghost_sound' },
        { key: 'dogs moan sound', display: 'soundeffect_common.prompt_moan_sound.dogs_moan_sound' },
        { key: 'mumie komt aus sarkophag', display: 'soundeffect_common.prompt_moan_sound.mumie_komt_aus_sarkophag' },
    ],
    // moan sounds 页面类别提示词
    'moan-sounds': [
        { key: 'zombie moan sfx', display: 'soundeffect_common.prompt_moan_sounds.zombie_moan_sfx' },
        { key: 'guttural snarl', display: 'soundeffect_common.prompt_moan_sounds.guttural_snarl' },
        { key: 'zombie moan', display: 'soundeffect_common.prompt_moan_sounds.zombie_moan' },
    ],
    // moaning noises 页面类别提示词
    'moaning-noises': [
        { key: 'hospital icu patient moaning', display: 'soundeffect_common.prompt_moaning_noises.hospital_icu_patient_moaning' },
        { key: 'sex noises dose', display: 'soundeffect_common.prompt_moaning_noises.sex_noises_dose' },
        { key: 'little dog moaning', display: 'soundeffect_common.prompt_moaning_noises.little_dog_moaning' },
    ],
    // sex sounds 页面类别提示词
    'sex-sounds': [
        { key: 'bed sex sounds', display: 'soundeffect_common.prompt_sex_sounds.bed_sex_sounds' },
        { key: 'primal quickie', display: 'soundeffect_common.prompt_sex_sounds.primal_quickie' },
        { key: 'chubby girl sex sound during doggystyle', display: 'soundeffect_common.prompt_sex_sounds.chubby_girl_sex_sound_during_doggystyle' },
    ],
    // sex audio 页面类别提示词
    'sex-audio': [
        { key: 'fucking and parents next door', display: 'soundeffect_common.prompt_sex_audio.fucking_and_parents_next_door' },
        { key: 'sex noises dose', display: 'soundeffect_common.prompt_sex_audio.sex_noises_dose' },
        { key: 'wife squirming in pleasure', display: 'soundeffect_common.prompt_sex_audio.wife_squirming_in_pleasure' },
    ],
    // sex sound 页面类别提示词
    'sex-sound': [
        { key: 'jumpling on a small trampoline squeaking sounds', display: 'soundeffect_common.prompt_sex_sound.jumpling_on_a_small_trampoline_squeaking_sounds' },
        { key: 'body percussion', display: 'soundeffect_common.prompt_sex_sound.body_percussion' },
        { key: 'rough blow job', display: 'soundeffect_common.prompt_sex_sound.rough_blow_job' },
    ],
    // sex moans 页面类别提示词
    'sex-moans': [
        { key: 'moans of a woman', display: 'soundeffect_common.prompt_sex_moans.moans_of_a_woman' },
        { key: 'catherine', display: 'soundeffect_common.prompt_sex_moans.catherine' },
        { key: 'oral sex sounds', display: 'soundeffect_common.prompt_sex_moans.oral_sex_sounds' },
    ],
    // sex noises 页面类别提示词
    'sex-noises': [
        { key: 'sex noises does', display: 'soundeffect_common.prompt_sex_noises.sex_noises_does' },
        { key: 'sex noises close', display: 'soundeffect_common.prompt_sex_noises.sex_noises_close' },
        { key: 'water noises', display: 'soundeffect_common.prompt_sex_noises.water_noises' },
    ],
    // sex noise 页面类别提示词
    'sex-noise': [
        { key: 'sex noise', display: 'soundeffect_common.prompt_sex_noise.sex_noise' },
        { key: 'primal quickie', display: 'soundeffect_common.prompt_sex_noise.primal_quickie' },
        { key: 'dubstep sound', display: 'soundeffect_common.prompt_sex_noise.dubstep_sound' },
    ],
    // sounds of sex 页面类别提示词
    'sounds-of-sex': [
        { key: 'synchronized sex energy', display: 'soundeffect_common.prompt_sounds_of_sex.synchronized_sex_energy' },
        { key: 'slowly making love', display: 'soundeffect_common.prompt_sounds_of_sex.slowly_making_love' },
        { key: 'sex young couple', display: 'soundeffect_common.prompt_sounds_of_sex.sex_young_couple' },
    ],
    // sex sound effects 页面类别提示词
    'sex-sound-effects': [
        { key: 'cute hentai girl voice orgasm sound effect', display: 'soundeffect_common.prompt_sex_sound_effects.cute_hentai_girl_voice_orgasm_sound_effect' },
        { key: 'sexy female moan sound effect', display: 'soundeffect_common.prompt_sex_sound_effects.sexy_female_moan_sound_effect' },
        { key: 'sexy vocals', display: 'soundeffect_common.prompt_sex_sound_effects.sexy_vocals' },
        { key: 'moaning', display: 'soundeffect_common.prompt_sex_sound_effects.moaning' },
    ],
    // erotic sounds 页面类别提示词
    'erotic-sounds': [
        { key: 'diversity of masturbation', display: 'soundeffect_common.prompt_erotic_sounds.diversity_of_masturbation' },
        { key: 'raspy tomboy voice female moan sound effect', display: 'soundeffect_common.prompt_erotic_sounds.raspy_tomboy_voice_female_moan_sound_effect' },
        { key: 'sub breathing nose low', display: 'soundeffect_common.prompt_erotic_sounds.sub_breathing_nose_low' },
    ],
    // sexy moans 页面类别提示词
    'sexy': [
        { key: 'using a new toy with my vibrator', display: 'soundeffect_common.prompt_sexy.using_a_new_toy_with_my_vibrator' },
        { key: 'trans girl moaning and finishing', display: 'soundeffect_common.prompt_sexy.trans_girl_moaning_and_finishing' },
        { key: 'feminine moans', display: 'soundeffect_common.prompt_sexy.feminine_moans' },
    ],
    // real sex sounds 页面类别提示词
    'real-sex-sounds': [
        { key: 'sex of japanese mature couple', display: 'soundeffect_common.prompt_real_sex_sounds.sex_of_japanese_mature_couple' },
        { key: 'sexual intercourse', display: 'soundeffect_common.prompt_real_sex_sounds.sexual_intercourse' },
        { key: 'woman getting fucked', display: 'soundeffect_common.prompt_real_sex_sounds.woman_getting_fucked' },
    ],
    // sounding sex 页面类别提示词
    'sounding-sex': [
        { key: 'chubby girl sex sound during doggystyle', display: 'soundeffect_common.prompt_sounding_sex.chubby_girl_sex_sound_during_doggystyle' },
        { key: 'girl sex sounds', display: 'soundeffect_common.prompt_sounding_sex.girl_sex_sounds' },
        { key: 'synchronized sex energy', display: 'soundeffect_common.prompt_sounding_sex.synchronized_sex_energy' },
    ],
    // sex sounds porn 页面类别提示词
    'sex-sounds-porn': [
        { key: 'funny sounds', display: 'soundeffect_common.prompt_sex_sounds_porn.funny_sounds' },
        { key: 'female cute', display: 'soundeffect_common.prompt_sex_sounds_porn.female_cute' },
        { key: 'porn content creators', display: 'soundeffect_common.prompt_sex_sounds_porn.porn_content_creators' },
    ],
    // vibrator sound 页面类别提示词
    'vibrator-sound': [
        { key: 'cell phone vibration', display: 'soundeffect_common.prompt_vibrator_sound.cell_phone_vibration' },
        { key: 'sound of phone vibrating', display: 'soundeffect_common.prompt_vibrator_sound.sound_of_phone_vibrating' },
        { key: 'alien underworld sound', display: 'soundeffect_common.prompt_vibrator_sound.alien_underworld_sound' },
    ],
    // fuck sound effect 页面类别提示词
    'fuck-sound-effect': [
        { key: 'fuck', display: 'soundeffect_common.prompt_fuck_sound_effect.fuck' },
        { key: 'what a fuck', display: 'soundeffect_common.prompt_fuck_sound_effect.what_a_fuck' },
        { key: 'stupid', display: 'soundeffect_common.prompt_fuck_sound_effect.stupid' },
    ],
    // happy scream 页面类别提示词
    'happy-scream': [
        { key: 'crowd of boys cheering', display: 'soundeffect_common.prompt_happy_scream.crowd_of_boys_cheering' },
        { key: 'woman excited cheers and phrases says woohoo', display: 'soundeffect_common.prompt_happy_scream.woman_excited_cheers_and_phrases_says_woohoo' },
        { key: 'happy new year', display: 'soundeffect_common.prompt_happy_scream.happy_new_year' },
    ],
    // 死亡声音类别提示词
    'death': [
        { key: 'death sound', display: 'soundeffect_common.prompt_death.death_sound' },
        { key: 'man dying sound', display: 'soundeffect_common.prompt_death.man_dying_sound' },
        { key: 'death scream', display: 'soundeffect_common.prompt_death.death_scream' },
    ],
    // 跳跃式惊吓类别提示词
    'jumpscare': [
        { key: 'jump scare', display: 'soundeffect_common.prompt_jumpscare.jump_scare' },
    ],
    // 快速穿过类别提示词
    'woosh': [
        { key: 'woosh sound', display: 'soundeffect_common.prompt_woosh.woosh_sound' },
        { key: 'swoosh sound', display: 'soundeffect_common.prompt_woosh.swoosh_sound' },
        { key: 'whoosh sound', display: 'soundeffect_common.prompt_woosh.whoosh_sound' },
    ],
    // woosh sound 页面类别提示词
    'woosh-sound': [
        { key: 'woosh', display: 'soundeffect_common.prompt_woosh_sound.woosh' },
        { key: 'short woosh', display: 'soundeffect_common.prompt_woosh_sound.short_woosh' },
        { key: 'fast woosh', display: 'soundeffect_common.prompt_woosh_sound.fast_woosh' },
    ],
    // woosh sfx 页面类别提示词
    'woosh-sfx': [
        { key: 'swoosh', display: 'soundeffect_common.prompt_woosh_sfx.swoosh' },
        { key: 'air motion', display: 'soundeffect_common.prompt_woosh_sfx.air_motion' },
        { key: 'creepy hifreq woosh', display: 'soundeffect_common.prompt_woosh_sfx.creepy_hifreq_woosh' },
    ],
    // whoosh sound 页面类别提示词
    'whoosh-sound': [
        { key: 'whoosh cinematic', display: 'soundeffect_common.prompt_whoosh_sound.whoosh_cinematic' },
        { key: 'whoosh cinematic sound effect', display: 'soundeffect_common.prompt_whoosh_sound.whoosh_cinematic_sound_effect' },
        { key: 'simple whoosh', display: 'soundeffect_common.prompt_whoosh_sound.simple_whoosh' },
    ],
    // whoosh effect 页面类别提示词
    'whoosh-effect': [
        { key: 'cinematic whoosh shot', display: 'soundeffect_common.prompt_whoosh_effect.cinematic_whoosh_shot' },
        { key: 'whoosh effect', display: 'soundeffect_common.prompt_whoosh_effect.whoosh_effect' },
        { key: 'whoosh sound effect', display: 'soundeffect_common.prompt_whoosh_effect.whoosh_sound_effect' },
    ],
    // bicycle sounds 页面类别提示词
    'bicycle-sounds': [
        { key: 'bicycle bell sound effect', display: 'soundeffect_common.prompt_bicycle_sounds.bicycle_bell_sound_effect' },
        { key: 'bicycle bell', display: 'soundeffect_common.prompt_bicycle_sounds.bicycle_bell' },
        { key: 'bicycle', display: 'soundeffect_common.prompt_bicycle_sounds.bicycle' },
    ],
    // bike horn sound 页面类别提示词
    'bike-horn-sound': [
        { key: 'horn toy', display: 'soundeffect_common.prompt_bike_horn_sound.horn_toy' },
        { key: 'mega horn', display: 'soundeffect_common.prompt_bike_horn_sound.mega_horn' },
        { key: 'boat horn', display: 'soundeffect_common.prompt_bike_horn_sound.boat_horn' },
    ],
    // train sounds 页面类别提示词
    'train-sounds': [
        { key: 'train', display: 'soundeffect_common.prompt_train_sounds.train' },
        { key: 'inside old train', display: 'soundeffect_common.prompt_train_sounds.inside_old_train' },
        { key: 'railway train', display: 'soundeffect_common.prompt_train_sounds.railway_train' },
    ],
    // train sound 页面类别提示词
    'train-sound': [
        { key: 'train running sound', display: 'soundeffect_common.prompt_train_sound.train_running_sound' },
        { key: 'train passing', display: 'soundeffect_common.prompt_train_sound.train_passing' },
        { key: 'train whistle', display: 'soundeffect_common.prompt_train_sound.train_whistle' },
    ],
    // train sound effect 页面类别提示词
    'train-sound-effect': [
        { key: 'train approach sfx', display: 'soundeffect_common.prompt_train_sound_effect.train_approach_sfx' },
        { key: 'train stopping', display: 'soundeffect_common.prompt_train_sound_effect.train_stopping' },
        { key: 'on the high speed train', display: 'soundeffect_common.prompt_train_sound_effect.on_the_high_speed_train' },
    ],
    // train horn 页面类别提示词
    'train-horn': [
        { key: 'train horn', display: 'soundeffect_common.prompt_train_horn.train_horn' },
        { key: 'train horn fades', display: 'soundeffect_common.prompt_train_horn.train_horn_fades' },
        { key: 'loud train horn', display: 'soundeffect_common.prompt_train_horn.loud_train_horn' },
    ],
    // train voice 页面类别提示词
    'train-voice': [
        { key: 'train voice', display: 'soundeffect_common.prompt_train_voice.train_voice' },
        { key: 'electronic female voice at train station', display: 'soundeffect_common.prompt_train_voice.electronic_female_voice_at_train_station' },
        { key: 'metro train sound', display: 'soundeffect_common.prompt_train_voice.metro_train_sound' },
    ],
    // train noises 页面类别提示词
    'train-noises': [
        { key: 'inside the old train', display: 'soundeffect_common.prompt_train_noises.inside_the_old_train' },
        { key: 'train running sound', display: 'soundeffect_common.prompt_train_noises.train_running_sound' },
        { key: 'train station ambience', display: 'soundeffect_common.prompt_train_noises.train_station_ambience' },
    ],
    // train noise 页面类别提示词
    'train-noise': [
        { key: 'musical train noise', display: 'soundeffect_common.prompt_train_noise.musical_train_noise' },
        { key: 'diesel train engine noise', display: 'soundeffect_common.prompt_train_noise.diesel_train_engine_noise' },
        { key: 'train whistle and environment sounds', display: 'soundeffect_common.prompt_train_noise.train_whistle_and_environment_sounds' },
    ],
    // train sound effects 页面类别提示词
    'train-sound-effects': [
        { key: 'hungarian train ride', display: 'soundeffect_common.prompt_train_sound_effects.hungarian_train_ride' },
        { key: 'incoming commuter train', display: 'soundeffect_common.prompt_train_sound_effects.incoming_commuter_train' },
        { key: 'loud train horn', display: 'soundeffect_common.prompt_train_sound_effects.loud_train_horn' },
    ],
    // swish sound 页面类别提示词
    'swish-sound': [
        { key: 'swish sound', display: 'soundeffect_common.prompt_swish_sound.swish_sound' },
        { key: 'quick double swish sfx', display: 'soundeffect_common.prompt_swish_sound.quick_double_swish_sfx' },
        { key: 'fast swish transition noise', display: 'soundeffect_common.prompt_swish_sound.fast_swish_transition_noise' },
    ],
    // transition sound effect 页面类别提示词
    'transition-sound-effect': [
        { key: 'riser swoosh transition', display: 'soundeffect_common.prompt_transition_sound_effect.riser_swoosh_transition' },
        { key: 'whoosh cinematic sound effect', display: 'soundeffect_common.prompt_transition_sound_effect.whoosh_cinematic_sound_effect' },
        { key: 'scary transition', display: 'soundeffect_common.prompt_transition_sound_effect.scary_transition' },
    ],
    // transition sound effects 页面类别提示词
    'transition-sound-effects': [
        { key: 'futuristic transition', display: 'soundeffect_common.prompt_transition_sound_effects.futuristic_transition' },
        { key: 'professional transition', display: 'soundeffect_common.prompt_transition_sound_effects.professional_transition' },
        { key: 'sweet transition', display: 'soundeffect_common.prompt_transition_sound_effects.sweet_transition' },
    ],
    // transition sound 页面类别提示词
    'transition-sound': [
        { key: 'transition base', display: 'soundeffect_common.prompt_transition_sound.transition_base' },
        { key: 'transition explosion', display: 'soundeffect_common.prompt_transition_sound.transition_explosion' },
        { key: 'transition coat', display: 'soundeffect_common.prompt_transition_sound.transition_coat' },
    ],
    // transition sounds 页面类别提示词
    'transition-sounds': [
        { key: 'high transition', display: 'soundeffect_common.prompt_transition_sounds.high_transition' },
        { key: 'transition fleeting', display: 'soundeffect_common.prompt_transition_sounds.transition_fleeting' },
        { key: 'interface', display: 'soundeffect_common.prompt_transition_sounds.interface' },
    ],
    // transition sfx 页面类别提示词
    'transition-sfx': [
        { key: 'bizzard transition', display: 'soundeffect_common.prompt_transition_sfx.bizzard_transition' },
        { key: 'soft transition', display: 'soundeffect_common.prompt_transition_sfx.soft_transition' },
        { key: 'sand transition', display: 'soundeffect_common.prompt_transition_sfx.sand_transition' },
    ],
    // 突然的震惊声音类别提示词
    'shock': [
        { key: 'eerie sudden shock', display: 'soundeffect_common.prompt_shock.eerie_sudden_shock' },
        { key: 'piano shock impact', display: 'soundeffect_common.prompt_shock.piano_shock_impact' },
        { key: 'crowd shocked reaction', display: 'soundeffect_common.prompt_shock.crowd_shocked_reaction' },
    ],
    // 尖叫声音类别提示词
    'scream': [
        { key: 'loud male scream', display: 'soundeffect_common.prompt_scream.loud_male_scream' },
        { key: 'scary woman scream ultra realistic', display: 'soundeffect_common.prompt_scream.scary_woman_scream_ultra_realistic' },
        { key: 'angry man yell sound', display: 'soundeffect_common.prompt_scream.angry_man_yell_sound' },
        { key: 'woman scream sound', display: 'soundeffect_common.prompt_scream.woman_scream_sound' },
        { key: 'boy character scream', display: 'soundeffect_common.prompt_scream.boy_character_scream' },
        { key: 'baby crying', display: 'soundeffect_common.prompt_scream.baby_crying' },
        { key: 'man scream', display: 'soundeffect_common.prompt_scream.man_scream' },
        { key: 'scary scream', display: 'soundeffect_common.prompt_scream.scary_scream' },
    ],
    // 尖叫声音类别提示词
    'screaming': [
        { key: 'screaming man', display: 'soundeffect_common.prompt_screaming.screaming_man' },
        { key: 'sudden screaming sound', display: 'soundeffect_common.prompt_screaming.sudden_screaming_sound' },
        { key: 'pathetic screaming sound effect', display: 'soundeffect_common.prompt_screaming.pathetic_screaming_sound_effect' },
        { key: 'funny scream', display: 'soundeffect_common.prompt_screaming.funny_scream' },
        { key: 'screaming sound effect', display: 'soundeffect_common.prompt_screaming.screaming_sound_effect' },
    ],
    // 某人尖叫类别提示词
    'someone-scream': [
        { key: 'man scream', display: 'soundeffect_common.prompt_someone_scream.man_scream' },
        { key: 'cartoon scream', display: 'soundeffect_common.prompt_someone_scream.cartoon_scream' },
        { key: 'smirnoff scream', display: 'soundeffect_common.prompt_someone_scream.smirnoff_scream' },
    ],
    // 男人尖叫类别提示词
    'guy-screaming': [
        { key: 'dying guy', display: 'soundeffect_common.prompt_guy_screaming.dying_guy' },
        { key: 'fireworks and screaming', display: 'soundeffect_common.prompt_guy_screaming.fireworks_and_screaming' },
        { key: 'guys howling fun', display: 'soundeffect_common.prompt_guy_screaming.guys_howling_fun' },
    ],
    // 尖叫噪音类别提示词
    'scream-noise': [
        { key: 'unsettling noise', display: 'soundeffect_common.prompt_scream_noise.unsettling_noise' },
        { key: 'ghost horror sound', display: 'soundeffect_common.prompt_scream_noise.ghost_horror_sound' },
        { key: 'cartoon scream', display: 'soundeffect_common.prompt_scream_noise.cartoon_scream' },
    ],
    // 尖叫音效板类别提示词
    'scream-soundboard': [
        { key: 'male death scream horror', display: 'soundeffect_common.prompt_scream_soundboard.male_death_scream_horror' },
        { key: 'falling man scream', display: 'soundeffect_common.prompt_scream_soundboard.falling_man_scream' },
        { key: 'echo scream', display: 'soundeffect_common.prompt_scream_soundboard.echo_scream' },
    ],
    // 尖叫声音音频相关关键词 → audio 类别
    'scream-audio': [
        { key: 'girl screaming sound effect', display: 'soundeffect_common.prompt_scream_audio.girl_screaming_sound_effect' },
        { key: 'crow screaming bird', display: 'soundeffect_common.prompt_scream_audio.crow_screaming_bird' },
        { key: 'female screaming audio', display: 'soundeffect_common.prompt_scream_audio.female_screaming_audio' },
        { key: 'male screaming audio', display: 'soundeffect_common.prompt_scream_audio.male_screaming_audio' },
    ],
    // 大声尖叫声音类别提示词
    'loud': [
        { key: 'corrupt scream', display: 'soundeffect_common.prompt_loud.corrupt_scream' },
        { key: 'male death scream horror', display: 'soundeffect_common.prompt_loud.male_death_scream_horror' },
        { key: 'male voice screaming loudly', display: 'soundeffect_common.prompt_loud.male_voice_screaming_loudly' },
        { key: 'young girl screaming', display: 'soundeffect_common.prompt_loud.young_girl_screaming' },
        { key: 'man angry loud', display: 'soundeffect_common.prompt_loud.man_angry_loud' },
        { key: 'loud female scream', display: 'soundeffect_common.prompt_loud.loud_female_scream' },
    ],
    // 计时器声音类别提示词
    'timer': [
        { key: 'timer sound', display: 'soundeffect_common.prompt_timer.timer_sound' },
        { key: 'timer beep', display: 'soundeffect_common.prompt_timer.timer_beep' },
        { key: 'clock sound', display: 'soundeffect_common.prompt_timer.clock_sound' },
        
    ],
    // 雷声类别提示词
    'thunder': [
        { key: 'thunder sound', display: 'soundeffect_common.prompt_thunder.thunder_sound' },
        { key: 'dry thunder', display: 'soundeffect_common.prompt_thunder.dry_thunder' },
        { key: 'rain and thunder', display: 'soundeffect_common.prompt_thunder.rain_and_thunder' },
    ],

    // 排便放屁类别提示词
    'poop': [
        { key: 'fart bum trumpet poop', display: 'soundeffect_common.prompt_poop.fart_poop' },
        { key: 'fart noises', display: 'soundeffect_common.prompt_poop.fart_noises' },
        { key: 'flush toilet sound', display: 'soundeffect_common.prompt_poop.flush_toilet_sound' },
        
    ],
    // 按键声音类别提示词
    'button': [
        { key: 'button pressed', display: 'soundeffect_common.prompt_button.button_pressed' },
        { key: 'mouse button clicked', display: 'soundeffect_common.prompt_button.mouse_button_clicked' },
        { key: 'telephone button', display: 'soundeffect_common.prompt_button.telephone_button' },
        { key: 'keyboard button', display: 'soundeffect_common.prompt_button.keyboard_button' },
        { key: 'mobile phone button', display: 'soundeffect_common.prompt_button.mobile_phone_button' },
    ],
    // 空气声音类别提示词
    'air': [
        { key: 'air noise', display: 'soundeffect_common.prompt_air.air_noise' },
        { key: 'air horn', display: 'soundeffect_common.prompt_air.air_horn' },
        { key: 'air transition', display: 'soundeffect_common.prompt_air.air_transition' },
        { key: 'air blow', display: 'soundeffect_common.prompt_air.air_blow' },
    ],
    // 引擎声音类别提示词
    'engine': [
        { key: 'engine sound', display: 'soundeffect_common.prompt_engine.engine_sound' },
        { key: 'car engine', display: 'soundeffect_common.prompt_engine.car_engine' },
        { key: 'motorcycle engine', display: 'soundeffect_common.prompt_engine.motorcycle_engine' },

    ], 
    // 切、剪声音类别提示词
    'cut': [
        { key: 'cut food on a cutting board', display: 'soundeffect_common.prompt_cut.cut_food' },
        { key: 'cut using a scissor', display: 'soundeffect_common.prompt_cut.cut_using_scissor' },
        { key: 'cut using a knife', display: 'soundeffect_common.prompt_cut.cut_using_knife' },
        
    ],  
    // 打字声音类别提示词
    'typing': [
        { key: 'keyboard typing', display: 'soundeffect_common.prompt_typing.keyboard_typing' },
        { key: 'typewriter typing', display: 'soundeffect_common.prompt_typing.typewriter_typing' },
        { key: 'laptop typing', display: 'soundeffect_common.prompt_typing.laptop_typing' },
    ],
    // 机器声音类别提示词
    'machine': [
        { key: 'machine working sound', display: 'soundeffect_common.prompt_machine.machine_working_sound' },
        { key: 'washing machine', display: 'soundeffect_common.prompt_machine.washing_machine' },
        { key: 'old machine', display: 'soundeffect_common.prompt_machine.old_machine' },
    ], 
    // 空间声音类别提示词
    'spatial': [
        { key: 'spatial sound', display: 'soundeffect_common.prompt_spatial.spatial_sound' },
        { key: 'space sound', display: 'soundeffect_common.prompt_spatial.space_sound' },
    ],
    // 婴儿哭声
    'baby-crying': [
        { key: 'baby crying', display: 'soundeffect_common.prompt_baby.baby_crying' },
        { key: 'newborn baby crying', display: 'soundeffect_common.prompt_baby.newborn_baby_crying' },
        { key: 'angry baby crying', display: 'soundeffect_common.prompt_baby.angry_baby_crying' },
    ],
    // 哭声类别提示词
    'cry': [
        { key: 'crying and sobbing', display: 'soundeffect_common.prompt_cry_sounds.crying_and_sobbing' },
        { key: 'boy crying free sound', display: 'soundeffect_common.prompt_cry_sounds.boy_crying_free_sound' },
        { key: 'baby crying', display: 'soundeffect_common.prompt_cry_sounds.baby_crying' },
    ],
    // 叫喊声类别提示词
    'yelling': [
        { key: 'random guy on street yelling', display: 'soundeffect_common.prompt_yelling_sound.random_guy_on_street_yelling' },
        { key: 'angry man yell sound', display: 'soundeffect_common.prompt_yelling_sound.angry_man_yell_sound' },
        { key: 'woman enraged fearful scream sound effect', display: 'soundeffect_common.prompt_yelling_sound.woman_enraged_fearful_scream_sound_effect' },
        { key: 'army of soldiers battle cry', display: 'soundeffect_common.prompt_yelling_sound.army_of_soldiers_battle_cry' },
        { key: 'hilarious yelling', display: 'soundeffect_common.prompt_yelling_sound.hilarious_yelling' },
        { key: 'crowd booing', display: 'soundeffect_common.prompt_yelling_sound.crowd_booing' },
    ],
    //笑声类别提示词
    'laughing': [
        { key: 'laughing sound', display: 'soundeffect_common.prompt_laughing.laughing_sound' },
        { key: 'laughing crowd', display: 'soundeffect_common.prompt_laughing.laughing_crowd' },
        { key: 'male laughing', display: 'soundeffect_common.prompt_laughing.male_laughing' },
        { key: 'child laughing', display: 'soundeffect_common.prompt_laughing.child_laughing' },
        { key: 'girl soft laughing', display: 'soundeffect_common.prompt_laughing.girl_soft_laughing' },
    ],
    // 号角声音类别提示词
    'horn': [
        { key: 'car horn', display: 'soundeffect_common.prompt_horn.car_horn' },
        { key: 'war horn', display: 'soundeffect_common.prompt_horn.war_horn' },
        { key: 'mega horn', display: 'soundeffect_common.prompt_horn.mega_horn' },
        { key: 'ship horn', display: 'soundeffect_common.prompt_horn.ship_horn' },
    ],
    // counter类别
    'counter': [
        { key: 'counter sound', display: 'soundeffect_common.prompt_counter.counter_sound' },
        { key: 'banknote counter', display: 'soundeffect_common.prompt_counter.banknote_counter' },
        { key: 'money counter', display: 'soundeffect_common.prompt_counter.money_counter' },
        { key: 'cash counting machine', display: 'soundeffect_common.prompt_counter.cash_counting_machine' },
    ],
    //倒计时类别提示词
    'countdown': [
        { key: 'countdown sound', display: 'soundeffect_common.prompt_countdown.countdown_sound' },
        { key: 'countdown beep', display: 'soundeffect_common.prompt_countdown.countdown_beep' },
        { key: 'game countdown', display: 'soundeffect_common.prompt_countdown.game_countdown' },
    ],
    // 机器人声音类别提示词
    'robot': [
        { key: 'robot voice', display: 'soundeffect_common.prompt_robot.robot_voice' },
        { key: 'robot power off', display: 'soundeffect_common.prompt_robot.robot_power_off' },
        { key: 'robot walk', display: 'soundeffect_common.prompt_robot.robot_walk' },
        { key: 'robot damaged', display: 'soundeffect_common.prompt_robot.robot_damaged' },
    ],
    // 呻吟音效类别提示词
    'moan': [
        { key: 'ghost moan', display: 'soundeffect_common.prompt_moan.ghost_moan' },
        { key: 'creepy moan', display: 'soundeffect_common.prompt_moan.creepy_moan' },
        { key: 'female groaning creepy', display: 'soundeffect_common.prompt_moan.female_groaning_creepy' },
        { key: 'zombie moan sfx', display: 'soundeffect_common.prompt_moan.zombie_moan_sfx' },
        { key: 'demon moaning', display: 'soundeffect_common.prompt_moan.demon_moaning' },
        { key: 'dinosaur creature moaning', display: 'soundeffect_common.prompt_moan.dinosaur_creature_moaning' },
    ],
    // 男性呻吟类别提示词
    'male-moaning': [
        { key: 'disapproving male grunt', display: 'soundeffect_common.prompt_male_moaning.disapproving_male_grunt' },
        { key: 'male groan of pain', display: 'soundeffect_common.prompt_male_moaning.male_groan_of_pain' },
        { key: 'male hurt sound', display: 'soundeffect_common.prompt_male_moaning.male_hurt_sound' },
    ],
    // 男人们呻吟类别提示词
    'men-moaning': [
        { key: 'big old men moan', display: 'soundeffect_common.prompt_men_moaning.big_old_men_moan' },
        { key: 'horror moaning and groaning', display: 'soundeffect_common.prompt_men_moaning.horror_moaning_and_groaning' },
        { key: 'demon moaning', display: 'soundeffect_common.prompt_men_moaning.demon_moaning' },
    ],
    // 呻吟音频类别提示词
    'moaning-audio': [
        { key: 'zombie sfx', display: 'soundeffect_common.prompt_moaning_audio.zombie_sfx' },
        { key: 'zombie sound', display: 'soundeffect_common.prompt_moaning_audio.zombie_sound' },
        { key: 'zombie groan sfx', display: 'soundeffect_common.prompt_moaning_audio.zombie_groan_sfx' },
    ],
    // 男人呻吟类别提示词
    'guy-moaning': [
        { key: 'moaning wraith', display: 'soundeffect_common.prompt_guy_moaning.moaning_wraith' },
        { key: 'womansadmoan', display: 'soundeffect_common.prompt_guy_moaning.womansadmoan' },
        { key: 'rumbling', display: 'soundeffect_common.prompt_guy_moaning.rumbling' },
    ],
    // 男性呻吟（male moan）类别提示词
    'male-moan': [
        { key: 'injury scream', display: 'soundeffect_common.prompt_male_moan.injury_scream' },
        { key: 'big punch short with male moan', display: 'soundeffect_common.prompt_male_moan.big_punch_short_with_male_moan' },
        { key: 'no quite human grunts', display: 'soundeffect_common.prompt_male_moan.no_quite_human_grunts' },
    ],
    // 男人们呻吟（men moan）类别提示词
    'men-moan': [
        { key: 'male hurt sound', display: 'soundeffect_common.prompt_men_moan.male_hurt_sound' },
        { key: 'grunt', display: 'soundeffect_common.prompt_men_moan.grunt' },
        { key: 'ghost moan', display: 'soundeffect_common.prompt_men_moan.ghost_moan' },
    ],
    // 男人们呻吟复数（men moans）类别提示词
    'men-moans': [
        { key: 'lollipopmoans', display: 'soundeffect_common.prompt_men_moans.lollipopmoans' },
        { key: 'big old men moan', display: 'soundeffect_common.prompt_men_moans.big_old_men_moan' },
        { key: 'creepy ghost moan sfx', display: 'soundeffect_common.prompt_men_moans.creepy_ghost_moan_sfx' },
    ],
    // 呻吟声（groan sound）类别提示词
    'groan-sound': [
        { key: 'male groan of pain', display: 'soundeffect_common.prompt_groan_sound.male_groan_of_pain' },
        { key: 'zombie groan sfx', display: 'soundeffect_common.prompt_groan_sound.zombie_groan_sfx' },
        { key: 'zombie call', display: 'soundeffect_common.prompt_groan_sound.zombie_call' },
    ],
    // 咕哝音效（grunt sound effect）类别提示词
    'grunt-sound-effect': [
        { key: 'animal grunt', display: 'soundeffect_common.prompt_grunt_sound_effect.animal_grunt' },
        { key: 'zombie dying sound', display: 'soundeffect_common.prompt_grunt_sound_effect.zombie_dying_sound' },
        { key: 'horse snort', display: 'soundeffect_common.prompt_grunt_sound_effect.horse_snort' },
    ],
    // 爆炸音效类别提示词
    'explosion': [
        { key: 'large underwater explosion', display: 'soundeffect_common.prompt_explosion.large_underwater_explosion' },
        { key: 'explosion fx', display: 'soundeffect_common.prompt_explosion.explosion_fx' },
        { key: 'epic cinematic explosion', display: 'soundeffect_common.prompt_explosion.epic_cinematic_explosion' },
        { key: 'loud explosion', display: 'soundeffect_common.prompt_explosion.loud_explosion' },
    ],
    // 闪光/闪亮音效类别提示词
    'sparkle': [
        { key: 'fairy sparkle', display: 'soundeffect_common.prompt_sparkle.fairy_sparkle' },
        { key: 'sparkle', display: 'soundeffect_common.prompt_sparkle.sparkle' },
        { key: 'sparkle loop', display: 'soundeffect_common.prompt_sparkle.sparkle_loop' },
        { key: 'baby piano', display: 'soundeffect_common.prompt_sparkle.baby_piano' },
    ],
    // 公鸡/鸡鸣音效类别提示词
    'rooster': [
        { key: 'rooster crowing', display: 'soundeffect_common.prompt_rooster.rooster_crowing' },
        { key: 'rooster call', display: 'soundeffect_common.prompt_rooster.rooster_call' },
        { key: 'rooster', display: 'soundeffect_common.prompt_rooster.rooster' },
    ],
    // 相机快门音效类别提示词
    'camera': [
        { key: 'camera shutter', display: 'soundeffect_common.prompt_camera.camera_shutter' },
        { key: 'film camera shutter with auto winder', display: 'soundeffect_common.prompt_camera.film_camera_shutter_with_auto_winder' },
        { key: 'camera', display: 'soundeffect_common.prompt_camera.camera' },
    ],
    // 耳语音效类别提示词
    'whisper': [
        { key: 'whispering', display: 'soundeffect_common.prompt_whisper.whispering' },
        { key: 'creepy whispering', display: 'soundeffect_common.prompt_whisper.creepy_whispering' },
        { key: 'murmullos', display: 'soundeffect_common.prompt_whisper.murmullos' },
        { key: 'ghost whispers', display: 'soundeffect_common.prompt_whisper.ghost_whispers' },
    ],
    // 上升音效类别提示词
    'riser': [
        { key: 'riser somewhere', display: 'soundeffect_common.prompt_riser.riser_somewhere' },
        { key: 'riser hole', display: 'soundeffect_common.prompt_riser.riser_hole' },
        { key: 'dramatic riser', display: 'soundeffect_common.prompt_riser.dramatic_riser' },
    ],
    // 像素音效类别提示词
    'pixel': [
        { key: 'pixel sound effect', display: 'soundeffect_common.prompt_pixel.pixel_sound_effect' },
        { key: 'pixel level up sound', display: 'soundeffect_common.prompt_pixel.pixel_level_up_sound' },
        { key: 'static noise', display: 'soundeffect_common.prompt_pixel.static_noise' },
    ],
    // 触觉/震动音效类别提示词
    'haptic': [
        { key: 'thud sound effect', display: 'soundeffect_common.prompt_haptic.thud_sound_effect' },
        { key: 'mid nights sound', display: 'soundeffect_common.prompt_haptic.mid_nights_sound' },
        { key: 'screenshot iphone sound', display: 'soundeffect_common.prompt_haptic.screenshot_iphone_sound' },
    ],
    // 错误提示音效类别提示词
    'error': [
        { key: 'bad machine', display: 'soundeffect_common.prompt_error.bad_machine' },
        { key: 'error beep sound', display: 'soundeffect_common.prompt_error.error_beep_sound' },
        { key: 'sound of error beep', display: 'soundeffect_common.prompt_error.sound_of_error_beep' },
    ],
    // 火焰/火烧音效类别提示词
    'fire': [
        { key: 'fire sound', display: 'soundeffect_common.prompt_fire.fire_sound' },
        { key: 'plasma gun fire', display: 'soundeffect_common.prompt_fire.plasma_gun_fire' },
        { key: 'fire forest', display: 'soundeffect_common.prompt_fire.fire_forest' },
    ],
    // 闹钟/警报音效类别提示词
    'alarm': [
        { key: 'alarm', display: 'soundeffect_common.prompt_alarm.alarm' },
        { key: 'alarm siren sound effect', display: 'soundeffect_common.prompt_alarm.alarm_siren_sound_effect' },
        { key: 'biohazard alarm', display: 'soundeffect_common.prompt_alarm.biohazard_alarm' },
    ],
    // funny sound 页面类别提示词
    'funny-sound': [
        { key: 'funny cartoon sound', display: 'soundeffect_common.prompt_funny_sound.funny_cartoon_sound' },
        { key: 'funny sounds', display: 'soundeffect_common.prompt_funny_sound.funny_sounds' },
        { key: 'funny alarm', display: 'soundeffect_common.prompt_funny_sound.funny_alarm' },
    ],
    // funny sound effect 页面类别提示词
    'funny-sound-effect': [
        { key: 'funny boing flecatone wobble', display: 'soundeffect_common.prompt_funny_sound_effect.funny_boing_flecatone_wobble' },
        { key: 'cartoon slide sound effect', display: 'soundeffect_common.prompt_funny_sound_effect.cartoon_slide_sound_effect' },
        { key: 'fart', display: 'soundeffect_common.prompt_funny_sound_effect.fart' },
    ],
    // funny sounds 页面类别提示词
    'funny-sounds': [
        { key: 'funny sounds', display: 'soundeffect_common.prompt_funny_sounds.funny_sounds' },
        { key: 'funny dramatic gasp', display: 'soundeffect_common.prompt_funny_sounds.funny_dramatic_gasp' },
        { key: 'funny laughing sound', display: 'soundeffect_common.prompt_funny_sounds.funny_laughing_sound' },
    ],
    // fun sounds 页面类别提示词
    'fun-sounds': [
        { key: 'pipe', display: 'soundeffect_common.prompt_fun_sounds.pipe' },
        { key: 'fun comedic drum', display: 'soundeffect_common.prompt_fun_sounds.fun_comedic_drum' },
        { key: 'funny laughing sound effect', display: 'soundeffect_common.prompt_fun_sounds.funny_laughing_sound_effect' },
    ],
    // fun sound 页面类别提示词
    'fun-sound': [
        { key: 'sweet game over sound effect', display: 'soundeffect_common.prompt_fun_sound.sweet_game_over_sound_effect' },
        { key: 'funny cartoon sound', display: 'soundeffect_common.prompt_fun_sound.funny_cartoon_sound' },
        { key: 'another funny laughing sound effect', display: 'soundeffect_common.prompt_fun_sound.another_funny_laughing_sound_effect' },
    ],
    // funny notification 页面类别提示词
    'funny-notification': [
        { key: 'funny minion message notification sound effect sfx', display: 'soundeffect_common.prompt_funny_notification.funny_minion_message_notification_sound_effect_sfx' },
        { key: 'funny message notification sound effect sfx', display: 'soundeffect_common.prompt_funny_notification.funny_message_notification_sound_effect_sfx' },
        { key: 'funny hiphop party notification music sound', display: 'soundeffect_common.prompt_funny_notification.funny_hiphop_party_notification_music_sound' },
    ],
    // funny noises 页面类别提示词
    'funny-noises': [
        { key: 'funny grunt noises', display: 'soundeffect_common.prompt_funny_noises.funny_grunt_noises' },
        { key: 'fah', display: 'soundeffect_common.prompt_funny_noises.fah' },
        { key: 'funny spring sound', display: 'soundeffect_common.prompt_funny_noises.funny_spring_sound' },
    ],
    // funny audio 页面类别提示词
    'funny-audio': [
        { key: 'funny hysteric scream', display: 'soundeffect_common.prompt_funny_audio.funny_hysteric_scream' },
        { key: 'tatsumaki senpuu', display: 'soundeffect_common.prompt_funny_audio.tatsumaki_senpuu' },
        { key: 'funny cartoon sound', display: 'soundeffect_common.prompt_funny_audio.funny_cartoon_sound' },
    ],
    // funny meme sounds 页面类别提示词
    'funny-meme-sounds': [
        { key: 'thud sound effect', display: 'soundeffect_common.prompt_funny_meme_sounds.thud_sound_effect' },
        { key: 'isnt that amazing meme sfx', display: 'soundeffect_common.prompt_funny_meme_sounds.isnt_that_amazing_meme_sfx' },
        { key: 'laughing man', display: 'soundeffect_common.prompt_funny_meme_sounds.laughing_man' },
    ],
    // funny meme sound 页面类别提示词
    'funny-meme-sound': [
        { key: 'thud sound effect', display: 'soundeffect_common.prompt_funny_meme_sound.thud_sound_effect' },
        { key: 'laughing man', display: 'soundeffect_common.prompt_funny_meme_sound.laughing_man' },
        { key: 'sarcastic clapping sound', display: 'soundeffect_common.prompt_funny_meme_sound.sarcastic_clapping_sound' },
    ],
    // noises funny 页面类别提示词
    'noises-funny': [
        { key: 'funny burp sound effect', display: 'soundeffect_common.prompt_noises_funny.funny_burp_sound_effect' },
        { key: 'funny gurgling noises', display: 'soundeffect_common.prompt_noises_funny.funny_gurgling_noises' },
        { key: 'funny grunt noises', display: 'soundeffect_common.prompt_noises_funny.funny_grunt_noises' },
    ],
    // soundboard funny 页面类别提示词
    'soundboard-funny': [
        { key: 'air horn sound effect', display: 'soundeffect_common.prompt_soundboard_funny.air_horn_sound_effect' },
        { key: 'funny laughing', display: 'soundeffect_common.prompt_soundboard_funny.funny_laughing' },
        { key: 'funny african tabla', display: 'soundeffect_common.prompt_soundboard_funny.funny_african_tabla' },
    ],
    // silly sound 页面类别提示词
    'silly-sound': [
        { key: 'squeakish sound', display: 'soundeffect_common.prompt_silly_sound.squeakish_sound' },
        { key: 'silly trumpet', display: 'soundeffect_common.prompt_silly_sound.silly_trumpet' },
        { key: 'fail trumpet', display: 'soundeffect_common.prompt_silly_sound.fail_trumpet' },
    ],
    // funny audios 页面类别提示词
    'funny-audios': [
        { key: 'funny spring', display: 'soundeffect_common.prompt_funny_audios.funny_spring' },
        { key: 'wazzup man', display: 'soundeffect_common.prompt_funny_audios.wazzup_man' },
        { key: 'laughing male mp3 sound', display: 'soundeffect_common.prompt_funny_audios.laughing_male_mp3_sound' },
    ],
    // funny scream 页面类别提示词
    'funny-scream': [
        { key: 'funny scream', display: 'soundeffect_common.prompt_funny_scream.funny_scream' },
        { key: 'insane funny scream', display: 'soundeffect_common.prompt_funny_scream.insane_funny_scream' },
        { key: 'man scream', display: 'soundeffect_common.prompt_funny_scream.man_scream' },
    ],
    // meme scream 页面类别提示词
    'meme-scream': [
        { key: 'sus meme sound', display: 'soundeffect_common.prompt_meme_scream.sus_meme_sound' },
        { key: 'new meme', display: 'soundeffect_common.prompt_meme_scream.new_meme' },
        { key: 'insane funny scream', display: 'soundeffect_common.prompt_meme_scream.insane_funny_scream' },
    ],
    // soundboard guy 页面类别提示词
    'soundboard-guy': [
        { key: 'realizations or fighting', display: 'soundeffect_common.prompt_soundboard_guy.realizations_or_fighting' },
        { key: 'dying guy', display: 'soundeffect_common.prompt_soundboard_guy.dying_guy' },
        { key: 'shy guy', display: 'soundeffect_common.prompt_soundboard_guy.shy_guy' },
    ],
    // silent scream 页面类别提示词
    'silent-scream': [
        { key: 'cartoon scream', display: 'soundeffect_common.prompt_silent_scream.cartoon_scream' },
        { key: 'smirnoff scream', display: 'soundeffect_common.prompt_silent_scream.smirnoff_scream' },
        { key: 'eagle scream', display: 'soundeffect_common.prompt_silent_scream.eagle_scream' },
    ],
    // scream and shout 页面类别提示词
    'scream-and-shout': [
        { key: 'zombie yell and shout sound effect', display: 'soundeffect_common.prompt_scream_and_shout.zombie_yell_and_shout_sound_effect' },
        { key: 'epic war combat scream', display: 'soundeffect_common.prompt_scream_and_shout.epic_war_combat_scream' },
        { key: 'man shout like a goat', display: 'soundeffect_common.prompt_scream_and_shout.man_shout_like_a_goat' },
    ],
    // shouting sound effect 页面类别提示词
    'shouting-sound-effect': [
        { key: 'army of soldiers battle cry', display: 'soundeffect_common.prompt_shouting_sound_effect.army_of_soldiers_battle_cry' },
        { key: 'male shouting fire', display: 'soundeffect_common.prompt_shouting_sound_effect.male_shouting_fire' },
        { key: 'distorted background sound', display: 'soundeffect_common.prompt_shouting_sound_effect.distorted_background_sound' },
    ],
    // scream louder 页面类别提示词
    'scream-louder': [
        { key: 'man scream', display: 'soundeffect_common.prompt_scream_louder.man_scream' },
        { key: 'scream horror sfx', display: 'soundeffect_common.prompt_scream_louder.scream_horror_sfx' },
        { key: 'male death scream horror', display: 'soundeffect_common.prompt_scream_louder.male_death_scream_horror' },
    ],
    // angry screaming 页面类别提示词
    'angry-screaming': [
        { key: 'screaming man', display: 'soundeffect_common.prompt_angry_screaming.screaming_man' },
        { key: 'muffled angry screaming', display: 'soundeffect_common.prompt_angry_screaming.muffled_angry_screaming' },
        { key: 'angry baby', display: 'soundeffect_common.prompt_angry_screaming.angry_baby' },
    ],
    // door bell sound effect 页面类别提示词
    'door-bell-sound-effect': [
        { key: 'door bell sound effect', display: 'soundeffect_common.prompt_door_bell_sound_effect.door_bell_sound_effect' },
        { key: 'doorbell sound effect', display: 'soundeffect_common.prompt_door_bell_sound_effect.doorbell_sound_effect' },
        { key: 'door bell', display: 'soundeffect_common.prompt_door_bell_sound_effect.door_bell' },
    ],
    // taco bell sound effect 页面类别提示词
    'taco-bell-sound-effect': [
        { key: 'taco bell rong', display: 'soundeffect_common.prompt_taco_bell_sound_effect.taco_bell_rong' },
        { key: 'church bell sound effect', display: 'soundeffect_common.prompt_taco_bell_sound_effect.church_bell_sound_effect' },
        { key: 'bell ring', display: 'soundeffect_common.prompt_taco_bell_sound_effect.bell_ring' },
    ],
    // sound button 页面类别提示词
    'sound-button': [
        { key: 'button press', display: 'soundeffect_common.prompt_sound_button.button_press' },
        { key: 'interface button', display: 'soundeffect_common.prompt_sound_button.interface_button' },
        { key: 'click button', display: 'soundeffect_common.prompt_sound_button.click_button' },
    ],
    // sound bottons 页面类别提示词
    'sound-bottons': [
        { key: 'broken expending machine', display: 'soundeffect_common.prompt_sound_bottons.broken_expending_machine' },
        { key: 'thud sound effect', display: 'soundeffect_common.prompt_sound_bottons.thud_sound_effect' },
        { key: 'mid nights sound', display: 'soundeffect_common.prompt_sound_bottons.mid_nights_sound' },
    ],
    // sounds buttons 页面类别提示词
    'sounds-buttons': [
        { key: 'button press', display: 'soundeffect_common.prompt_sounds_buttons.button_press' },
        { key: 'computer mouse click', display: 'soundeffect_common.prompt_sounds_buttons.computer_mouse_click' },
        { key: 'sound of mouse click', display: 'soundeffect_common.prompt_sounds_buttons.sound_of_mouse_click' },
    ],
    // button soundboard 页面类别提示词
    'button-soundboard': [
        { key: 'air horn sound effect', display: 'soundeffect_common.prompt_button_soundboard.air_horn_sound_effect' },
        { key: 'button press', display: 'soundeffect_common.prompt_button_soundboard.button_press' },
        { key: 'select button ui', display: 'soundeffect_common.prompt_button_soundboard.select_button_ui' },
    ],
    // noise buttons 页面类别提示词
    'noise-buttons': [
        { key: 'button press', display: 'soundeffect_common.prompt_noise_buttons.button_press' },
        { key: 'noisy switch', display: 'soundeffect_common.prompt_noise_buttons.noisy_switch' },
        { key: 'microwave beeps', display: 'soundeffect_common.prompt_noise_buttons.microwave_beeps' },
    ],
    //门铃声音效类别提示词
    'dooropen': [
        { key: 'open car door', display: 'soundeffect_common.prompt_dooropen.open_car_door' },
        { key: 'door opening', display: 'soundeffect_common.prompt_dooropen.door_opening' },
        { key: 'opening door', display: 'soundeffect_common.prompt_dooropen.opening_door' },
    ],
    // 门铃声音效类别提示词
    'doorbell': [
        { key: 'doorbell chhiming', display: 'soundeffect_common.prompt_doorbell.doorbell_chiming' },
        { key: 'doorbell', display: 'soundeffect_common.prompt_doorbell.doorbell' },
        { key: 'vintage doorbell ring sound effect', display: 'soundeffect_common.prompt_doorbell.vintage_doorbell_ring_sound_effect' },
    ],
    // 钟声/铃声音效类别提示词
    'bell': [
        { key: 'church bell sound effect', display: 'soundeffect_common.prompt_bell.church_bell_sound_effect' },
        { key: 'bell', display: 'soundeffect_common.prompt_bell.bell' },
        { key: 'ding small bell sfx', display: 'soundeffect_common.prompt_bell.ding_small_bell_sfx' },
        { key: 'big bell', display: 'soundeffect_common.prompt_bell.big_bell' },
        { key: 'bell sound', display: 'soundeffect_common.prompt_bell.bell_sound' },
        { key: 'intro sound bell', display: 'soundeffect_common.prompt_bell.intro_sound_bell' },
        { key: 'bellding', display: 'soundeffect_common.prompt_bell.bellding' },
        { key: 'hailuoto school bell recording', display: 'soundeffect_common.prompt_bell.hailuoto_school_bell_recording' },
    ],
    // 铃声/铃声音效类别提示词
    'hop': [
        { key: 'trap bell loop', display: 'soundeffect_common.prompt_bell.trap_bell_loop' },
        { key: 'diamond bell', display: 'soundeffect_common.prompt_bell.diamond_bell' },
        { key: 'background bell', display: 'soundeffect_common.prompt_bell.background_bell' },
    ],
    // 卡通钟声/铃声音效相关关键词
    'cartoon': [
        { key: 'ding cartoon', display: 'soundeffect_common.prompt_bell.ding_cartoon' },
        { key: 'ding ding small bell', display: 'soundeffect_common.prompt_bell.ding_ding_small_bell' },
        { key: 'copper bell ding', display: 'soundeffect_common.prompt_bell.copper_bell_ding' },
    ],
    // 通知铃声音效相关关键词
    'notification': [
        { key: 'notification bell sound', display: 'soundeffect_common.prompt_bell.notification_bell_sound' },
        { key: 'evil bell', display: 'soundeffect_common.prompt_bell.evil_bell' },
        { key: 'gong bell', display: 'soundeffect_common.prompt_bell.gong_bell' },
    ],   
    // 铃声/铃声音效类别提示词
    'ringing': [
        { key: 'phone ringing', display: 'soundeffect_common.prompt_bell.phone_ringing' },
        { key: 'servant bell ring', display: 'soundeffect_common.prompt_bell.servant_bell_ring' },
        { key: 'fork bell', display: 'soundeffect_common.prompt_bell.fork_bell' },
        { key: 'bell ring', display: 'soundeffect_common.prompt_bell.bell_ring' },
        { key: 'bells ringing', display: 'soundeffect_common.prompt_bell.bells_ringing' },
        { key: 'boxing bell', display: 'soundeffect_common.prompt_bell.boxing_bell' },
        { key: 'opening bell', display: 'soundeffect_common.prompt_bell.opening_bell' },
    ],
    // 铃声/铃声音效类别提示词
    'ring': [
        { key: 'old style door bell', display: 'soundeffect_common.prompt_bell.old_style_door_bell' },
        { key: 'bell transition', display: 'soundeffect_common.prompt_bell.bell_transition' },
        { key: 'door bell', display: 'soundeffect_common.prompt_bell.door_bell' },
        { key: 'sound of the bell free to use', display: 'soundeffect_common.prompt_bell.sound_of_the_bell_free_to_use' },
        { key: 'the bell sound free', display: 'soundeffect_common.prompt_bell.the_bell_sound_free' },
        { key: 'bells ring in the soul', display: 'soundeffect_common.prompt_bell.bells_ring_in_the_soul' },
    ],
    // 钟声/铃声音效音频相关关键词
    'bell-audio': [
        { key: 'notification sounds', display: 'soundeffect_common.prompt_bell_audio.notification_sounds' },
        { key: 'relaxing bells melody', display: 'soundeffect_common.prompt_bell_audio.relaxing_bells_melody' },
        { key: 'bells audio', display: 'soundeffect_common.prompt_bell_audio.bells_audio' },
    ],
    // 铃声/铃声音效类别提示词
    'bells': [
        { key: 'scary bells', display: 'soundeffect_common.prompt_bell.scary_bells' },
        { key: 'bells jingling', display: 'soundeffect_common.prompt_bell.bells_jingling' },
        { key: 'bicycle bell', display: 'soundeffect_common.prompt_bell.bicycle_bell' },
        { key: 'church bell', display: 'soundeffect_common.prompt_bell.church_bell' },
    ],  
    // 学校钟声/钟声/铃声音效相关关键词 
    'schoolbell': [
        { key: 'hailuoto school bell recording', display: 'soundeffect_common.prompt_bell.hailuoto_school_bell_recording' },
        { key: 'school bell longer', display: 'soundeffect_common.prompt_bell.school_bell_longer' },
        { key: 'japanese school bell sound', display: 'soundeffect_common.prompt_bell.japanese_school_bell_sound' },
    ], 
    // 节拍声音类别提示词
    'beat': [
        { key: 'indian beats', display: 'soundeffect_common.prompt_beat.indian_beats' },
        { key: 'hold on beat', display: 'soundeffect_common.prompt_beat.hold_on_beat' },
        { key: 'drum beats', display: 'soundeffect_common.prompt_beat.drum_beats' },
        { key: 'beat effect', display: 'soundeffect_common.prompt_beat.beat_effect' },
        { key: 'heartbeat', display: 'soundeffect_common.prompt_beat.heartbeat' },
        { key: 'clock beat effect', display: 'soundeffect_common.prompt_beat.clock_beat_effect' },
    ],
    // 雨声类别提示词（填充数据，使用通用键）
    'rain': [
        { key: 'Rain', display: 'soundeffect_common.prompt_nature.rain' },
        { key: 'heavy rain', display: 'soundeffect_common.prompt_nature.rain' },
        { key: 'rainfall', display: 'soundeffect_common.prompt_nature.rain' },
        { key: 'light rain', display: 'soundeffect_common.prompt_nature.rain' },
        { key: 'pouring rain', display: 'soundeffect_common.prompt_nature.rain' }
    ],
    // 钢琴类别提示词（填充数据，使用通用键）
    'piano': [
        { key: 'Piano', display: 'soundeffect_common.prompt_instruments.piano' },
        { key: 'piano melody', display: 'soundeffect_common.prompt_instruments.piano' },
        { key: 'piano keys', display: 'soundeffect_common.prompt_instruments.piano' },
        { key: 'piano chord', display: 'soundeffect_common.prompt_instruments.piano' }
    ],
    // 剑声类别提示词（填充数据，使用通用键）
    'sword': [
        { key: 'sword whoosh', display: 'soundeffect_common.prompt_combat.sword_whoosh' },
        { key: 'sword whooshing through the air', display: 'soundeffect_common.prompt_combat.sword_through_air' },
        { key: 'sword slash', display: 'soundeffect_common.prompt_combat.sword_whoosh' },
        { key: 'sword swing', display: 'soundeffect_common.prompt_combat.sword_whoosh' }
    ],
}

// 默认提示词列表（作为提示词池，用于补齐）
export const defaultPromptExamples: SoundEffectPromptExample[] = [
    // Combat & UI
    { key: 'sword whoosh', display: 'soundeffect_common.prompt_combat.sword_whoosh' },
    { key: 'sword whooshing through the air', display: 'soundeffect_common.prompt_combat.sword_through_air' },
    { key: 'shotgun fire', display: 'soundeffect_common.prompt_combat.shotgun_fire' },
    { key: 'futuristic laser gunshots', display: 'soundeffect_common.prompt_combat.laser_gunshot' },
    { key: 'user interface success notifications', display: 'soundeffect_common.prompt_combat.ui_success' },

    // Nature
    { key: 'Rain', display: 'soundeffect_common.prompt_nature.rain' },
    { key: 'ocean waves', display: 'soundeffect_common.prompt_nature.ocean_waves' },
    { key: 'flowing water', display: 'soundeffect_common.prompt_nature.flowing_water' },

    // Special Effects
    { key: 'Fireworks', display: 'soundeffect_common.prompt_special.fireworks' },
    { key: 'glass shattering', display: 'soundeffect_common.prompt_special.glass_shattering' },
    { key: 'magic spell', display: 'soundeffect_common.prompt_special.magic_spell' },

    // Instruments
    { key: 'Piano', display: 'soundeffect_common.prompt_instruments.piano' },
    { key: 'electric guitar', display: 'soundeffect_common.prompt_instruments.electric_guitar' },
    { key: 'Violin', display: 'soundeffect_common.prompt_instruments.violin' },

    // Human Sounds
    { key: 'baby laughing', display: 'soundeffect_common.prompt_human.baby_laughing' },
    { key: 'Clapping', display: 'soundeffect_common.prompt_human.clapping' },
    { key: 'Celebrate', display: 'soundeffect_common.prompt_human.celebrate' },

    // Ambient
    { key: 'Typing', display: 'soundeffect_common.prompt_ambient.typing' },
    { key: 'noisy restaurant', display: 'soundeffect_common.prompt_ambient.noisy_restaurant' },
    { key: 'doorbell ring', display: 'soundeffect_common.prompt_ambient.doorbell_ring' },
]

// 关键词映射（用于将路由关键词转换为友好的预设文本）
// 这里的关键词没有找到对应的提示词，而且关键词本身不适合用做预设文本，因此手动映射预设文本
export const keywordMappings: KeywordMappingsMap = {
    'jumpscare sound effect': 'jump scare sound',
    'jumpscare sounds': 'jump scare sound',

}

export function resolveCategoryForPageKey(pageKey: string): string {
  return keywordToCategoryMap[pageKey] ?? pageKey
}

export function getCategoryPrompts(category: string): SoundEffectPromptExample[] {
  return categoryToPrompts[category] ?? []
}

export function getPromptExamplesForPageKey(
  pageKey: string,
  targetCount: number = PROMPT_EXAMPLE_TARGET_COUNT,
): SoundEffectPromptExample[] {
  const category = resolveCategoryForPageKey(pageKey)
  const categoryPrompts = getCategoryPrompts(category)

  if (categoryPrompts.length === 0) {
    return defaultPromptExamples.slice(0, targetCount)
  }

  if (categoryPrompts.length >= targetCount) {
    return categoryPrompts.slice(0, targetCount)
  }

  const existingKeys = new Set(categoryPrompts.map((p) => p.key))
  const fillers = defaultPromptExamples.filter((p) => !existingKeys.has(p.key))
  return [
    ...categoryPrompts,
    ...fillers.slice(0, targetCount - categoryPrompts.length),
  ]
}

/** Preset textarea text for a page key (keyword override or first category prompt). */
export function getPresetDescriptionForPageKey(pageKey: string): string {
  const mapped =
    keywordMappings[pageKey] ?? keywordMappings[pageKey.replace(/-/g, ' ')]
  if (mapped) {
    return mapped
  }

  const category = resolveCategoryForPageKey(pageKey)
  const prompts = getCategoryPrompts(category)
  if (prompts.length > 0) {
    return prompts[0].key
  }

  return pageKey.replace(/-/g, ' ')
}
