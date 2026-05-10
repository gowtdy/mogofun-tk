#!/bin/bash

# 🔥 暴躁技术老哥的i18n文件拷贝脚本
# 用法: ./copy_i18n_file.sh role/patrick-voice.json
# 这都2024年了，还手动拷贝文件？太low了！

set -e  # 遇到错误立即退出，别给我磨磨唧唧

# 检查参数
if [ $# -eq 0 ]; then
    echo "❌ 错误：请提供要拷贝的文件路径！"
    echo "用法: $0 <文件路径>"
    echo "例如: $0 role/patrick-voice.json"
    exit 1
fi

SOURCE_FILE="$1"
#I18N_BASE_DIR="i18n/locales"
I18N_BASE_DIR="."
SOURCE_DIR="$I18N_BASE_DIR/en"

# 检查源文件是否存在
if [ ! -f "$SOURCE_DIR/$SOURCE_FILE" ]; then
    echo "❌ 错误：源文件不存在: $SOURCE_DIR/$SOURCE_FILE"
    echo "请检查文件路径是否正确！"
    exit 1
fi

echo "🚀 开始拷贝文件: $SOURCE_FILE"
echo "📁 源目录: $SOURCE_DIR"
echo ""

# 获取所有语言目录（除了en）
LANGUAGES=$(find "$I18N_BASE_DIR" -maxdepth 1 -type d -name "*" | grep -v "^$I18N_BASE_DIR$" | grep -v "^$I18N_BASE_DIR/en$" | xargs -I {} basename {} | sort)

if [ -z "$LANGUAGES" ]; then
    echo "❌ 错误：没有找到其他语言目录！"
    exit 1
fi

echo "🌍 找到语言目录: $(echo $LANGUAGES | tr '\n' ' ')"
echo ""

# 统计变量
SUCCESS_COUNT=0
FAILED_COUNT=0
FAILED_LANGUAGES=()

# 遍历每个语言目录
for lang in $LANGUAGES; do
    TARGET_DIR="$I18N_BASE_DIR/$lang"
    TARGET_FILE="$TARGET_DIR/$SOURCE_FILE"
    
    echo "📋 处理语言: $lang"
    
    # 检查目标目录是否存在
    if [ ! -d "$TARGET_DIR" ]; then
        echo "  ⚠️  警告：目标目录不存在，跳过: $TARGET_DIR"
        FAILED_COUNT=$((FAILED_COUNT + 1))
        FAILED_LANGUAGES+=("$lang (目录不存在)")
        continue
    fi
    
    # 创建目标文件的父目录（如果不存在）
    TARGET_PARENT_DIR=$(dirname "$TARGET_FILE")
    if [ ! -d "$TARGET_PARENT_DIR" ]; then
        echo "  📁 创建目录: $TARGET_PARENT_DIR"
        mkdir -p "$TARGET_PARENT_DIR"
    fi
    
    # 拷贝文件
    if cp "$SOURCE_DIR/$SOURCE_FILE" "$TARGET_FILE"; then
        echo "  ✅ 成功拷贝到: $TARGET_FILE"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "  ❌ 拷贝失败: $TARGET_FILE"
        FAILED_COUNT=$((FAILED_COUNT + 1))
        FAILED_LANGUAGES+=("$lang (拷贝失败)")
    fi
    
    echo ""
done

# 输出统计结果
echo "🎯 拷贝完成！"
echo "✅ 成功: $SUCCESS_COUNT 个文件"
echo "❌ 失败: $FAILED_COUNT 个文件"

if [ $FAILED_COUNT -gt 0 ]; then
    echo ""
    echo "💥 失败的语言:"
    for failed in "${FAILED_LANGUAGES[@]}"; do
        echo "  - $failed"
    done
    echo ""
    echo "🔧 建议检查文件权限和磁盘空间！"
    exit 1
else
    echo ""
    echo "🎉 所有文件拷贝成功！你的i18n文件已经同步到所有语言目录了！"
    echo "💡 提示：记得检查翻译内容，确保各语言版本的内容正确！"
fi
