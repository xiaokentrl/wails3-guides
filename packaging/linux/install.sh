#!/bin/bash
# ============================================================
# 软件名 Linux 安装器（per-user 契约落地，零注册表概念天然成立）
# 对应方案：专题/分发与更新/默认安装目录规划方案.md —— Linux 契约
#
# 契约要点：
#   - 程序区：~/.local/opt/<app>/（per-user 免 sudo）或 /opt/<app>/（--system 需 sudo）
#   - 入口：  ~/.local/bin/<app> 或 /usr/local/bin/<app> 符号链接
#   - 数据根：~/.local/share/<app>/{config,data,logs}（单根四区）
#   - 缓存：  ~/.cache/<app>/（唯一外置——XDG 缓存契约）
#   - 卸载：  <app> uninstall（manifest 反向执行 + 数据区默认保留）
#
# 用法：./install.sh <构建产物目录（含可执行文件与资源）>
#       ./install.sh --uninstall
# ============================================================
set -euo pipefail

APP_ID="${APP_ID:-appname}"
APP_DISPLAY="${APP_DISPLAY:-软件名}"
APP_VERSION="${APP_VERSION:-1.9.0}"
SYSTEM_MODE=0
UNINSTALL=0
SRC=""

for arg in "$@"; do
  case "$arg" in
    --system)   SYSTEM_MODE=1 ;;
    --uninstall) UNINSTALL=1 ;;
    *) SRC="$arg" ;;
  esac
done

# ===== 路径解析（契约表）=====
if [ "$SYSTEM_MODE" = "1" ]; then
  INSTALL_DIR="/opt/$APP_ID"
  BIN_LINK="/usr/local/bin/$APP_ID"
else
  INSTALL_DIR="$HOME/.local/opt/$APP_ID"
  BIN_LINK="$HOME/.local/bin/$APP_ID"
fi
DATA_ROOT="$HOME/.local/share/$APP_ID"
CACHE_DIR="$HOME/.cache/$APP_ID"
MANIFEST="$INSTALL_DIR/manifest.txt"

# ===== 卸载：manifest 反向执行 =====
if [ "$UNINSTALL" = "1" ]; then
  echo "卸载 $APP_DISPLAY（数据目录 $DATA_ROOT 默认保留）"
  if [ -f "$MANIFEST" ]; then
    while IFS= read -r f; do
      [ -f "$f" ] && rm -f "$f"
    done < "$MANIFEST"
    # 自底向上删空目录（程序区内部）
    find "$INSTALL_DIR" -depth -type d -empty -delete 2>/dev/null || true
  fi
  rm -f "$BIN_LINK"
  rm -f "$HOME/.local/share/applications/$APP_ID.desktop"
  rm -f "$HOME/.cache/$APP_ID"/* 2>/dev/null || true
  rmdir "$HOME/.cache/$APP_ID" 2>/dev/null || true
  echo "完成。数据目录保留：$DATA_ROOT（彻底删除请手动 rm -rf）"
  exit 0
fi

[ -n "$SRC" ] && [ -d "$SRC" ] || { echo "用法: install.sh <产物目录> | --uninstall [--system]"; exit 1; }

# ===== 安装 =====
mkdir -p "$INSTALL_DIR" "$DATA_ROOT"/{config,data,logs} "$CACHE_DIR" "$HOME/.local/bin"

# 复制产物 + 所写即所录（manifest 逐文件记录）
: > "$MANIFEST"
find "$SRC" -type f | while read -r f; do
  rel="${f#"$SRC"/}"
  dest="$INSTALL_DIR/$rel"
  mkdir -p "$(dirname "$dest")"
  cp "$f" "$dest"
  echo "$dest" >> "$MANIFEST"
done
find "$SRC" -type d | while read -r d; do
  rel="${d#"$SRC"/}"
  [ -n "$rel" ] && echo "$INSTALL_DIR/$rel/" >> "$MANIFEST"
done

# 可执行权限
chmod +x "$INSTALL_DIR"/* 2>/dev/null || true

# 符号链接入口
mkdir -p "$(dirname "$BIN_LINK")"
ln -sfn "$INSTALL_DIR/$(ls "$SRC" | grep -E '^[^./]+$' | head -1)" "$BIN_LINK" 2>/dev/null || \
  ln -sfn "$INSTALL_DIR/$APP_ID" "$BIN_LINK"

# .desktop 入口（XDG 应用菜单）
mkdir -p "$HOME/.local/share/applications"
cat > "$HOME/.local/share/applications/$APP_ID.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=$APP_DISPLAY
Exec=$BIN_LINK
Path=$DATA_ROOT
Categories=Utility;
EOF

# 目录结构.txt（安装即生成——与 Windows manifest 对齐）
{
  echo "$APP_DISPLAY $APP_VERSION 目录结构"
  echo "====================================="
  echo "程序区（只读）：$INSTALL_DIR"
  echo "数据区：$DATA_ROOT"
  echo "  config/  配置文件"
  echo "  data/    用户数据"
  echo "  cache →  $CACHE_DIR（缓存外置——XDG 清理工具契约）"
  echo "  logs/    日志"
  echo "详见 manifest.txt（每个文件的绝对路径）。"
} > "$INSTALL_DIR/目录结构.txt"

echo "安装完成：$INSTALL_DIR"
echo "入口：$BIN_LINK"
echo "卸载：$BIN_LINK uninstall 或重新运行本脚本 --uninstall"
