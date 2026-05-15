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
    languages: List[str] = field(default_factory=lambda: ["en", "ja", "zh", "zh-tw", "fr", "es"])
    pages: Dict[str, Dict] = field(default_factory=dict)
    priority_rules: Dict[str, float] = field(default_factory=lambda: {
        "en": 1.0, "ja": 0.9, "zh": 0.9, "zh-tw": 0.9, "fr": 0.8, "es": 0.8
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
                "sound-effect", "vocal-isolator", "vocal-remover","audio-extractor"
            ],
            "priority": PriorityLevel.CRITICAL.value,
            "changefreq": "daily",
            "type": PageType.FEATURE
        },
        
        # 角色页面 - 分级管理
        "characters": {
            "high_priority": [
            ],
            "medium_priority": [
            ],
            "priority_high": PriorityLevel.HIGH.value,
            "priority_medium": PriorityLevel.MEDIUM.value,
            "changefreq": "daily",
            "type": PageType.CHARACTER
        }
    }
)

def get_language_priority(lang: str) -> float:
    """获取语言优先级"""
    return CONFIG.priority_rules.get(lang, 0.8)

def get_changefreq_for_language(lang: str) -> str:
    """根据语言获取更新频率"""
    return "weekly" if lang in ["fr", "es"] else "daily"

def generate_urls() -> List[Dict]:
    """🚀 核心URL生成器 - 配置驱动的优雅实现"""
    urls = []
    # 使用当前日期作为lastmod，确保每次生成都是最新时间
    lastmod = datetime.now().strftime('%Y-%m-%d')
    
    # 生成首页URL
    for path in CONFIG.pages["home"]["paths"]:
        urls.append({
            "loc": f"{CONFIG.base_url}{path}",
            "lastmod": lastmod,
            "changefreq": CONFIG.pages["home"]["changefreq"],
            "priority": CONFIG.pages["home"]["priority"]
        })
    
    # 为每种语言生成URL
    for lang in CONFIG.languages:
        lang_priority = get_language_priority(lang)
        lang_changefreq = get_changefreq_for_language(lang)
        
        # 语言首页
        # 跳过英语(en)，因为英语就是首页
        if lang != "en":
            urls.append({
                "loc": f"{CONFIG.base_url}/{lang}",
                "lastmod": lastmod,
                "changefreq": lang_changefreq,
                "priority": lang_priority
            })
        
        # 功能页面
        for feature_path in CONFIG.pages["features"]["paths"]:
            urls.append({
                "loc": f"{CONFIG.base_url}/{lang}/{feature_path}",
                "lastmod": lastmod,
                "changefreq": CONFIG.pages["features"]["changefreq"],
                "priority": CONFIG.pages["features"]["priority"]
            })
        
        # 角色页面 - 高优先级
        for char_path in CONFIG.pages["characters"]["high_priority"]:
            urls.append({
                "loc": f"{CONFIG.base_url}/{lang}/{char_path}",
                "lastmod": lastmod,
                "changefreq": CONFIG.pages["characters"]["changefreq"],
                "priority": CONFIG.pages["characters"]["priority_high"]
            })
        
        # 角色页面 - 中等优先级
        for char_path in CONFIG.pages["characters"]["medium_priority"]:
            urls.append({
                "loc": f"{CONFIG.base_url}/{lang}/{char_path}",
                "lastmod": lastmod,
                "changefreq": CONFIG.pages["characters"]["changefreq"],
                "priority": CONFIG.pages["characters"]["priority_medium"]
            })
    
    return urls

def add_custom_urls(urls: List[Dict], custom_urls: List[Dict]) -> List[Dict]:
    """添加自定义URL"""
    return urls + custom_urls

def validate_urls(urls: List[Dict]) -> List[Dict]:
    """URL验证"""
    validated_urls = []
    for url in urls:
        if url.get("loc") and url.get("priority") is not None:
            validated_urls.append(url)
        else:
            print(f"⚠️ 跳过无效URL: {url}")
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
    
    # 添加自定义URLs
    current_date = datetime.now().strftime('%Y-%m-%d')
    custom_urls = [
        {
            "loc": f"{base_url}/en/friends",
            "lastmod": current_date,
            "changefreq": "daily",
            "priority": 1.0
        }
    ]
    urls = add_custom_urls(urls, custom_urls)
    
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
    base_url = 'https://aivoicelab.net'
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
