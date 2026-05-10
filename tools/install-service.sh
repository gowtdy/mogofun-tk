#!/bin/bash

# MoGoFun 服务安装脚本
# 用于在 Ubuntu 系统上安装并启用 systemd 服务

set -e

SERVICE_NAME="mogofun.service"
SERVICE_FILE="$(dirname "$0")/$SERVICE_NAME"
SYSTEMD_PATH="/etc/systemd/system/$SERVICE_NAME"

# 检查是否为 root 用户
# 使用 id -u 获取用户ID，兼容性更好
CURRENT_UID=$(id -u 2>/dev/null || echo "0")
if [ "$CURRENT_UID" -ne 0 ]; then 
    echo "错误: 请使用 sudo 运行此脚本"
    exit 1
fi

# 检查服务文件是否存在
if [ ! -f "$SERVICE_FILE" ]; then
    echo "错误: 找不到服务文件 $SERVICE_FILE"
    exit 1
fi

echo "正在安装 MoGoFun 服务..."

# 如果服务已经在运行，先停止它
if systemctl is-active --quiet "$SERVICE_NAME" 2>/dev/null; then
    echo "  检测到服务正在运行，正在停止..."
    systemctl stop "$SERVICE_NAME" || true
fi

# 确定服务用户：优先使用环境变量，否则提示输入
if [ -n "$SERVICE_USER" ]; then
    echo "  使用环境变量指定的用户: $SERVICE_USER"
else
    read -p "请输入服务运行的用户名 (默认: aigc): " input_user
    SERVICE_USER="${input_user:-aigc}"
fi

# 清理用户名字符（只允许字母、数字、下划线、连字符）
SERVICE_USER=$(echo "$SERVICE_USER" | tr -d -c '[:alnum:]_-')

# 确定服务组
if [ -n "$SERVICE_GROUP" ]; then
    echo "  使用环境变量指定的组: $SERVICE_GROUP"
else
    SERVICE_GROUP="${SERVICE_GROUP:-$SERVICE_USER}"
fi

# 清理组名字符
SERVICE_GROUP=$(echo "$SERVICE_GROUP" | tr -d -c '[:alnum:]_-')

# 验证用户是否存在
if ! id "$SERVICE_USER" &>/dev/null; then
    echo "错误: 用户 $SERVICE_USER 不存在"
    exit 1
fi

# 获取用户主目录
USER_HOME=$(getent passwd "$SERVICE_USER" | cut -d: -f6)
if [ -z "$USER_HOME" ]; then
    echo "错误: 无法获取用户 $SERVICE_USER 的主目录"
    exit 1
fi

echo ""
echo "配置信息："
echo "  服务用户: $SERVICE_USER"
echo "  服务组: $SERVICE_GROUP"
echo "  用户主目录: $USER_HOME"
echo ""

# 如果目标文件已存在，先备份
if [ -f "$SYSTEMD_PATH" ]; then
    BACKUP_FILE="${SYSTEMD_PATH}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$SYSTEMD_PATH" "$BACKUP_FILE"
    echo "  已备份旧服务文件到: $BACKUP_FILE"
fi

# 复制服务文件并替换占位符
# 使用临时文件避免直接覆盖
TMP_FILE=$(mktemp)
# 确保变量值不包含特殊字符，使用双引号保护
sed -e "s|%SERVICE_USER%|${SERVICE_USER}|g" \
    -e "s|%SERVICE_GROUP%|${SERVICE_GROUP}|g" \
    -e "s|%USER_HOME%|${USER_HOME}|g" \
    "$SERVICE_FILE" > "$TMP_FILE"

# 验证占位符是否全部被替换
if grep -q "%SERVICE_USER%\|%SERVICE_GROUP%\|%USER_HOME%" "$TMP_FILE"; then
    echo "错误: 服务文件中仍有未替换的占位符"
    echo "未替换的内容:"
    grep "%SERVICE_USER%\|%SERVICE_GROUP%\|%USER_HOME%" "$TMP_FILE" || true
    rm -f "$TMP_FILE"
    exit 1
fi

# 验证替换后的用户和组是否有效
REPLACED_USER=$(grep "^User=" "$TMP_FILE" | sed 's/User=//' | head -1)
REPLACED_GROUP=$(grep "^Group=" "$TMP_FILE" | sed 's/Group=//' | head -1)

if [ -z "$REPLACED_USER" ] || [ "$REPLACED_USER" = "%SERVICE_USER%" ]; then
    echo "错误: 用户占位符替换失败"
    rm -f "$TMP_FILE"
    exit 1
fi

if [ -z "$REPLACED_GROUP" ] || [ "$REPLACED_GROUP" = "%SERVICE_GROUP%" ]; then
    echo "错误: 组占位符替换失败"
    rm -f "$TMP_FILE"
    exit 1
fi

# 验证用户和组是否存在
if ! id "$REPLACED_USER" &>/dev/null; then
    echo "错误: 替换后的用户 $REPLACED_USER 不存在"
    rm -f "$TMP_FILE"
    exit 1
fi

# 移动临时文件到目标位置
mv "$TMP_FILE" "$SYSTEMD_PATH"
echo "✓ 服务文件已复制到 $SYSTEMD_PATH（已替换占位符）"
echo "  用户: $REPLACED_USER"
echo "  组: $REPLACED_GROUP"
echo ""
echo "验证替换结果（服务文件中的 User 和 Group 行）:"
grep -E "^User=|^Group=" "$SYSTEMD_PATH" || echo "  警告: 未找到 User 或 Group 行"

# 验证 systemd 配置文件语法
if ! systemd-analyze verify "$SYSTEMD_PATH" 2>/dev/null; then
    echo "警告: systemd 配置验证失败，但继续安装..."
    echo "配置文件内容（前15行）:"
    head -15 "$SYSTEMD_PATH"
fi

# 重新加载 systemd 配置
if ! systemctl daemon-reload; then
    echo "错误: systemd 配置重新加载失败"
    echo "请检查服务文件: $SYSTEMD_PATH"
    exit 1
fi
echo "✓ systemd 配置已重新加载"

# 启用服务（开机自动启动）
systemctl enable "$SERVICE_NAME"
echo "✓ 服务已启用（开机自动启动）"

# 询问是否立即启动服务
read -p "是否立即启动服务? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    systemctl start "$SERVICE_NAME"
    echo "✓ 服务已启动"
    
    # 显示服务状态
    sleep 2
    systemctl status "$SERVICE_NAME" --no-pager -l
fi

echo ""
echo "安装完成！"
echo ""
echo "常用命令："
echo "  启动服务:   sudo systemctl start $SERVICE_NAME"
echo "  停止服务:   sudo systemctl stop $SERVICE_NAME"
echo "  重启服务:   sudo systemctl restart $SERVICE_NAME"
echo "  查看状态:   sudo systemctl status $SERVICE_NAME"
echo "  查看日志:   sudo journalctl -u $SERVICE_NAME -f"
echo "  禁用自启:   sudo systemctl disable $SERVICE_NAME"
echo "  启用自启:   sudo systemctl enable $SERVICE_NAME"
echo "  查看日志:   sudo journalctl -u $SERVICE_NAME -n 100 -f"

# sudo journalctl -u aivoicelab.service -n 100 -f

