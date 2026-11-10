#!/bin/bash
# ============================================================
# 软件名 macOS 打包：.app bundle + DMG
# 对应方案：专题/分发与更新/默认安装目录规划方案.md —— macOS 契约落地
#
# macOS 契约要点：
#   - 程序区：/Applications/<AppName>.app（拖入安装，无自定义目录惯例）
#   - 数据区：~/Library/Application Support/<BundleID>/{config,data,logs}
#   - 缓存：  ~/Library/Caches/<BundleID>（OS 存储管理工具契约，唯一外置）
#   - 红线：  .app 包内运行期零写入（破坏代码签名）
#
# 用法：./make-dmg.sh <构建产物目录>（含 软件名.app）
# 产物：dist/<AppName>-<版本>.dmg
# ============================================================
set -euo pipefail

APP_NAME="${APP_NAME:-软件名}"
BUNDLE_ID="${BUNDLE_ID:-com.company.appname}"
APP_VERSION="${APP_VERSION:-1.9.0}"
BUILD_DIR="${1:?用法: make-dmg.sh <构建产物目录（含 .app）>}"
OUT_DIR="dist"
DMG_VOL="${APP_NAME} ${APP_VERSION}"

command -v hdiutil >/dev/null 2>&1 || { echo "错误: 仅 macOS 可运行（需 hdiutil）"; exit 1; }
[ -d "$BUILD_DIR/$APP_NAME.app" ] || { echo "错误: 构建产物缺少 $APP_NAME.app"; exit 1; }

mkdir -p "$OUT_DIR"
STAGING=$(mktemp -d)
trap 'rm -rf "$STAGING"' EXIT

# 1) 暂存 .app
cp -R "$BUILD_DIR/$APP_NAME.app" "$STAGING/"

# 2) Applications 快捷方式（拖入安装引导）
ln -s /Applications "$STAGING/Applications"

# 3) 数据目录预生成（首启也可自建——此处预生成让用户首开即看到契约结构）
SUPPORT_ROOT="$HOME/Library/Application Support/$BUNDLE_ID"
mkdir -p "$SUPPORT_ROOT"/{config,data,logs}
mkdir -p "$HOME/Library/Caches/$BUNDLE_ID"
echo "数据目录已就绪: $SUPPORT_ROOT"

# 4) 生成 DMG
hdiutil create -volname "$DMG_VOL" \
  -srcfolder "$STAGING" \
  -ov -format UDZO \
  "$OUT_DIR/${APP_NAME}-${APP_VERSION}.dmg"

echo "完成: $OUT_DIR/${APP_NAME}-${APP_VERSION}.dmg"
echo ""
echo "⚠ 红线提醒：.app 内运行期零写入——数据已全部走 ~/Library 契约目录。"
echo "  签名公证（正式分发必须）：codesign --deep --force --sign <身份> \"$APP_NAME.app\""
