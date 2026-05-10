#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
提取sitemap文件中的URL并排序输出
"""

import xml.etree.ElementTree as ET
import sys
import os
import argparse

def extract_urls_from_sitemap(file_path):
    """从sitemap文件中提取所有URL"""
    urls = []
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        
        # 处理命名空间
        namespace = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        # 查找所有url元素
        for url_elem in root.findall('.//sitemap:url', namespace):
            loc_elem = url_elem.find('sitemap:loc', namespace)
            if loc_elem is not None:
                urls.append(loc_elem.text)
        
        # 如果没有找到带命名空间的元素，尝试不带命名空间
        if not urls:
            for url_elem in root.findall('.//url'):
                loc_elem = url_elem.find('loc')
                if loc_elem is not None:
                    urls.append(loc_elem.text)
                    
    except ET.ParseError as e:
        print(f"解析XML文件 {file_path} 时出错: {e}")
        return []
    except FileNotFoundError:
        print(f"文件 {file_path} 不存在")
        return []
    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {e}")
        return []
    
    return urls

def main():
    # 设置命令行参数解析
    parser = argparse.ArgumentParser(
        description='提取sitemap文件中的URL并排序输出',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  python extract_sitemap_urls.py sitemap.xml
  python extract_sitemap_urls.py sitemap_old.xml
  python extract_sitemap_urls.py  # 使用默认文件 sitemap_old.xml
        """
    )
    
    parser.add_argument('file', nargs='?', help='sitemap文件路径')
    
    args = parser.parse_args()
    
    # 确定文件路径
    if args.file:
        sitemap_path = args.file
    else:
        # 没有提供参数，使用默认文件
        script_dir = os.path.dirname(os.path.abspath(__file__))
        sitemap_path = os.path.join(script_dir, 'sitemap_old.xml')
        print(f"⚠️  未提供文件参数，使用默认文件: {sitemap_path}")
    
    # 检查文件是否存在
    if not os.path.exists(sitemap_path):
        print(f"❌ 错误: 文件不存在 - {sitemap_path}")
        sys.exit(1)
    
    print("=" * 80)
    print("SITEMAP URL 提取和排序工具")
    print("=" * 80)
    
    # 提取文件中的URL
    print(f"\n📁 提取文件: {sitemap_path}")
    urls = extract_urls_from_sitemap(sitemap_path)
    print(f"找到 {len(urls)} 个URL")
    
    if not urls:
        print("❌ 没有找到任何URL，请检查文件格式")
        return
    
    # 排序URL
    urls_sorted = sorted(urls)
    
    # 输出URL列表
    print("\n" + "=" * 80)
    print(f"📋 {os.path.basename(sitemap_path)} 中的URL (已排序):")
    print("=" * 80)
    for url in urls_sorted:
        print(url)
    
    print(f"\n✅ 总共找到 {len(urls_sorted)} 个URL")

if __name__ == "__main__":
    main()
