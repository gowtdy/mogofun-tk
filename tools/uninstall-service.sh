#!/bin/bash

# MoGoFun 服务卸载脚本

set -e

SERVICE_NAME="mogofun.service"
SYSTEMD_PATH="/etc/systemd/system/$SERVICE_NAME"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "错误: 请使用 sudo 运行此脚本"
    exit 1
fi

echo "正在卸载 MoGoFun 服务..."

# 停止服务
if systemctl is-active --quiet "$SERVICE_NAME"; then
    systemctl stop "$SERVICE_NAME"
    echo "✓ 服务已停止"
fi

# 禁用服务
if systemctl is-enabled --quiet "$SERVICE_NAME" 2>/dev/null; then
    systemctl disable "$SERVICE_NAME"
    echo "✓ 服务已禁用"
fi

# 删除服务文件
if [ -f "$SYSTEMD_PATH" ]; then
    rm "$SYSTEMD_PATH"
    echo "✓ 服务文件已删除"
fi

# 重新加载 systemd 配置
systemctl daemon-reload
echo "✓ systemd 配置已重新加载"

echo ""
echo "卸载完成！"

