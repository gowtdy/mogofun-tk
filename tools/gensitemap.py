"""
🔥 终极Sitemap生成器 - 2024年最优雅的解决方案！
告别300行硬编码，拥抱配置驱动的现代化设计！
支持智能优先级、动态更新频率、SEO优化、多语言管理
"""

import os
import json
from datetime import datetime
from xml.etree.ElementTree import Element, SubElement, tostring, ElementTree
from typing import Dict, List, Optional, Union
from dataclasses import dataclass, field
from enum import Enum

class PageType(Enum):
    """页面类型枚举"""
    HOME = "home"
    FEATURE = "feature"
    CHARACTER = "character"
    CATEGORY = "category"
    TTS = "tts"
    SOUND = "sound"
    VOCAL = "vocal"

class PriorityLevel(Enum):
    """优先级等级"""
    CRITICAL = 1.0
    HIGH = 0.9
    MEDIUM = 0.8
    LOW = 0.7

@dataclass
class SitemapConfig:
    """Sitemap配置类"""
    base_url: str
    lastmod: str = ""
    languages: List[str] = field(default_factory=lambda: ["en", "ja", "zh", "zh-tw", "fr", "de", "es", "pt", "ko", "ar"])
    pages: Dict[str, Dict] = field(default_factory=dict)
    priority_rules: Dict[str, float] = field(default_factory=lambda: {
        "en": 1.0, "ja": 0.9, "zh": 0.9, "zh-tw": 0.9, "fr": 0.8, "de": 0.8, "es": 0.8, "pt": 0.8, "ko": 0.8, "ar": 0.8
    })

# 🚀 核心配置 - 一个配置搞定所有URL生成
CONFIG = SitemapConfig(
    base_url="https://mogofun.com",
    pages={
        # 首页
        "home": {
            "paths": ["", "/"],
            "priority": PriorityLevel.CRITICAL.value,
            "changefreq": "daily",
            "type": PageType.HOME
        },
        
        # 功能页面 - 高优先级
        "features": {
            "paths": [
                "text-to-speech", "sounds-effect", "vocal-isolator", "vocal-remover", "audio-extractor", "friends"
            ],
            "priority": PriorityLevel.CRITICAL.value,
            "changefreq": "daily",
            "type": PageType.FEATURE
        },
        "tts": {
            "paths": [
                "tiktok-ai-voice", "tiktok-voice-over", "tiktok-voice-over-alternative", 
                "tiktok-voice-generator", "tiktok-voiceover", "tiktok-text-to-speech",
                "funny-tts", "funny-tts-messages",  "ai-character-voice-generator", "voiceover-voice-over", "tts-meaning", "tts-mean",
                "free-text-to-speech-ai", "fake-voice", "deep-voice", "voice-deep", 
                "tts-reader", "text-to-speech-reader", "ttsreader", "read-text", "text-reader", 
                "story-reader", "story-reading", "read-stories",
                "female-voice-generator", "female-voice", "female-ai-voice", "ladies-voice-converter",
                "female-voice-over", "text-to-voice-female",
                "male-voice", "man-voice", "men-voice", "voice-man", "mans-voice", "male-audio", "man-audio", "voice-of-male",
                "voice-of-man", "man-voice-over", "audio-male", "voice-male", "amans-voice", "the-mans-voice", "male-voices",
                "man-voices", "man-text-to-speech", "guy-voice",
                "natural-reader", "natural-reader-tts", "natural-readers", "naturalreader", "naturalreaders",
                "ai-girl-voice", "girl-ai-voice", "girl-voice", "hot-girl-voice-generator", "gossip-girl-voice", "ai-voice-girl",
                "voicemail-greeting", "funny-voicemail-greetings", "short-funny-voicemail-greetings", "business-voicemail-greeting", "professional-voicemail-greeting", 
                "japanese-text-to-speech", "japanese-tts", "japanese-text-to-voice", "spanish-text-to-speech", "spanish-tts", 
                "chinese-text-to-speech", "mandarin-text-to-speech", "cantonese-text-to-speech",
                "french-text-to-speech", "british-voice", "british-accent-generator",
                "text-to-speech-generator", "computer-voice", "ai-vocal", "ai-vocals",
            ],
            "priority": PriorityLevel.CRITICAL.value,
            "changefreq": "daily",
            "type": PageType.TTS
        },
        # 角色页面 - 分级管理
        "characters": {
            "high_priority": [
                "ghostface", "siri", "siri-voice", "voice-of-siri", "siri-text-to-speech", "text-to-speech-siri", "hey-siri-voice", "siri-voices",
                "santa-claus", "santa-voice",  "santa-ai-voice", "santa-audio", "santa-ai", "santa-claus-ai", "santa-text-to-speech", "santa-voicemail",
                "adam-voice", "adam-voice-ai", "adam-ai-voice", "jessie", "stitch-voice", "stitch-say",
            ],
            "medium_priority": [
                "capcut-text-to-speech", "capcut-voice-over", "capcut-voice-over-alternative",
                "speechma", "speechma-ai-voice", "hailuo-ai-voice", "twitch-tts",
                "kokoro-tts", "ttsmaker"
            ],
            "priority_high": PriorityLevel.HIGH.value,
            "priority_medium": PriorityLevel.MEDIUM.value,
            "changefreq": "daily",
            "type": PageType.CHARACTER
        },
        "sound": {
            "paths": [
                "ai-sound-effect", "ai-sound-effects", "sound-effects", "sound-generator", "ai-sound-generator",
                "sound-effect", "effect-sound-effect", "meme-sound-effects", "funny-sound-effects", "sound-generators", "sound-effects-ai",
                "ai-sounds", "sound-ai", "sounds-ai", "sound-generation", "magic-sound-effect", "sound-effect-maker", "sound-maker",
                'soundmaker', "text-to-sound-effect", "sound-make", "sfx", "sfx-sound", "sfx-engine", "soundfx", "ai-sfx-generator", "sounds-fx",
                'meme-sound-effect', 'meme-sounds-effects', 'funny-sounds-effects', 'video-sound-effects', 'sound-effect-creator', 'sound-simulator',
                'sound-effect-board', 'sound-effect-soundboard', 'ai-audio-generator', 'audio-generator', 'audio-ai','audio-maker', 'audio-generation',
                'gunshot-sfx', 'gun-sound-effects', 'machine-gun-sound', 'gunshot-sound-effect', 'gun-sound-effect', 'car-sound-effect', 
                'car-sound-effects', 'car-crash-sound-effect', 'death-sound-effect', 'death-sound', 'die-sound', 'jumper-sound-effect', 
                'jumpscare-sound-effect', 'jumpscare-sounds', 'woosh-sound-effect', 'whoosh-sound-effect', 'whoosh-sound', 'shock-sound-effect', 'timer-sound', 
                'thunder-sound-effect', 'poop-sounds', 'poop-sound', 'sound-effects-buttons', 'button-sound-effects', 'sound-effect-buttons', 
                'sound-effect-button', 'air-horn-sound-effect', 'air-sound', 'air-noise', 'air-effect', 'engine-sound-effect', 'engine-sound-simulator',
                'cut-sound-effect', 'typing-sound-effect', 'typewriter-sound-effect', 'machine-sound-effects', 'spatial-sound', 'spatial-audio',
                'baby-crying-sound-effect', 'laughing-sound', 'laugh-sound-effect', 'horn-sound-effect', 'counter-sound-effect', 'countdown-sound-effect',
                'scream-sound-effect','screaming-sound-effect','robot-sounds','beat-sound','beat-sounds','moan-sound-effect','moaning-sound-effect',
                'explosion-sound-effect','sparkle-sound-effect','rooster-sounds','camera-sound-effect','whisper-sound','riser-sound-effect',
                'bell-sound-effect','bell-sfx','bell-ringing-sound','bells-sound','sound-bell','bell-cartoon','bells-ringing','ringing-bell','bell-ring',
                'bell-notification','bell-rings','ring-the-bell','bell-hop','bell-ring-sound','bell-sound','bell-audio','doorbell-sound-effect',
                'school-bell-sound','door-open-sound-effect','pixel-sounds','haptic-sound','error-sound-effect','fire-sound-effect','alarm-sound-effect',
                'scream-sfx','scream-sound','scream-voice','screaming-noise','scream-audio','screaming-sound','loud-scream','loud-screaming','screaming-audio',
                'cry-sounds','yelling-sound','yell-sound','loud-yelling','scream-loud','someone-scream','scream-soundboard','male-moaning','men-moaning',
                'moaning-audio','guy-moaning','male-moan','men-moan','men-moans','grunt-sound-effect','groan-sound','guy-screaming','scream-noise',
                'whoosh-effect','woosh-sfx','woosh-sound','swish-sound','transition-sound-effect','transition-sound-effects','transition-sound',
                'transition-sounds','transition-sfx','bicycle-sounds','bike-horn-sound','train-sounds','train-sound','train-sound-effect','train-horn',
                'train-sound-effects','train-voice','train-noises','train-noise','car-sound','car-sounds','car-noises','cars-sounds','carsound',
                'car-effect','car-voice','car-fx','air-sounds','air-sound-effect','airhorn','air-horn','airhorn-sound','air-horn-noise','sound-horn',
                'horn-sound','horn-sounds','horn-noise','truck-sounds','truck-sound','truck-audio','truck-horn','truck-honking','celebration-sound-effect',
                'festival-sound','fireworks-sounds','fireworks-sound','firework-sounds','happy-celebration','porn-sounds','porn-sound','porn-noises','audio-porn',
                'porn-audio','loud-porn','porn-moaning','porn-moan','loud-moaning-porn','women-moaning','male-moans','men-moaning-porn','girls-moan','girl-moan',
                'moaning-porn','moaning-sounds','moaning-sound','moans-sounds','moan-sound','moan-sounds','moaning-noises','sex-sounds','sex-audio','sex-sound',
                'sex-moans','sexy-moaning','sex-noises','sex-noise','sexy-moans','sounds-of-sex','sex-sound-effects','erotic-sounds','real-sex-sounds','sounding-sex',
                'happy-scream','sex-sounds-porn','vibrator-sound','fuck-sound-effect','funny-sound','funny-sound-effect','funny-sounds','funny-noises','funny-audio',
                'funny-meme-sounds','noises-funny','soundboard-funny','silly-sound','funny-audios','fun-sounds','funny-notification','fun-sound','funny-meme-sound',
                'funny-scream','meme-scream','soundboard-guy','silent-scream','scream-and-shout','shouting-sound-effect','scream-louder','angry-screaming',
                'door-bell-sound-effect','taco-bell-sound-effect','sound-button','sound-bottons','sounds-buttons','button-soundboard','noise-buttons'
            ],
            "priority": PriorityLevel.CRITICAL.value,
            "changefreq": "daily",
            "type": PageType.SOUND
        },
        # 人声页面 - 高优先级
        "vocals": {
            "paths": [
                "voice-isolation", "voice-isolator", "vocal-extractor", "vocal-separator", "separate-vocals",
                "instrumental-remover", "vocal-splitter", "ai-splitter", "splitter-ai", "music-remover",
                "isolate-vocals", "ai-stem-splitter", "remove-instrument"
            ],
            "priority": PriorityLevel.CRITICAL.value,
            "changefreq": "daily",
            "type": PageType.VOCAL
        },
        # 静态信息页
        "static": {
            "paths": [
                "about", "pricing", "privacy-policy", "terms-service", "refund-policy", "dmca-policy",
            ],
            "priority": PriorityLevel.MEDIUM.value,
            "changefreq": "monthly",
            "type": PageType.CATEGORY
        },
    }
)

def get_language_priority(lang: str) -> float:
    """获取语言优先级"""
    return CONFIG.priority_rules.get(lang, 0.8)

def get_changefreq_for_language(lang: str) -> str:
    """根据语言获取更新频率"""
    return "weekly" if lang in ["fr", "es"] else "daily"

# 使用 paths 列表的页面分组
PATH_PAGE_SECTIONS = ("features", "tts", "sound", "vocals", "static")

def _append_localized_paths(
    urls: List[Dict],
    lang: str,
    paths: List[str],
    lastmod: str,
    changefreq: str,
    priority: float,
) -> None:
    for slug in paths:
        urls.append({
            "loc": f"{CONFIG.base_url}/{lang}/{slug}",
            "lastmod": lastmod,
            "changefreq": changefreq,
            "priority": priority,
        })

def generate_urls() -> List[Dict]:
    """🚀 核心URL生成器 - 配置驱动的优雅实现"""
    urls = []
    lastmod = datetime.now().strftime('%Y-%m-%d')

    # 首页（仅保留根路径，避免 "" 与 "/" 重复）
    urls.append({
        "loc": CONFIG.base_url,
        "lastmod": lastmod,
        "changefreq": CONFIG.pages["home"]["changefreq"],
        "priority": CONFIG.pages["home"]["priority"],
    })

    for lang in CONFIG.languages:
        lang_priority = get_language_priority(lang)
        lang_changefreq = get_changefreq_for_language(lang)

        if lang != "en":
            urls.append({
                "loc": f"{CONFIG.base_url}/{lang}",
                "lastmod": lastmod,
                "changefreq": lang_changefreq,
                "priority": lang_priority,
            })

        for section in PATH_PAGE_SECTIONS:
            page_cfg = CONFIG.pages[section]
            _append_localized_paths(
                urls, lang, page_cfg["paths"], lastmod,
                page_cfg["changefreq"], page_cfg["priority"],
            )

        chars = CONFIG.pages["characters"]
        _append_localized_paths(
            urls, lang, chars["high_priority"], lastmod,
            chars["changefreq"], chars["priority_high"],
        )
        _append_localized_paths(
            urls, lang, chars["medium_priority"], lastmod,
            chars["changefreq"], chars["priority_medium"],
        )

    return urls

def validate_urls(urls: List[Dict]) -> List[Dict]:
    """URL 验证并按 loc 去重"""
    validated_urls = []
    seen_locs = set()
    for url in urls:
        if not url.get("loc") or url.get("priority") is None:
            print(f"⚠️ 跳过无效URL: {url}")
            continue
        loc = url["loc"]
        if loc in seen_locs:
            continue
        seen_locs.add(loc)
        validated_urls.append(url)
    return validated_urls

def generate_sitemap(base_url: str, output_file: str):
    """
    🚀 优雅的Sitemap生成器
    使用配置驱动的方式，告别硬编码噩梦！
    """
    # 设置配置
    CONFIG.base_url = base_url
    
    # 创建XML根元素
    urlset = Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    def add_url(parent, loc, lastmod=None, changefreq=None, priority=None):
        """添加URL到sitemap"""
        url = SubElement(parent, 'url')
        loc_elem = SubElement(url, 'loc')
        loc_elem.text = loc
        if lastmod:
            lastmod_elem = SubElement(url, 'lastmod')
            lastmod_elem.text = lastmod
        if changefreq:
            changefreq_elem = SubElement(url, 'changefreq')
            changefreq_elem.text = changefreq
        if priority:
            priority_elem = SubElement(url, 'priority')
            priority_elem.text = str(priority)

    # 🎯 使用配置生成URLs
    print("🚀 开始生成URLs...")
    urls = generate_urls()

    # 验证URLs
    urls = validate_urls(urls)
    print(f"✅ 生成了 {len(urls)} 个有效URL")

    # 添加URLs到sitemap
    for url_data in urls:
        add_url(urlset, **url_data)

    # 创建sitemap XML文件
    tree = ElementTree(urlset)
    
    # 生成XML字符串并添加XSL样式表引用
    xml_str = tostring(urlset, encoding='utf-8').decode('utf-8')
    
    # 添加XML声明和XSL样式表引用
    xml_with_stylesheet = '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>\n' + xml_str
    # 写入文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(xml_with_stylesheet)

    print(f"🎉 Sitemap已生成: {output_file}")
    print(f"📊 统计信息:")
    print(f"   - 总URL数量: {len(urls)}")
    print(f"   - 支持语言: {', '.join(CONFIG.languages)}")
    print(f"   - 功能页面: {len(CONFIG.pages['features']['paths'])}")
    print(f"   - TTS 页面: {len(CONFIG.pages['tts']['paths'])}")
    print(f"   - Sound 页面: {len(CONFIG.pages['sound']['paths'])}")
    print(f"   - Vocal 页面: {len(CONFIG.pages['vocals']['paths'])}")
    print(f"   - 静态页面: {len(CONFIG.pages['static']['paths'])}")
    print(f"   - 角色页面: {len(CONFIG.pages['characters']['high_priority']) + len(CONFIG.pages['characters']['medium_priority'])}")

def export_config_to_json(filename: str):
    """导出配置到JSON文件"""
    # 处理枚举类型的序列化
    def serialize_config(obj):
        if isinstance(obj, dict):
            return {k: serialize_config(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [serialize_config(item) for item in obj]
        elif isinstance(obj, (PageType, PriorityLevel)):
            return obj.value
        else:
            return obj
    
    config_dict = {
        "base_url": CONFIG.base_url,
        "languages": CONFIG.languages,
        "priority_rules": CONFIG.priority_rules,
        "pages": serialize_config(CONFIG.pages)
    }
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(config_dict, f, indent=2, ensure_ascii=False)
    
    print(f"✅ 配置已导出到: {filename}")

def load_config_from_json(filename: str):
    """从JSON文件加载配置"""
    with open(filename, 'r', encoding='utf-8') as f:
        config_dict = json.load(f)
    
    CONFIG.base_url = config_dict.get("base_url", CONFIG.base_url)
    CONFIG.languages = config_dict.get("languages", CONFIG.languages)
    CONFIG.priority_rules = config_dict.get("priority_rules", CONFIG.priority_rules)
    CONFIG.pages = config_dict.get("pages", CONFIG.pages)
    
    print(f"✅ 配置已从 {filename} 加载")

def main():
    """主函数"""
    base_url = 'https://mogofun.com'
    output_file = 'sitemap.xml'
    
    print("🔥 启动终极Sitemap生成器...")
    print("=" * 50)
    
    # 生成sitemap
    generate_sitemap(base_url, output_file)
    
    # 导出配置
    export_config_to_json("sitemap_config.json")
    
    print("=" * 50)
    print("🎯 重构完成！")
    print("✨ 优势:")
    print("   - 配置驱动，告别硬编码")
    print("   - 智能优先级管理")
    print("   - 多语言支持")
    print("   - 易于维护和扩展")
    print("   - SEO优化配置")

if __name__ == '__main__':
    main()
